class TimePicker extends HTMLElement {
    constructor() {
        super();
        this.selectedTime = null;
        this.availableTimes = [];
        this.bookedTimes = [];
    }

    connectedCallback() {
        const timesAttr = this.getAttribute('available-times');
        if (timesAttr) {
            try {
                this.availableTimes = JSON.parse(timesAttr);
            } catch (e) {
                this.availableTimes = this.getDefaultTimes();
            }
        } else {
            this.availableTimes = this.getDefaultTimes();
        }

        const bookedAttr = this.getAttribute('booked-times');
        if (bookedAttr) {
            try {
                this.bookedTimes = JSON.parse(bookedAttr);
            } catch (e) {
                this.bookedTimes = [];
            }
        }

        this.render();
        this.attachEvents();
    }

    static get observedAttributes() {
        return ['available-times', 'booked-times'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (name === 'available-times') {
            try {
                this.availableTimes = JSON.parse(newValue);
            } catch (e) {
                this.availableTimes = this.getDefaultTimes();
            }
            this.render();
            this.attachEvents();
        }

        if (name === 'booked-times') {
            try {
                this.bookedTimes = JSON.parse(newValue);
            } catch (e) {
                this.bookedTimes = [];
            }
            this.render();
            this.attachEvents();
        }
    }

    getDefaultTimes() {
        const times = [];
        for (let hour = 9; hour <= 22; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return times;
    }

    render() {
        const timeGroups = {
            'Өглөө': [],
            'Өдөр': [],
            'Орой': []
        };

        this.availableTimes.forEach(time => {
            const hour = parseInt(time.split(':')[0]);

            if (hour >= 6 && hour < 12) {
                timeGroups['Өглөө'].push(time);
            } else if (hour >= 12 && hour < 18) {
                timeGroups['Өдөр'].push(time);
            } else if (hour >= 18 && hour <= 23) {
                timeGroups['Орой'].push(time);
            }
        });

        let html = '';

        Object.entries(timeGroups).forEach(([groupName, times]) => {
            if (times.length > 0) {
                html += `
                    <div class="time-group">
                        <h4 class="time-group-label">${groupName}</h4>
                        <div class="time-buttons">
                            ${times.map(time => {
                                const isBooked = this.bookedTimes.includes(time);
                                const isSelected = this.selectedTime === time;
                                return `
                                    <button 
                                        class="time-btn ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}" 
                                        data-time="${time}"
                                        ${isBooked ? 'disabled' : ''}
                                        title="${isBooked ? 'Захиалагдсан' : time}"
                                    >
                                        ${time}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        });

        this.innerHTML = `
            <div class="time-picker-container">
                ${html}
            </div>
        `;
    }

    attachEvents() {
        this.querySelectorAll('.time-btn:not(.booked)').forEach(btn => {
            btn.addEventListener('click', () => {
                const time = btn.getAttribute('data-time');
                
                this.selectedTime = time;
                
                this.querySelectorAll('.time-btn').forEach(b => {
                    b.classList.remove('selected');
                });
                btn.classList.add('selected');
                
                this.dispatchEvent(new CustomEvent('time-selected', {
                    detail: { time: time },
                    bubbles: true,
                    composed: true
                }));

            });
        });
    }

    getSelectedTime() {
        return this.selectedTime;
    }

    setAvailableTimes(times) {
        this.availableTimes = times;
        this.render();
        this.attachEvents();
    }

    setBookedTimes(times) {
        this.bookedTimes = times;
        this.render();
        this.attachEvents();
    }

    reset() {
        this.selectedTime = null;
        this.render();
        this.attachEvents();
    }
}

customElements.define('time-picker', TimePicker);