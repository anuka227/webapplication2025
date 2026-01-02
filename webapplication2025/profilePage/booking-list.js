import { showNotification } from '../salon-notification.js';

class BookingList extends HTMLElement {
    constructor() {
        super();
        this.bookings = [];
        this.filter = 'all';
    }

    connectedCallback() {
        this.loadBookings();
        this.render();
        this.attachEvents();
        
        window.addEventListener('booking-added', () => {
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
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = currentUser.id || currentUser.email || 'anonymous';
            
            const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            this.bookings = allBookings.filter(b => b.userId === userId);
            
            this.bookings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
         
        } catch (error) {
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
            console.error('Error auto-completing bookings:', error);
        }
    }

    getFilteredBookings() {
        this.autoCompleteExpiredBookings();
        this.loadBookings();
        
        switch(this.filter) {
            case 'all':
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
            'all': '📅',
            'history': '📋'
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
                this.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                const tabValue = e.currentTarget.dataset.tab;
                this.filter = tabValue;
                
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
            showNotification('Захиалга амжилттай устгагдлаа');
            window.dispatchEvent(new CustomEvent('booking-deleted', {
                detail: { bookingId }
            }));
        } catch (error) {
            showNotification('Алдаа гарлаа');
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
                window.dispatchEvent(new CustomEvent('booking-completed', {
                    detail: { bookingId }
                }));
            }
        } catch (error) {
            showNotification('Алдаа гарлаа');
        }
    }
}

customElements.define('booking-list', BookingList);