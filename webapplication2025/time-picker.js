class TimePicker extends HTMLElement {
    constructor() {
        super();
        this.selectedTime = null;
        this.availableTimes = [];
        this.bookedTimes = [];
        this.pastTimes = [];
    }

    static get observedAttributes() {
        return ['available-times', 'booked-times', 'past-times'];
    }

    connectedCallback() {
        this.parseAttributes();
        this.render();
        this.attachEvents();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.parseAttributes();
            this.render();
            this.attachEvents();
        }
    }

    parseAttributes() {
        const timesAttr = this.getAttribute('available-times');
        const bookedAttr = this.getAttribute('booked-times');
        const pastAttr = this.getAttribute('past-times');
        
        try {
            this.availableTimes = timesAttr ? JSON.parse(timesAttr) : [];
        } catch(e) {
            this.availableTimes = [];
        }
        
        try {
            this.bookedTimes = bookedAttr ? JSON.parse(bookedAttr) : [];
        } catch(e) {
            this.bookedTimes = [];
        }
        
        try {
            this.pastTimes = pastAttr ? JSON.parse(pastAttr) : [];
        } catch(e) {
            this.pastTimes = [];
        }
    }

    render() {
        const times = this.availableTimes.length > 0 ? this.availableTimes : this.getDefaultTimes();
        
        const timeGroups = {
            'Өглөө': [],
            'Өдөр': [],
            'Орой': []
        };
        
        times.forEach(time => {
            const hour = parseInt(time.split(':')[0]);
            
            if (hour >= 6 && hour < 12) {
                timeGroups['Өглөө'].push(time);
            } else if (hour >= 12 && hour < 18) {
                timeGroups['Өдөр'].push(time);
            } else if (hour >= 18 && hour <= 23) {
                timeGroups['Орой'].push(time);
            }
        });
        
        let html = '<div class="time-picker-container">';
        
        Object.keys(timeGroups).forEach(groupName => {
            if (timeGroups[groupName].length > 0) {
                html += '<div class="time-group">';
                html += `<h4 class="time-group-label">${groupName}</h4>`;
                html += '<div class="time-buttons">';
                
                timeGroups[groupName].forEach(time => {
                    const isBooked = this.bookedTimes.includes(time);
                    const isPast = this.pastTimes.includes(time);
                    const isSelected = this.selectedTime === time;
                    const isDisabled = isBooked || isPast;
                    
                    let btnClass = 'time-btn';
                    if (isBooked) btnClass += ' booked';
                    if (isPast) btnClass += ' past';
                    if (isSelected) btnClass += ' selected';
                    
                    html += `<button class="${btnClass}" data-time="${time}" ${isDisabled ? 'disabled' : ''}>${time}</button>`;
                });
                
                html += '</div>'; 
                html += '</div>'; 
            }
        });
        
        html += '</div>'; 
        
        this.innerHTML = html;
    }

    attachEvents() {
        this.querySelectorAll('.time-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedTime = btn.dataset.time;
                
                this.dispatchEvent(new CustomEvent('time-selected', {
                    detail: { time: this.selectedTime },
                    bubbles: true,
                    composed: true
                }));
                
                this.render();
                this.attachEvents();
            });
        });
    }

    getDefaultTimes() {
        const times = [];
        for (let hour = 9; hour <= 22; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return times;
    }

    getSelectedTime() {
        return this.selectedTime;
    }
}

customElements.define('time-picker', TimePicker);