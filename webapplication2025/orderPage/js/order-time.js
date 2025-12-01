class OrderTime extends HTMLElement {
    constructor() {
        super();
        this.selectedTime = null;
        this.timeSlots = {
            'Өглөө': ['09:00', '10:00', '11:00', '12:00'],
            'Өдөр': ['13:00', '14:00', '15:00', '16:00', '17:00'],
            'Орой': ['18:00', '19:00', '20:00', '21:00', '22:00']
        };
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }
    render() {
        this.innerHTML = `
            <style>
                .order-time-container {
                    font-family:italic 400 1rem "Nunito", sans-serif;
                    width: 100%;
                    max-width: 500px;
                }

                .time-slots-container {
                    background: white;
                    border-radius: 25px;
                    padding: 25px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                .time-period {
                    margin-bottom: 25px;
                }

                .time-period:last-child {
                    margin-bottom: 0;
                }

                .period-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 15px;
                }

                .time-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .time-btn {
                    background: #fce4ec;
                    color: #333;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .time-btn:hover {
                    background: #f8bbd0;
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .time-btn.selected {
                    background: #ec407a;
                    color: white;
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(236, 64, 122, 0.4);
                }
            </style>

            <div class="order-time-container">
                <div class="time-slots-container">
                    ${this.renderTimeSlots()}
                </div>
            </div>
        `;
    }

    renderTimeSlots() {
        return Object.entries(this.timeSlots)
            .map(([period, times]) => `
                <div class="time-period">
                    <div class="period-title">${period}</div>
                    <div class="time-buttons">
                        ${times.map(time => `
                            <button class="time-btn" data-time="${time}">${time}</button>
                        `).join('')}
                    </div>
                </div>
            `).join('');
    }

    attachEventListeners() {
        const timeButtons = this.querySelectorAll('.time-btn');
        timeButtons.forEach(button => {
            button.addEventListener('click', this.handleTimeClick.bind(this));
        });
    }

    removeEventListeners() {
        const timeButtons = this.querySelectorAll('.time-btn');
        timeButtons.forEach(button => {
            button.removeEventListener('click', this.handleTimeClick);
        });
    }

    handleTimeClick(event) {
        const button = event.target;
        const time = button.getAttribute('data-time');
        this.selectedTime = time;
        const allButtons = this.querySelectorAll('.time-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        this.dispatchEvent(new CustomEvent('time-selected', {
            detail: { time: time },
            bubbles: true,
            composed: true
        }));

        console.log('Сонгосон цаг:', time);
    }
    getSelectedTime() {
        return this.selectedTime;
    }

    setTimeSlots(newSlots) {
        this.timeSlots = newSlots;
        this.render();
        this.attachEventListeners();
    }

    reset() {
        this.selectedTime = null;
        const allButtons = this.querySelectorAll('.time-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
    }
    
}
window.customElements.define('order-time', OrderTime);
