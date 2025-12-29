// orderPage/js/components/order-date.js

class OrderDate extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupOrderInnerIntegration();
    }

    render() {
        this.innerHTML = `<calendar-picker></calendar-picker>`;
    }

    setupOrderInnerIntegration() {
        const calendarPicker = this.querySelector('calendar-picker');
        const orderInner = this.closest('order-inner');
        
        if (!calendarPicker || !orderInner) return;

        const btn = orderInner.querySelector('.toggle-btn');
        const btnText = btn?.querySelector('p');
        const contentDiv = orderInner.querySelector('.hidden-content');

        // calendar-picker-ын event-ийг сонсох
        calendarPicker.addEventListener('date-selected', (e) => {
            const selectedDate = e.detail.formatted;
            const dateObj = e.detail.date;
            
            if (btnText) {
                btnText.textContent = selectedDate;
            }
            
            if (contentDiv) {
                contentDiv.classList.remove('show');
            }
            
            // OrderManager руу илгээх
            if (window.orderManager) {
                window.orderManager.updateDate(dateObj);
            }
        });
    }

    getSelectedDate() {
        const calendarPicker = this.querySelector('calendar-picker');
        return calendarPicker ? calendarPicker.getSelectedDate() : null;
    }

    setDate(date) {
        const calendarPicker = this.querySelector('calendar-picker');
        if (calendarPicker) {
            calendarPicker.setDate(date);
        }
    }
}

customElements.define('order-date', OrderDate);