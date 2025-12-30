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

    render() {
        if (!this.booking) return;

        const status = this.booking.status || 'upcoming';
        const isUpcoming = status === 'upcoming';
        
        // Format location (байршил)
        const location = this.booking.location || this.booking.salon || 'Байршил тодорхойгүй';
        
        // Format service name with subservice
        let serviceName = this.booking.service || 'Үйлчилгээ';
        if (this.booking.subService && this.booking.subService !== this.booking.service) {
            serviceName = `${this.booking.service} - ${this.booking.subService}`;
        }
        
        // Format time
        const timeDisplay = this.booking.time || '-';
        
        this.innerHTML = `
            <div class="booking-card-compact" data-booking-id="${this.booking.id}">
                <div class="card-left">
                    <div class="salon-name">${this.booking.salon || 'Beauty Salon'}</div>
                </div>
                
                <div class="card-right">
                    <div class="booking-info">
                        <div class="info-row">
                            <span class="label">Location:</span>
                            <span class="value">${location}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Service:</span>
                            <span class="value">${serviceName}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Time:</span>
                            <span class="value">${this.booking.dateFormatted || ''} ${timeDisplay}</span>
                        </div>
                        ${this.booking.price ? `
                        <div class="info-row price-row">
                            <span class="label">Price:</span>
                            <span class="value price-value">${this.booking.price}</span>
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
            </div>

            <style>
                booking-card {
                    display: block;
                    width: 100%;
                }

                .booking-card-compact {
                    background: #fce4ec;
                    border-radius: 25px;
                    padding: 16px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(236, 64, 122, 0.15);
                    margin-bottom: 12px;
                }

                .booking-card-compact:hover {
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(236, 64, 122, 0.25);
                }

                .card-left {
                    flex-shrink: 0;
                    min-width: 120px;
                }

                .salon-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                    font-style: italic;
                }

                .card-right {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                }

                .booking-info {
                    flex: 1;
                }

                .info-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 4px;
                    font-size: 14px;
                }

                .info-row:last-child {
                    margin-bottom: 0;
                }

                .label {
                    font-weight: 600;
                    color: #2c3e50;
                    font-style: italic;
                    min-width: 70px;
                }

                .value {
                    color: #555;
                    flex: 1;
                }

                .price-row {
                    margin-top: 6px;
                    padding-top: 6px;
                    border-top: 1px solid rgba(236, 64, 122, 0.2);
                }

                .price-value {
                    font-weight: 700;
                    color: #fc8eac;
                    font-size: 15px;
                }

                .card-actions {
                    display: flex;
                    gap: 8px;
                    flex-shrink: 0;
                    align-items: center;
                }

                .action-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                }

                .btn-reorder {
                    background: linear-gradient(135deg, #fc8eac 0%, #f594b6 100%);
                    color: white;
                    box-shadow: 0 2px 8px rgba(252, 142, 172, 0.3);
                }

                .btn-reorder:hover {
                    background: linear-gradient(135deg, #f594b6 0%, #fc8eac 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(252, 142, 172, 0.4);
                }

                .btn-reorder:active {
                    transform: translateY(0);
                }

                .action-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    transition: all 0.3s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .action-icon:hover {
                    background: white;
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                .action-icon:active {
                    transform: scale(0.95);
                }

                /* Mobile responsive */
                @media (max-width: 768px) {
                    .booking-card-compact {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 16px;
                    }

                    .card-left {
                        width: 100%;
                        margin-bottom: 8px;
                    }

                    .card-right {
                        width: 100%;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .booking-info {
                        width: 100%;
                    }

                    .card-actions {
                        width: 100%;
                        justify-content: flex-end;
                    }

                    .salon-name {
                        font-size: 16px;
                    }

                    .info-row {
                        font-size: 13px;
                    }

                    .label {
                        min-width: 60px;
                    }
                }

                @media (max-width: 480px) {
                    .info-row {
                        flex-direction: column;
                        gap: 2px;
                    }
                    
                    .label {
                        min-width: auto;
                    }
                }
            </style>
        `;
    }

    attachEvents() {
        // Handle all action buttons (complete, delete, reorder)
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

        // Click on card to view details (optional)
        this.querySelector('.booking-card-compact')?.addEventListener('click', () => {
            console.log('Card clicked:', this.booking);
            // Can add modal or detail view here
        });
    }

    handleReorder(bookingId) {
        const booking = this.booking;
        
        if (confirm(`"${booking.salon}" салонд "${booking.service}" үйлчилгээг дахин захиалах уу?`)) {
            // Create booking dialog with pre-filled data
            const bookingDialog = document.createElement('booking-dialog');
            
            // Set all attributes from the booking
            bookingDialog.setAttribute('service-name', booking.service || '');
            bookingDialog.setAttribute('service-category', booking.category || '');
            bookingDialog.setAttribute('service-duration', booking.duration || '');
            bookingDialog.setAttribute('service-price', booking.price || '');
            bookingDialog.setAttribute('salon-name', booking.salon || '');
            bookingDialog.setAttribute('salon-id', booking.salonId || booking.salon || '');
            
            // Set available dates (next 30 days)
            const availableDates = this.generateAvailableDates();
            bookingDialog.setAttribute('available-dates', JSON.stringify(availableDates));
            
            // Set available times (9:00 - 22:00)
            const availableTimes = this.generateAvailableTimes();
            bookingDialog.setAttribute('available-times', JSON.stringify(availableTimes));
            
            // Add to body
            document.body.appendChild(bookingDialog);
            
            // Show dialog after a brief delay
            setTimeout(() => {
                bookingDialog.show();
            }, 100);
            
            // Show notification
            this.showNotification('Дахин захиалах цонх нээгдэж байна...', 'success');
            
            // Dispatch reorder event
            this.dispatchEvent(new CustomEvent('booking-reorder', {
                detail: { originalBooking: booking },
                bubbles: true,
                composed: true
            }));
        }
    }

    generateAvailableDates() {
        const dates = [];
        const today = new Date();
        
        // Generate next 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        
        return dates;
    }

    generateAvailableTimes() {
        const times = [];
        
        // Generate times from 9:00 to 22:00
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