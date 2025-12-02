class CalendarPicker extends HTMLElement {
    constructor() {
        super();
        this.currentDate = new Date();
        this.selectedDate = null;
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Сарын эхний өдөр ямар гариг вэ
        const firstDay = new Date(year, month, 1).getDay();
        // Сард хэдэн өдөр байгаа
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Өнөөдрийн огноо
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        const todayDate = today.getDate();
        
        // Сарын нэр
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        // Долоо хоногийн өдрүүд
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // Өдрүүдийн grid үүсгэх
        let daysHTML = '';
        
        // Эхний өдрийн өмнөх хоосон нүднүүд (Sunday = 0, Monday = 1, ...)
        const startDay = firstDay === 0 ? 6 : firstDay - 1; // Monday-г эхлэл болгох
        
        for (let i = 0; i < startDay; i++) {
            daysHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Сарын өдрүүд
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === todayDate;
            const isSelected = this.selectedDate && 
                              this.selectedDate.getFullYear() === year && 
                              this.selectedDate.getMonth() === month && 
                              this.selectedDate.getDate() === day;
            
            // Өнгөрсөн өдөр эсэхийг шалгах
            const dayDate = new Date(year, month, day);
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isPast = dayDate < todayStart;
            
            const classes = ['calendar-day'];
            if (isToday) classes.push('today');
            if (isSelected) classes.push('selected');
            if (isPast) classes.push('disabled');
            
            daysHTML += `<div class="${classes.join(' ')}" data-day="${day}">${day}</div>`;
        }
        
        this.innerHTML = `
            <div class="calendar-picker">
                <div class="calendar-header">
                    <button class="calendar-nav prev" aria-label="Previous month">‹</button>
                    <div class="calendar-title">${monthNames[month]} ${todayDate}, ${year}</div>
                    <button class="calendar-nav next" aria-label="Next month">›</button>
                </div>
                
                <div class="calendar-weekdays">
                    ${weekDays.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
                </div>
                
                <div class="calendar-days">
                    ${daysHTML}
                </div>
            </div>
        `;
    }

    attachEvents() {
        // Navigation buttons
        const prevBtn = this.querySelector('.prev');
        const nextBtn = this.querySelector('.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
                this.attachEvents();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
                this.attachEvents();
            });
        }

        // Day selection
        this.querySelectorAll('.calendar-day:not(.empty):not(.disabled)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const day = parseInt(dayEl.getAttribute('data-day'));
                this.selectedDate = new Date(
                    this.currentDate.getFullYear(),
                    this.currentDate.getMonth(),
                    day
                );
                
                // Dispatch custom event
                this.dispatchEvent(new CustomEvent('dateSelected', {
                    detail: {
                        date: this.selectedDate,
                        formatted: this.selectedDate.toLocaleDateString()
                    },
                    bubbles: true
                }));
                
                this.render();
                this.attachEvents();
            });
        });
    }

    // Public method to get selected date
    getSelectedDate() {
        return this.selectedDate;
    }

    // Public method to set date
    setDate(date) {
        this.currentDate = new Date(date);
        this.selectedDate = new Date(date);
        this.render();
        this.attachEvents();
    }
}

customElements.define('calendar-picker', CalendarPicker);