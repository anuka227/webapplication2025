class BookingDialog extends HTMLElement {
    constructor() {
        super();
        this.selectedDate = new Date();
        this.currentDate = new Date();
        this.selectedTime = 'any';
    }

    connectedCallback() {
        this.serviceName = this.getAttribute('service-name') || '';
        this.serviceCategory = this.getAttribute('service-category') || '';
        this.serviceDuration = this.getAttribute('service-duration') || '';
        this.servicePrice = this.getAttribute('service-price') || '';
        this.salonName = this.getAttribute('salon-name') || '';
        
        this.render();
        this.attachEvents();
    }

    render() {
        this.innerHTML = /*html*/`
            <dialog class="booking-dialog">
                <div class="booking-container">
                    <div class="booking-header">
                        <h2>Захиалга үүсгэх</h2>
                        <button class="close-booking-btn">×</button>
                    </div>
                    
                    <div class="booking-service-info">
                        <h3>${this.serviceName}</h3>
                        <p class="service-category">${this.serviceCategory}</p>
                        <div class="service-details">
                            <span class="duration">⏱ ${this.serviceDuration}</span>
                            <span class="price">${this.servicePrice}</span>
                        </div>
                    </div>
                    
                    <div class="booking-content">
                        <!-- Огноо сонгох хэсэг -->
                        <div class="date-picker-section">
                            <div class="quick-dates">
                                <button class="quick-date-btn active" data-offset="0">
                                    <div class="date-label">Today</div>
                                    <div class="date-value" id="todayDate"></div>
                                </button>
                                <button class="quick-date-btn" data-offset="1">
                                    <div class="date-label">Tomorrow</div>
                                    <div class="date-value" id="tomorrowDate"></div>
                                </button>
                            </div>
                            
                            <div class="calendar-container">
                                <div class="calendar-header">
                                    <button class="calendar-nav prev">‹</button>
                                    <h3 class="calendar-month" id="calendarMonth"></h3>
                                    <button class="calendar-nav next">›</button>
                                </div>
                                <div class="calendar-grid" id="calendarGrid"></div>
                            </div>
                        </div>
                        
                        <!-- Цаг сонгох хэсэг -->
                        <div class="time-picker-section">
                            <h3>Select time</h3>
                            <div class="time-options">
                                <button class="time-option-btn active" data-time="any">Any time</button>
                                <button class="time-option-btn" data-time="morning">
                                    <div>Morning</div>
                                    <div class="time-range">09 - 12</div>
                                </button>
                                <button class="time-option-btn" data-time="afternoon">
                                    <div>Afternoon</div>
                                    <div class="time-range">16 - 17</div>
                                </button>
                                <button class="time-option-btn" data-time="evening">
                                    <div>Evening</div>
                                    <div class="time-range">17 - 23</div>
                                </button>
                                <button class="time-option-btn" data-time="custom">Custom</button>
                            </div>
                            
                            <div class="custom-time-inputs" id="customTimeInputs" style="display: none;">
                                <select class="time-select" id="startTime">
                                    <option value="">Select start time</option>
                                    ${this.generateTimeOptions()}
                                </select>
                                <select class="time-select" id="endTime">
                                    <option value="">Select end time</option>
                                    ${this.generateTimeOptions()}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="booking-footer">
                        <button class="cancel-btn">Цуцлах</button>
                        <button class="confirm-booking-btn">Захиалах</button>
                    </div>
                </div>
            </dialog>
        `;
    }

    generateTimeOptions() {
        let options = '';
        for (let hour = 9; hour <= 20; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                options += `<option value="${time}">${time}</option>`;
            }
        }
        return options;
    }

    attachEvents() {
        const dialog = this.querySelector('.booking-dialog');
        const today = new Date();
        
        // Өнөөдөр болон маргааш огноог харуулах
        this.updateQuickDates();
        
        // Calendar үүсгэх
        this.renderCalendar();
        
        // Calendar navigation
        this.querySelector('.calendar-nav.prev').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        this.querySelector('.calendar-nav.next').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        // Quick date buttons
        this.querySelectorAll('.quick-date-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.querySelectorAll('.quick-date-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const offset = parseInt(btn.dataset.offset);
                this.selectedDate = new Date(today);
                this.selectedDate.setDate(this.selectedDate.getDate() + offset);
                this.currentDate = new Date(this.selectedDate);
                this.renderCalendar();
            });
        });
        
        // Time options
        this.querySelectorAll('.time-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.querySelectorAll('.time-option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.selectedTime = btn.dataset.time;
                const customInputs = this.querySelector('#customTimeInputs');
                
                if (this.selectedTime === 'custom') {
                    customInputs.style.display = 'flex';
                } else {
                    customInputs.style.display = 'none';
                }
            });
        });
        
        // Close button
        this.querySelector('.close-booking-btn').addEventListener('click', () => {
            this.close();
        });
        
        // Cancel button
        this.querySelector('.cancel-btn').addEventListener('click', () => {
            this.close();
        });
        
        // Confirm booking button
        this.querySelector('.confirm-booking-btn').addEventListener('click', () => {
            this.confirmBooking();
        });
        
        // Dialog backdrop click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.close();
            }
        });
    }

    updateQuickDates() {
        const formatDateShort = (date) => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
        };
        
        const today = new Date();
        this.querySelector('#todayDate').textContent = formatDateShort(today);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.querySelector('#tomorrowDate').textContent = formatDateShort(tomorrow);
    }

    renderCalendar() {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        
        this.querySelector('#calendarMonth').textContent = `${monthNames[month]} ${this.currentDate.getDate()}, ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        let calendarHTML = '<div class="calendar-weekdays">';
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(day => {
            calendarHTML += `<div class="weekday">${day}</div>`;
        });
        calendarHTML += '</div><div class="calendar-days">';
        
        // Эхлэх хоосон өдрүүд
        for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        // Өдрүүд
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === this.selectedDate.toDateString();
            const isPast = date < today && !isToday;
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'disabled' : ''}" 
                     data-date="${date.toISOString()}">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        this.querySelector('#calendarGrid').innerHTML = calendarHTML;
        
        // Огноо дээр дарах event
        this.querySelectorAll('.calendar-day:not(.disabled):not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                this.selectedDate = new Date(dayEl.dataset.date);
                this.renderCalendar();
            });
        });
    }

    confirmBooking() {
        let timeInfo = this.selectedTime;
        
        if (this.selectedTime === 'custom') {
            const startTime = this.querySelector('#startTime').value;
            const endTime = this.querySelector('#endTime').value;
            
            if (!startTime || !endTime) {
                alert('Эхлэх болон дуусах цагаа сонгоно уу!');
                return;
            }
            
            timeInfo = `${startTime} - ${endTime}`;
        }
        
        const bookingData = {
            service: this.serviceName,
            category: this.serviceCategory,
            duration: this.serviceDuration,
            price: this.servicePrice,
            date: this.selectedDate,
            time: timeInfo,
            salon: this.salonName
        };
        
        // Custom event dispatching
        this.dispatchEvent(new CustomEvent('booking-confirmed', {
            detail: bookingData,
            bubbles: true,
            composed: true
        }));
        
        console.log('Booking confirmed:', bookingData);
        
        alert(`Захиалга баталгаажлаа!\n\nҮйлчилгээ: ${this.serviceName}\nОгноо: ${this.selectedDate.toLocaleDateString('mn-MN')}\nЦаг: ${timeInfo}\nСалон: ${this.salonName}`);
        
        this.close();
    }

    show() {
        const dialog = this.querySelector('.booking-dialog');
        dialog.showModal();
    }

    close() {
        const dialog = this.querySelector('.booking-dialog');
        dialog.close();
        
        // Component-ийг DOM-оос устгах
        setTimeout(() => {
            this.remove();
        }, 300);
    }

    disconnectedCallback() {
    }
}

customElements.define('booking-dialog', BookingDialog);