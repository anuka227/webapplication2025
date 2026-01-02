// orderPage/js/components/calendar-picker.js

class CalendarPicker extends HTMLElement {
    constructor() {
        super();
        this.currentDate = new Date();
        this.selectedDate = null;
        this.minDate = new Date(); // Өнөөдрөөс өмнөх өдрүүдийг идэвхгүй болгох
        this.availableDates = null; // null = бүх өдөр, эсвэл ["Monday", "Tuesday", ...]
    }

    connectedCallback() {
        // Attributes-аас утга авах
        const minDateAttr = this.getAttribute('min-date');
        if (minDateAttr) {
            this.minDate = new Date(minDateAttr);
        }

        const availableDatesAttr = this.getAttribute('available-dates');
        if (availableDatesAttr) {
            try {
                this.availableDates = JSON.parse(availableDatesAttr);
            } catch (e) {
                console.error('Available dates parse error:', e);
            }
        }

        this.render();
        this.attachEvents();
    }

    static get observedAttributes() {
        return ['min-date', 'available-dates'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        
        if (name === 'min-date') {
            this.minDate = new Date(newValue);
            this.renderCalendar();
        }
        
        if (name === 'available-dates') {
            try {
                this.availableDates = JSON.parse(newValue);
            } catch (e) {
                this.availableDates = null;
            }
            this.renderCalendar();
        }
    }

    render() {
        const monthNames = [
            '1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар',
            '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'
        ];

        this.innerHTML = `
            <div class="calendar-picker">
                <div class="calendar-header">
                    <button class="calendar-nav prev" aria-label="Өмнөх сар">‹</button>
                    <div class="calendar-title" id="calendarMonth">
                        ${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}
                    </div>
                    <button class="calendar-nav next" aria-label="Дараах сар">›</button>
                </div>
                
                <div class="calendar-weekdays">
                    ${['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'].map(day => 
                        `<div class="calendar-weekday">${day}</div>`
                    ).join('')}
                </div>
                
                <div class="calendar-days" id="calendarDays"></div>
            </div>
        `;

        this.renderCalendar();
    }

    isDayAvailable(date) {
        if (!this.availableDates || this.availableDates.length === 0) {
            return true;
        }

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[date.getDay()];
        
        return this.availableDates.includes(dayName);
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const minDate = new Date(this.minDate);
        minDate.setHours(0, 0, 0, 0);
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        let calendarHTML = '';
        
        const emptyDays = startDay === 0 ? 6 : startDay - 1;
        for (let i = 0; i < emptyDays; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            
            const isToday = date.getTime() === today.getTime();
            const isSelected = this.selectedDate && 
                              date.getTime() === new Date(this.selectedDate).setHours(0, 0, 0, 0);
            const isPast = date < minDate;
            const isAvailable = this.isDayAvailable(date);
            const isDisabled = isPast || !isAvailable;
            
            const classes = ['calendar-day'];
            if (isToday) classes.push('today');
            if (isSelected) classes.push('selected');
            if (isDisabled) classes.push('disabled');
            
            calendarHTML += `
                <div class="${classes.join(' ')}" 
                     data-date="${date.toISOString()}"
                     data-day="${day}">
                    ${day}
                </div>
            `;
        }
        
        const daysContainer = this.querySelector('#calendarDays');
        if (daysContainer) {
            daysContainer.innerHTML = calendarHTML;
        }
    }

    attachEvents() {
        const prevBtn = this.querySelector('.prev');
        const nextBtn = this.querySelector('.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.updateMonthTitle();
                this.renderCalendar();
                this.attachDayEvents();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.updateMonthTitle();
                this.renderCalendar();
                this.attachDayEvents();
            });
        }

        this.attachDayEvents();
    }

    attachDayEvents() {
        this.querySelectorAll('.calendar-day:not(.disabled):not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const dateISO = dayEl.getAttribute('data-date');
                this.selectedDate = new Date(dateISO);
                this.dispatchEvent(new CustomEvent('date-selected', {
                    detail: {
                        date: this.selectedDate,
                        formatted: this.selectedDate.toLocaleDateString('mn-MN'),
                        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.selectedDate.getDay()]
                    },
                    bubbles: true,
                    composed: true
                }));
                
                this.renderCalendar();
                this.attachDayEvents();
            });
        });
    }

    updateMonthTitle() {
        const monthNames = [
            '1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар',
            '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'
        ];
        const titleEl = this.querySelector('#calendarMonth');
        if (titleEl) {
            titleEl.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    setDate(date) {
        this.currentDate = new Date(date);
        this.selectedDate = new Date(date);
        this.updateMonthTitle();
        this.renderCalendar();
        this.attachDayEvents();
    }

    setMinDate(date) {
        this.minDate = new Date(date);
        this.renderCalendar();
    }

    setAvailableDates(dates) {
        this.availableDates = dates;
        this.renderCalendar();
    }

    reset() {
        this.selectedDate = null;
        this.renderCalendar();
    }
}

customElements.define('calendar-picker', CalendarPicker);