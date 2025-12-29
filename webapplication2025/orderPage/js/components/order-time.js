// orderPage/js/components/order-time.js

class OrderTime extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupOrderInnerIntegration();
    }

    render() {
        // Default time slots
        const defaultTimes = [];
        for (let hour = 9; hour <= 22; hour++) {
            defaultTimes.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        this.innerHTML = `
        <div class="order-time-pick">
        <time-picker 
                available-times='${JSON.stringify(defaultTimes)}'>
            </time-picker>
        </div>
            
        `;
    }

    setupOrderInnerIntegration() {
        const timePicker = this.querySelector('time-picker');
        const orderInner = this.closest('order-inner');

        if (!timePicker || !orderInner) return;

        const btn = orderInner.querySelector('.toggle-btn');
        const btnText = btn?.querySelector('p');
        const contentDiv = orderInner.querySelector('.hidden-content');

        timePicker.addEventListener('time-selected', (e) => {
            const selectedTime = e.detail.time;

            if (btnText) {
                btnText.textContent = selectedTime;
            }

            if (contentDiv) {
                contentDiv.classList.remove('show');
            }

            if (window.orderManager) {
                window.orderManager.updateTime(selectedTime);
            }
        });
    }

    getSelectedTime() {
        const timePicker = this.querySelector('time-picker');
        return timePicker ? timePicker.getSelectedTime() : null;
    }

    setTimeSlots(times) {
        const timePicker = this.querySelector('time-picker');
        if (timePicker) {
            timePicker.setAvailableTimes(times);
        }
    }
}

customElements.define('order-time', OrderTime);