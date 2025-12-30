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
        
        window.addEventListener('booking-added', () => {
            console.log('🎉 Booking added event received');
            this.loadBookings();
            this.render();
            this.attachEvents();
        });

        this.addEventListener('booking-action', (e) => {
            const { action, bookingId } = e.detail;
            if (action === 'delete') {
                this.deleteBooking(bookingId);
            } else if (action === 'complete') {
                this.completeBooking(bookingId);
            }
        });
    }

    static get observedAttributes() {
        return ['filter'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'filter' && oldVal !== newVal) {
            this.filter = newVal;
            this.render();
            this.attachEvents();
        }
    }

loadBookings() {
    try {
        // ✅ Current user олох
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = currentUser.id || currentUser.email || 'anonymous';
        
        // ✅ Зөвхөн энэ хэрэглэгчийн захиалгууд
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        this.bookings = allBookings.filter(b => b.userId === userId);
        
        // Sort by timestamp (newest first)
        this.bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        console.log('📊 Loaded', this.bookings.length, 'bookings for user:', userId);
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
            }
        } catch (error) {
            console.error('❌ Error auto-completing:', error);
        }
    }

    getFilteredBookings() {
    this.autoCompleteExpiredBookings();
    this.loadBookings();
    
    switch(this.filter) {
        case 'all':  // ✅ 'upcoming' -> 'all' болгох
            return this.bookings.filter(b => 
                (b.status === 'upcoming' || !b.status) && !this.isBookingPast(b)
            );
        case 'history':
            return this.bookings.filter(b => 
                b.status === 'completed' || b.status === 'cancelled' || this.isBookingPast(b)
            );
        default:
            return this.bookings;
    }
}

    render() {
        const filteredBookings = this.getFilteredBookings();
        const upcomingCount = this.bookings.filter(b => 
            (b.status === 'upcoming' || !b.status) && !this.isBookingPast(b)
        ).length;
        const historyCount = this.bookings.filter(b => 
            b.status === 'completed' || b.status === 'cancelled' || this.isBookingPast(b)
        ).length;
        
        this.innerHTML = `
            <div class="booking-list-container">
                <div class="booking-list-header">
                    <h2 class="booking-list-title">Миний захиалгууд</h2>
                </div>

                <div id="bookingTabs" class="filter-tabs">
                    <button class="tab ${this.filter === 'all' ? 'active' : ''}" data-tab="all">
                        Захиалга 
                    </button>
                    <button class="tab ${this.filter === 'history' ? 'active' : ''}" data-tab="history">
                        Захиалгын түүх 
                    </button>
                </div>

                <div class="bookings-grid">
                    ${filteredBookings.length > 0 
                        ? filteredBookings.map(booking => this.renderBookingCard(booking)).join('')
                        : this.renderEmptyState()
                    }
                </div>
            </div>

            <style>
                :host {
                    --color-order: #fc8eac;
                    --color-pink-default: #fce4ec;
                    --color-pink-selected: #f594b6;
                    --color-white: #ffffff;
                    --color-hover-gray: rgba(0, 0, 0, 0.05);
                    --color-border: rgba(236, 64, 122, 0.2);
                    --color-salon: rgba(236, 64, 122, 0.08);
                }

                .booking-list-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 25px;
                }

                .booking-list-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 2px solid var(--color-border);
                }

                .booking-list-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0;
                }

                .booking-count {
                    background: var(--color-order);
                    color: var(--color-white);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .filter-tabs {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                }

                .tab {
                    flex: 1;
                    min-width: 150px;
                    padding: 14px 24px;
                    background: var(--color-white);
                    border: 2px solid var(--color-border);
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: inherit;
                    font-size: 15px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .tab:hover {
                    background: var(--color-hover-gray);
                    border-color: var(--color-pink-selected);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(236, 64, 122, 0.2);
                }

                .tab.active {
                    background: linear-gradient(135deg, #ecc2d0 0%, #eba7ac 100%);
                    border-color: transparent;
                    color: white;
                    box-shadow: 0 4px 12px rgba(236, 64, 122, 0.3);
                }

                .bookings-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    animation: fadeIn 0.5s ease-in;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    background: var(--color-pink-default);
                    border-radius: 16px;
                    border: 2px dashed var(--color-border);
                }

                .empty-icon {
                    font-size: 80px;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }

                .empty-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 12px;
                }

                .empty-message {
                    font-size: 16px;
                    color: #7f8c8d;
                }

                @media (max-width: 768px) {
                    .booking-list-container {
                        padding: 16px;
                    }

                    .booking-list-title {
                        font-size: 22px;
                    }

                    .filter-tabs {
                        flex-wrap: nowrap;
                        overflow-x: auto;
                    }

                    .tab {
                        min-width: 120px;
                        flex: 0 0 auto;
                        padding: 12px 20px;
                        font-size: 14px;
                    }
                }
            </style>
        `;
    }

    renderBookingCard(booking) {
        return `<booking-card booking-data='${JSON.stringify(booking)}'></booking-card>`;
    }

    renderEmptyState() {
        const messages = {
            'all': 'Танд одоогоор захиалга байхгүй байна',
            'history': 'Захиалгын түүх байхгүй байна'
        };

        const icons = {
            'all': '',
            'history': ''
        };

        return `
            <div class="empty-state">
                <div class="empty-icon">${icons[this.filter]}</div>
                <div class="empty-title">Захиалга олдсонгүй</div>
                <div class="empty-message">${messages[this.filter]}</div>
            </div>
        `;
    }

    attachEvents() {
        this.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Remove active from all tabs
                this.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                
                // Add active to clicked tab
                e.currentTarget.classList.add('active');
                
                // Update filter
                const tabValue = e.currentTarget.dataset.tab;
                this.filter = tabValue;
                
                // Re-render
                this.render();
                this.attachEvents();
            });
        });
    }

    deleteBooking(bookingId) {
        if (!confirm('Та энэ захиалгыг устгахдаа итгэлтэй байна уу?')) {
            return;
        }

        try {
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings = bookings.filter(b => b.id !== bookingId);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            this.loadBookings();
            this.render();
            this.attachEvents();
            
            this.showNotification('Захиалга амжилттай устгагдлаа', 'success');
            
            window.dispatchEvent(new CustomEvent('booking-deleted', {
                detail: { bookingId }
            }));
        } catch (error) {
            console.error('Error deleting booking:', error);
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
            background: ${type === 'success' ? '#fc8eac' : '#ff5252'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(252, 142, 172, 0.4);
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