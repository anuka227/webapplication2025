class OrderDate extends HTMLElement {
    constructor() {
        super();
        this.currentDate = new Date();
        this.selectedDate = null;
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
        this.setupOrderInnerIntegration();
        
    }

    setupOrderInnerIntegration() {
        const orderInner = this.closest('order-inner');
        if (!orderInner) return;

        const btn = orderInner.querySelector('.toggle-btn');
        const btnText = btn?.querySelector('p');
        const contentDiv = orderInner.querySelector('.hidden-content');

        // Өөрийн dateSelected event-ийг сонсох
        this.addEventListener('dateSelected', (e) => {
            const selectedDate = e.detail.formatted;
            
            if (btnText) {
                btnText.textContent = selectedDate;
            }
            
            if (contentDiv) {
                contentDiv.classList.remove('show');
            }
            
            // Event-ийг order-inner руу дамжуулах
            orderInner.dispatchEvent(new CustomEvent('date-selected', {
                detail: { 
                    date: e.detail.date,
                    formatted: selectedDate 
                },
                bubbles: true,
                composed: true
            }));
            
            console.log('Order-date: Огноо сонгогдлоо -', selectedDate);
        });
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        const todayDate = today.getDate();
        
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        let daysHTML = '';
        
        const startDay = firstDay === 0 ? 6 : firstDay - 1; 
        
        for (let i = 0; i < startDay; i++) {
            daysHTML += '<div class="calendar-day empty"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = isCurrentMonth && day === todayDate;
            const isSelected = this.selectedDate && 
                              this.selectedDate.getFullYear() === year && 
                              this.selectedDate.getMonth() === month && 
                              this.selectedDate.getDate() === day;
            
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

        this.querySelectorAll('.calendar-day:not(.empty):not(.disabled)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const day = parseInt(dayEl.getAttribute('data-day'));
                this.selectedDate = new Date(
                    this.currentDate.getFullYear(),
                    this.currentDate.getMonth(),
                    day
                );
                
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

    getSelectedDate() {
        return this.selectedDate;
    }

    setDate(date) {
        this.currentDate = new Date(date);
        this.selectedDate = new Date(date);
        this.render();
        this.attachEvents();
    }
}

customElements.define('order-date', OrderDate);