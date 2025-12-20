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

        const statusText = {
            'upcoming': 'Удахгүй',
            'completed': 'Дууссан',
            'cancelled': 'Цуцлагдсан'
        };

        const status = this.booking.status || 'upcoming';
        const statusClass = `status-${status}`;
        const createdDate = new Date(this.booking.timestamp);
        const isAutoCompleted = this.booking.autoCompletedAt !== undefined;
        
        this.innerHTML = `
            <div class="booking-card-wrapper" data-booking-id="${this.booking.id}">
                <div class="booking-card-header">
                    <div class="booking-card-salon">
                        <h3 class="salon-name">${this.booking.salon || 'Салон'}</h3>
                        <p class="booking-id">ID: ${this.booking.id}</p>
                    </div>
                    <span class="status-badge ${statusClass}">
                        ${statusText[status]}
                        ${isAutoCompleted ? '<span class="auto-badge">Автомат</span>' : ''}
                    </span>
                </div>

                <div class="booking-card-service">
                    <div class="service-name">${this.booking.service}</div>
                    <div class="service-category">📂 ${this.booking.category}</div>
                    <div class="service-meta">
                        <span class="meta-item">⏱ ${this.booking.duration}</span>
                    </div>
                </div>

                <div class="booking-card-datetime">
                    <div class="datetime-box date-box">
                        <div class="datetime-label">Өдөр</div>
                        <div class="datetime-value">${this.booking.dateFormatted || new Date(this.booking.date).toLocaleDateString('mn-MN')}</div>
                    </div>
                    <div class="datetime-box time-box">
                        <div class="datetime-label">Цаг</div>
                        <div class="datetime-value">${this.booking.time}</div>
                    </div>
                </div>

                <div class="booking-card-price">${this.booking.price}</div>

                ${status === 'upcoming' ? `
                    <div class="booking-card-actions">
                        <button class="action-btn btn-complete" data-action="complete" data-id="${this.booking.id}">
                            ✓ Дууссан
                        </button>
                        <button class="action-btn btn-cancel" data-action="cancel" data-id="${this.booking.id}">
                            ✕ Цуцлах
                        </button>
                    </div>
                ` : ''}

                <div class="booking-card-timestamp">
                    Бүртгэсэн: ${createdDate.toLocaleString('mn-MN')}
                    ${isAutoCompleted ? '<br><small>🤖 Хугацаа өнгөрсөн тул автоматаар дууссан</small>' : ''}
                </div>
            </div>

            <style>
                booking-card {
                    display: block;
                    width: 100%;
                }

                .booking-card-wrapper {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    position: relative;
                }

                .booking-card-wrapper:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    border-color: #667eea;
                }

                .booking-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }

                .booking-card-salon {
                    flex: 1;
                }

                .salon-name {
                    font-size: 20px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin: 0 0 4px 0;
                }

                .booking-id {
                    font-size: 12px;
                    color: #95a5a6;
                    margin: 0;
                }

                .status-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .status-upcoming {
                    background: #e8f5e9;
                    color: #2e7d32;
                }

                .status-completed {
                    background: #e3f2fd;
                    color: #1565c0;
                }

                .status-cancelled {
                    background: #ffebee;
                    color: #c62828;
                }

                .auto-badge {
                    display: inline-block;
                    font-size: 10px;
                    background: #fff3cd;
                    color: #856404;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .booking-card-service {
                    background: #f8f9fa;
                    padding: 16px;
                    border-radius: 12px;
                    margin-bottom: 16px;
                }

                .service-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #34495e;
                    margin-bottom: 8px;
                }

                .service-category {
                    color: #7f8c8d;
                    font-size: 14px;
                    margin-bottom: 12px;
                }

                .service-meta {
                    display: flex;
                    gap: 20px;
                    font-size: 14px;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #7f8c8d;
                }

                .booking-card-datetime {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .datetime-box {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    text-align: center;
                }

                .datetime-label {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-bottom: 4px;
                }

                .datetime-value {
                    font-size: 18px;
                    font-weight: bold;
                }

                .booking-card-price {
                    font-size: 24px;
                    font-weight: bold;
                    color: #27ae60;
                    text-align: center;
                    margin: 16px 0;
                }

                .booking-card-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 16px;
                }

                .action-btn {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .btn-cancel {
                    background: #ffebee;
                    color: #c62828;
                }

                .btn-cancel:hover {
                    background: #ef5350;
                    color: white;
                    transform: translateY(-2px);
                }

                .btn-complete {
                    background: #e8f5e9;
                    color: #2e7d32;
                }

                .btn-complete:hover {
                    background: #66bb6a;
                    color: white;
                    transform: translateY(-2px);
                }

                .booking-card-timestamp {
                    font-size: 12px;
                    color: #95a5a6;
                    text-align: center;
                    margin-top: 12px;
                }

                .booking-card-timestamp small {
                    color: #856404;
                }

                /* Mobile responsive */
                @media (max-width: 768px) {
                    .booking-card-datetime {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    }

    attachEvents() {
        // Action buttons
        this.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const bookingId = e.target.dataset.id;

                // Dispatch event upwards to booking-list
                this.dispatchEvent(new CustomEvent('booking-action', {
                    detail: { action, bookingId },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }

    // Public method to update card
    updateCard(bookingData) {
        this.booking = bookingData;
        this.render();
        this.attachEvents();
    }
}

customElements.define('booking-card', BookingCard);