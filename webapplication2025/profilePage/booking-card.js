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
        
        this.innerHTML = `
            <div class="booking-card-compact" data-booking-id="${this.booking.id}">
                <div class="card-left">
                    <div class="salon-name">${this.booking.salon || 'Beauty Salon'}</div>
                </div>
                
                <div class="card-right">
                    <div class="booking-info">
                        <div class="info-row">
                            <span class="label">Location:</span>
                            <span class="value">${this.booking.service || ''}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Time:</span>
                            <span class="value">${this.booking.dateFormatted || ''} ${this.booking.time || ''}</span>
                        </div>
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
                }

                .value {
                    color: #555;
                }

                .card-actions {
                    display: flex;
                    gap: 8px;
                    flex-shrink: 0;
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
                }

                @media (max-width: 480px) {
                    .info-row {
                        flex-direction: column;
                        gap: 2px;
                    }
                }
            </style>
        `;
    }

    attachEvents() {
        this.querySelectorAll('.action-icon').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.currentTarget.dataset.action;
                const bookingId = e.currentTarget.dataset.id;

                this.dispatchEvent(new CustomEvent('booking-action', {
                    detail: { action, bookingId },
                    bubbles: true,
                    composed: true
                }));
            });
        });

        // Click on card to view details (optional)
        this.querySelector('.booking-card-compact').addEventListener('click', () => {
            console.log('Card clicked:', this.booking);
            // Can add modal or detail view here
        });
    }

    updateCard(bookingData) {
        this.booking = bookingData;
        this.render();
        this.attachEvents();
    }
}

customElements.define('booking-card', BookingCard);