class BookingCard extends HTMLElement {
    constructor() {
        super();
        this.booking = null;
    }

    connectedCallback() {
        const bookingData = this.getAttribute('booking-data');
        
        if (bookingData) {
            try {
                this.booking = JSON.parse(bookingData);
                this.render();
                this.attachEvents();
            } catch (error) {
                console.error('Error parsing booking data:', error);
                this.innerHTML = '<div class="error">Алдаа гарлаа</div>';
            }
        }
    }
    formatPrice(price) {
        if (!price) return '';
        if (price.toString().includes('₮')) {
            return price;
        }
        const numericPrice = typeof price === 'number' ? price : parseFloat(price.replace(/[^\d]/g, ''));
        if (isNaN(numericPrice)) return price;
        const formatted = numericPrice.toLocaleString('en-US');
        
        return `${formatted}₮`;
    }

    render() {
        if (!this.booking) return;

        const status = this.booking.status || 'upcoming';
        const isUpcoming = status === 'upcoming';
        const location = this.booking.location || this.booking.salon || 'Байршил тодорхойгүй';
        
        let serviceName = this.booking.service || 'Үйлчилгээ';
        if (this.booking.subService && this.booking.subService !== this.booking.service) {
            serviceName = `${this.booking.service} - ${this.booking.subService}`;
        }
        
        const timeDisplay = this.booking.time || '-';
        const formattedPrice = this.formatPrice(this.booking.price);
        
        this.innerHTML = `
            <div class="booking-card-compact" data-booking-id="${this.booking.id}">
                <div class="card-left">
                    <div class="salon-name">${this.booking.salon || 'Beauty Salon'}</div>
                </div>
                
                <div class="card-right">
                    <div class="booking-info">
                        <div class="info-row">
                            <span class="label">Байршил:</span>
                            <span class="value">${location}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Үйлчилгээ:</span>
                            <span class="value">${serviceName}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Он сар, цаг:</span>
                            <span class="value">${this.booking.dateFormatted || ''} ${timeDisplay}</span>
                        </div>
                        ${formattedPrice ? `
                        <div class="info-row price-row">
                            <span class="label">Үнэ:</span>
                            <span class="value price-value">${formattedPrice}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${isUpcoming ? `
                        <div class="card-actions">
                            <button class="action-icon" data-action="complete" data-id="${this.booking.id}" title="Дууссан">
                                ✓
                            </button>
                            <button class="action-icon" data-action="delete" data-id="${this.booking.id}" title="Устгах">
                                🗑
                            </button>
                        </div>
                    ` : `
                        <div class="card-actions">
                            <button class="action-btn btn-reorder" data-action="reorder" data-id="${this.booking.id}">
                                Дахин захиалах
                            </button>
                            <button class="action-icon" data-action="delete" data-id="${this.booking.id}" title="Устгах">
                                🗑
                            </button>
                        </div>
                    `}
                </div>
            </div>`;
    }

    attachEvents() {
        this.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.currentTarget.dataset.action;
                const bookingId = e.currentTarget.dataset.id;

                if (action === 'reorder') {
                    this.handleReorder(bookingId);
                } else {
                    this.dispatchEvent(new CustomEvent('booking-action', {
                        detail: { action, bookingId },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
        });

        this.querySelector('.booking-card-compact')?.addEventListener('click', () => {
            console.log('Card clicked:', this.booking);
        });
    }

    handleReorder(bookingId) {
        const booking = this.booking;
        
        if (confirm(`"${booking.salon}" салонд "${booking.service}" үйлчилгээг дахин захиалах уу?`)) {
            const bookingDialog = document.createElement('booking-dialog');
        
            bookingDialog.setAttribute('service-name', booking.service || '');
            bookingDialog.setAttribute('service-category', booking.category || '');
            bookingDialog.setAttribute('service-duration', booking.duration || '');
            
            const formattedPrice = this.formatPrice(booking.price);
            bookingDialog.setAttribute('service-price', formattedPrice);
            
            bookingDialog.setAttribute('salon-name', booking.salon || '');
            bookingDialog.setAttribute('salon-id', booking.salonId || booking.salon || '');
            
            const availableDays = this.getSalonWorkingDays(booking.salonId);
            bookingDialog.setAttribute('available-days', JSON.stringify(availableDays));
            bookingDialog.setAttribute('min-date', new Date().toISOString());
            
            const availableTimes = this.generateAvailableTimes();
            bookingDialog.setAttribute('available-times', JSON.stringify(availableTimes));
            
            document.body.appendChild(bookingDialog);
            
            setTimeout(() => {
                bookingDialog.show();
            }, 100);
            
            this.showNotification('🔄 Дахин захиалах цонх нээгдэж байна...', 'success');
            
            this.dispatchEvent(new CustomEvent('booking-reorder', {
                detail: { originalBooking: booking },
                bubbles: true,
                composed: true
            }));
        }
    }

    getSalonWorkingDays(salonId) {
        return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }

    generateAvailableTimes() {
        const times = [];
        for (let hour = 9; hour <= 22; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return times;
    }

    showNotification(message, type = 'success') {
        const existingNotif = document.querySelector('.booking-card-notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `booking-card-notification notification-${type}`;
        notification.textContent = message;
        
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
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    updateCard(bookingData) {
        this.booking = bookingData;
        this.render();
        this.attachEvents();
    }
}

customElements.define('booking-card', BookingCard);