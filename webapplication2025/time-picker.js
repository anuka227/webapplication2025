class TimePicker extends HTMLElement {
    constructor() {
        super();
        this.selectedTime = null;
        this.availableTimes = [];
        this.bookedTimes = [];
        this.pastTimes = []; // ✅ Өнгөрсөн цагууд
    }

    static get observedAttributes() {
        return ['available-times', 'booked-times', 'past-times']; // ✅ past-times нэмэх
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
        const pastAttr = this.getAttribute('past-times'); // ✅ Өнгөрсөн цагууд
        
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
        
        // ✅ Өнгөрсөн цагууд parse хийх
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
                html += `
                    <div class="time-group">
                        <h4 class="time-group-title">${groupName}</h4>
                        <div class="time-slots">
                `;
                
                timeGroups[groupName].forEach(time => {
                    const isBooked = this.bookedTimes.includes(time);
                    const isPast = this.pastTimes.includes(time); // ✅ Өнгөрсөн цаг эсэх
                    const isSelected = this.selectedTime === time;
                    const isDisabled = isBooked || isPast; // ✅ Захиалагдсан эсвэл өнгөрсөн
                    
                    let btnClass = 'time-slot-btn';
                    if (isDisabled) btnClass += ' disabled';
                    if (isPast) btnClass += ' past'; // ✅ Past style
                    if (isBooked && !isPast) btnClass += ' booked'; // Зөвхөн захиалагдсан
                    if (isSelected) btnClass += ' selected';
                    
                    html += `
                        <button 
                            class="${btnClass}" 
                            data-time="${time}"
                            ${isDisabled ? 'disabled' : ''}>
                            ${time}
                            ${isPast ? '<span class="past-label">өнгөрсөн</span>' : ''}
                            ${isBooked && !isPast ? '<span class="booked-label">захиалагдсан</span>' : ''}
                        </button>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        
        html += `
            <style>
                .time-picker-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .time-group-title {
                    font-size: 14px;
                    color: #666;
                    margin: 0 0 12px 0;
                    font-weight: 600;
                }
                
                .time-slots {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
                    gap: 10px;
                }
                
                .time-slot-btn {
                    padding: 12px 16px;
                    background: #fce4ec;
                    border: 2px solid #fce4ec;
                    border-radius: 8px;
                    color: #333;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    position: relative;
                }
                
                .time-slot-btn:not(.disabled):hover {
                    background: #ec407a;
                    color: white;
                    transform: translateY(-2px);
                }
                
                .time-slot-btn.selected {
                    background: #ec407a;
                    border-color: #ec407a;
                    color: white;
                }
                
                /* ✅ Өнгөрсөн цаг */
                .time-slot-btn.past {
                    background: #f5f5f5;
                    border-color: #e0e0e0;
                    color: #999;
                    cursor: not-allowed;
                    text-decoration: line-through;
                    opacity: 0.5;
                }
                
                /* Захиалагдсан цаг */
                .time-slot-btn.booked:not(.past) {
                    background: #ffebee;
                    border-color: #ffcdd2;
                    color: #c62828;
                    cursor: not-allowed;
                }
                
                .time-slot-btn.disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }
                
                .past-label,
                .booked-label {
                    display: block;
                    font-size: 10px;
                    margin-top: 4px;
                    font-weight: 400;
                }
            </style>
        `;
        
        this.innerHTML = html;
    }

    attachEvents() {
        this.querySelectorAll('.time-slot-btn:not(.disabled)').forEach(btn => {
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