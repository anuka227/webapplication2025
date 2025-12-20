class BookingList extends HTMLElement {
    constructor() {
        super();
        this.bookings = [];
        this.filter = 'all';
    }

    connectedCallback() {
        console.log('📋 BookingList component connected');
        this.loadBookings();
        this.render();
        this.attachEvents();
        
        // Listen for new bookings
        window.addEventListener('booking-added', () => {
            console.log('🎉 Booking added event received');
            this.loadBookings();
            this.render();
            this.attachEvents();
        });

        // Listen for booking actions from cards
        this.addEventListener('booking-action', (e) => {
            const { action, bookingId } = e.detail;
            if (action === 'cancel') {
                this.cancelBooking(bookingId);
            } else if (action === 'complete') {
                this.completeBooking(bookingId);
            }
        });
    }

    disconnectedCallback() {
        // Cleanup
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'filter' && oldVal !== newVal) {
            this.filter = newVal;
            this.render();
            this.attachEvents();
        }
    }

    adoptedCallback() {
        // Called when moved to new document
    }

    static get observedAttributes() {
        return ['filter'];
    }

    loadBookings() {
        try {
            const stored = localStorage.getItem('bookings');
            this.bookings = stored ? JSON.parse(stored) : [];
            
            // Sort by timestamp (newest first)
            this.bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            console.log('📊 Loaded', this.bookings.length, 'bookings');
        } catch (error) {
            console.error('❌ Error loading bookings:', error);
            this.bookings = [];
        }
    }

    isBookingPast(booking) {
        const now = new Date();
        const bookingDateTime = new Date(booking.date);
        
        if (booking.time) {
            const [hours, minutes] = booking.time.split(':').map(Number);
            bookingDateTime.setHours(hours, minutes, 0, 0);
        }
        
        return bookingDateTime < now;
    }

    autoCompleteExpiredBookings() {
        try {
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            let hasChanges = false;
            
            bookings = bookings.map(booking => {
                if ((booking.status === 'upcoming' || !booking.status) && this.isBookingPast(booking)) {
                    hasChanges = true;
                    console.log('⏰ Auto-completing expired booking:', booking.id);
                    return {
                        ...booking,
                        status: 'completed',
                        autoCompletedAt: new Date().toISOString()
                    };
                }
                return booking;
            });
            
            if (hasChanges) {
                localStorage.setItem('bookings', JSON.stringify(bookings));
                console.log('✅ Expired bookings auto-completed');
            }
        } catch (error) {
            console.error('❌ Error auto-completing:', error);
        }
    }

    getFilteredBookings() {
        // Auto-complete expired bookings first
        this.autoCompleteExpiredBookings();
        
        // Reload bookings after auto-complete
        this.loadBookings();
        
        switch(this.filter) {
            case 'upcoming':
                return this.bookings.filter(b => 
                    (b.status === 'upcoming' || !b.status) && !this.isBookingPast(b)
                );
            case 'completed':
                return this.bookings.filter(b => b.status === 'completed');
            case 'cancelled':
                return this.bookings.filter(b => b.status === 'cancelled');
            default:
                return this.bookings;
        }
    }

    render() {
        const filteredBookings = this.getFilteredBookings();
        const upcomingCount = this.bookings.filter(b => 
            (b.status === 'upcoming' || !b.status) && !this.isBookingPast(b)
        ).length;
        const completedCount = this.bookings.filter(b => b.status === 'completed').length;
        const cancelledCount = this.bookings.filter(b => b.status === 'cancelled').length;
        
        this.innerHTML = `
            <div class="booking-list-container">
                <div class="booking-list-header">
                    <h2 class="booking-list-title">Миний захиалгууд</h2>
                    <div class="booking-count">${filteredBookings.length} захиалга</div>
                </div>

                <div class="filter-tabs">
                    <button class="filter-tab ${this.filter === 'all' ? 'active' : ''}" data-filter="all">
                        Бүгд (${this.bookings.length})
                    </button>
                    <button class="filter-tab ${this.filter === 'upcoming' ? 'active' : ''}" data-filter="upcoming">
                        Удахгүй (${upcomingCount})
                    </button>
                    <button class="filter-tab ${this.filter === 'completed' ? 'active' : ''}" data-filter="completed">
                        Дууссан (${completedCount})
                    </button>
                    <button class="filter-tab ${this.filter === 'cancelled' ? 'active' : ''}" data-filter="cancelled">
                        Цуцлагдсан (${cancelledCount})
                    </button>
                </div>

                <div class="bookings-grid">
                    ${filteredBookings.length > 0 
                        ? filteredBookings.map(booking => this.renderBookingCard(booking)).join('')
                        : this.renderEmptyState()
                    }
                </div>
            </div>
        `;
    }

    renderBookingCard(booking) {
        // Use booking-card component
        return `<booking-card booking-data='${JSON.stringify(booking)}'></booking-card>`;
    }

    renderEmptyState() {
        const messages = {
            'all': 'Танд одоогоор захиалга байхгүй байна',
            'upcoming': 'Удахгүй болох захиалга байхгүй байна',
            'completed': 'Дууссан захиалга байхгүй байна',
            'cancelled': 'Цуцлагдсан захиалга байхгүй байна'
        };

        return `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <div class="empty-title">Захиалга олдсонгүй</div>
                <div class="empty-message">${messages[this.filter]}</div>
            </div>
        `;
    }

    attachEvents() {
        // Filter tabs
        this.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.filter = e.target.dataset.filter;
                this.render();
                this.attachEvents();
            });
        });
    }

    cancelBooking(bookingId) {
        if (!confirm('Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?')) {
            return;
        }

        try {
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const bookingIndex = bookings.findIndex(b => b.id === bookingId);
            
            if (bookingIndex !== -1) {
                bookings[bookingIndex].status = 'cancelled';
                bookings[bookingIndex].cancelledAt = new Date().toISOString();
                localStorage.setItem('bookings', JSON.stringify(bookings));
                
                this.loadBookings();
                this.render();
                this.attachEvents();
                
                this.showNotification('Захиалга амжилттай цуцлагдлаа', 'success');
                
                window.dispatchEvent(new CustomEvent('booking-cancelled', {
                    detail: { bookingId }
                }));
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            this.showNotification('Алдаа гарлаа', 'error');
        }
    }

    completeBooking(bookingId) {
        try {
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const bookingIndex = bookings.findIndex(b => b.id === bookingId);
            
            if (bookingIndex !== -1) {
                bookings[bookingIndex].status = 'completed';
                bookings[bookingIndex].completedAt = new Date().toISOString();
                localStorage.setItem('bookings', JSON.stringify(bookings));
                
                this.loadBookings();
                this.render();
                this.attachEvents();
                
                this.showNotification('Захиалга дууссан гэж тэмдэглэгдлээ', 'success');
                
                window.dispatchEvent(new CustomEvent('booking-completed', {
                    detail: { bookingId }
                }));
            }
        } catch (error) {
            console.error('Error completing booking:', error);
            this.showNotification('Алдаа гарлаа', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const existingNotif = document.querySelector('.booking-notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `booking-notification notification-${type}`;
        notification.innerHTML = `
            <span>${type === 'success' ? '✓' : '⚠'}</span>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#ff5252'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            font-family: system-ui;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }
}

customElements.define('booking-list', BookingList);