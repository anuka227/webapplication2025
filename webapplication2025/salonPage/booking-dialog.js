class BookingDialog extends HTMLElement {
    constructor() {
        super();
        this.selectedDate = new Date();
        this.currentDate = new Date();
        this.selectedTime = null;
        this.availableDates = [];
        this.availableTimes = [];
    }

    connectedCallback() {
        this.serviceName = this.getAttribute('service-name') || '';
        this.serviceCategory = this.getAttribute('service-category') || '';
        this.serviceDuration = this.getAttribute('service-duration') || '';
        this.servicePrice = this.getAttribute('service-price') || '';
        this.salonName = this.getAttribute('salon-name') || '';
        
        const datesAttr = this.getAttribute('available-dates');
        const timesAttr = this.getAttribute('available-times');
        
        if (datesAttr) {
            try {
                this.availableDates = JSON.parse(datesAttr);
            } catch(e) {
                console.error('Available dates parse error:', e);
                this.availableDates = [];
            }
        }
        
        if (timesAttr) {
            try {
                this.availableTimes = JSON.parse(timesAttr);
            } catch(e) {
                console.error('Available times parse error:', e);
                this.availableTimes = [];
            }
        }
        
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
                        <div class="service-details">
                            <span class="duration">⏱ ${this.serviceDuration}</span>
                            <span class="price">${this.servicePrice}</span>
                        </div>
                    </div>
                    
                    <div class="booking-content">
                        <div class="date-picker-section">
                            <div class="calendar-container">
                                <div class="calendar-header">
                                    <button class="calendar-nav prev">‹</button>
                                    <h3 class="calendar-month" id="calendarMonth"></h3>
                                    <button class="calendar-nav next">›</button>
                                </div>
                                <div class="calendar-grid" id="calendarGrid"></div>
                            </div>
                        </div>
                        
                        <div class="time-picker-section">
                            <h3>Цаг сонгох</h3>
                            <div class="time-groups" id="timeGroups"></div>
                        </div>
                    </div>
                    
                    <div class="booking-footer">
                        <button class="confirm-booking-btn">Захиалах</button>
                    </div>
                </div>
            </dialog>
        `;
    }

    renderTimeSlots() {
        const container = this.querySelector('#timeGroups');
        
        const timeGroups = {
            'Өглөө': [],
            'Өдөр': [],
            'Орой': []
        };
        
        const times = this.availableTimes && this.availableTimes.length > 0 
            ? this.availableTimes 
            : this.getDefaultTimes();
        
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
        
        let html = '';
        
        Object.keys(timeGroups).forEach(groupName => {
            if (timeGroups[groupName].length > 0) {
                html += `
                    <div class="time-group">
                        <h4 class="time-group-label">${groupName}</h4>
                        <div class="time-buttons">
                            ${timeGroups[groupName].map(time => `
                                <button class="time-btn" data-time="${time}">${time}</button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });
        
        container.innerHTML = html;
        
        this.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedTime = btn.dataset.time;
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

    attachEvents() {
        const dialog = this.querySelector('.booking-dialog');
        
        this.renderCalendar();
        this.renderTimeSlots();
        
        this.querySelector('.calendar-nav.prev').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        this.querySelector('.calendar-nav.next').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        this.querySelector('.close-booking-btn').addEventListener('click', () => {
            this.close();
        });
        
        this.querySelector('.confirm-booking-btn').addEventListener('click', () => {
            this.confirmBooking();
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.close();
            }
        });
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
        const monthNames = ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'];
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        this.querySelector('#calendarMonth').textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay();
        
        let calendarHTML = '<div class="calendar-weekdays">';
        ['Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя', 'Ня'].forEach(day => {
            calendarHTML += `<div class="weekday">${day}</div>`;
        });
        calendarHTML += '</div><div class="calendar-days">';
        
        for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            
            const isToday = date.getTime() === today.getTime();
            const isSelected = date.toDateString() === this.selectedDate.toDateString();
            const isPast = date < today;
            const isAvailable = this.isDayAvailable(date);
            const isDisabled = isPast || !isAvailable;
            
            calendarHTML += `
                <div class="calendar-day 
                    ${isToday ? 'today' : ''} 
                    ${isSelected ? 'selected' : ''} 
                    ${isDisabled ? 'disabled' : ''}" 
                     data-date="${date.toISOString()}">
                    ${day}
                </div>
            `;
        }
        
        calendarHTML += '</div>';
        this.querySelector('#calendarGrid').innerHTML = calendarHTML;
        
        this.querySelectorAll('.calendar-day:not(.disabled):not(.empty)').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                this.selectedDate = new Date(dayEl.dataset.date);
                this.renderCalendar();
            });
        });
    }

    confirmBooking() {
        if (!this.selectedTime) {
            this.showNotification('Цагаа сонгоно уу!', 'error');
            return;
        }
        
        const bookingData = {
            service: this.serviceName,
            category: this.serviceCategory,
            duration: this.serviceDuration,
            price: this.servicePrice,
            date: this.selectedDate.toISOString(),
            dateFormatted: this.selectedDate.toLocaleDateString('mn-MN'),
            time: this.selectedTime,
            salon: this.salonName,
            timestamp: new Date().toISOString()
        };
        
        // LocalStorage-д хадгалах
        this.saveBooking(bookingData);
        
        // Event dispatch
        this.dispatchEvent(new CustomEvent('booking-confirmed', {
            detail: bookingData,
            bubbles: true,
            composed: true
        }));
        
        console.log('Booking confirmed:', bookingData);
        
        // Dialog шууд хаах
        this.close();
        
        // Dialog хаагдсаны дараа notification үзүүлэх
        setTimeout(() => {
            this.showNotification('Таны захиалга амжилттай бүртгэгдлээ! ', 'success');
        }, 200);
    }

    saveBooking(bookingData) {
        try {
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            
            const newBooking = {
                id: Date.now().toString(),
                ...bookingData
            };
            
            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            console.log('Booking saved to localStorage:', newBooking);
        } catch (error) {
            console.error('Error saving booking:', error);
        }
    }
confirmBooking() {
    if (!this.selectedTime) {
        this.showNotification('Цагаа сонгоно уу!', 'error');
        return;
    }
    
    const bookingData = {
        service: this.serviceName,
        category: this.serviceCategory,
        duration: this.serviceDuration,
        price: this.servicePrice,
        date: this.selectedDate.toISOString(),
        dateFormatted: this.selectedDate.toLocaleDateString('mn-MN'),
        time: this.selectedTime,
        salon: this.salonName,
        timestamp: new Date().toISOString(),
        status: 'upcoming' // ШИНЭ: захиалгын төлөв
    };
    
    this.saveBooking(bookingData);
    
    this.dispatchEvent(new CustomEvent('booking-confirmed', {
        detail: bookingData,
        bubbles: true,
        composed: true
    }));
    
    window.dispatchEvent(new CustomEvent('booking-added', {
        detail: bookingData
    }));
    
    console.log('Booking confirmed:', bookingData);
    
    this.close();
    
    setTimeout(() => {
        this.showNotification('Таны захиалга амжилттай бүртгэгдлээ! ', 'success');
    }, 200);
}
    showNotification(message, type = 'success') {
        // Хуучин notification-г устгах
        const existingNotif = document.querySelector('.booking-notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `booking-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '' : '⚠'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#ff5252'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    show() {
        const dialog = this.querySelector('.booking-dialog');
        dialog.showModal();
    }

    close() {
        const dialog = this.querySelector('.booking-dialog');
        dialog.close();
        
        this.dispatchEvent(new CustomEvent('dialog-closed', {
            bubbles: true,
            composed: true
        }));
        
        setTimeout(() => {
            this.remove();
        }, 300);
    }

    disconnectedCallback() {
    }
}

customElements.define('booking-dialog', BookingDialog);