class BookingDialog extends HTMLElement {
    constructor() {
        super();
        this.selectedTime = null;
        this.availableDates = [];
        this.availableTimes = [];
        this.salonId = null;
    }

    connectedCallback() {
        this.serviceName = this.getAttribute('service-name') || '';
        this.serviceCategory = this.getAttribute('service-category') || '';
        this.serviceDuration = this.getAttribute('service-duration') || '';
        this.servicePrice = this.getAttribute('service-price') || '';
        this.salonName = this.getAttribute('salon-name') || '';
        this.salonId = this.getAttribute('salon-id') || this.salonName;
        
        const datesAttr = this.getAttribute('available-dates');
        const timesAttr = this.getAttribute('available-times');
        
        if (datesAttr) {
            try {
                this.availableDates = JSON.parse(datesAttr);
            } catch(e) {
                this.availableDates = [];
            }
        }
        
        if (timesAttr) {
            try {
                this.availableTimes = JSON.parse(timesAttr);
            } catch(e) {
                this.availableTimes = [];
            }
        }
        
        this.render();
        this.attachEvents();
    }

render() {
    const availableDatesJSON = JSON.stringify(this.availableDates);
    const availableTimesJSON = JSON.stringify(this.availableTimes.length > 0 ? this.availableTimes : this.getDefaultTimes());
    
    this.innerHTML = `
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
                        <calendar-picker 
                            available-dates='${availableDatesJSON}'>
                        </calendar-picker>
                    </div>
                    
                    <div class="time-picker-section">
                        <h3>Цаг сонгох</h3>
                        <time-picker 
                            id="bookingTimePicker"
                            available-times='${availableTimesJSON}'>
                        </time-picker>
                    </div>
                </div>
                
                <div class="booking-footer">
                    <button class="confirm-booking-btn">Захиалах</button>
                </div>
            </div>
        </dialog>
    `;
}

attachEvents() {
    const dialog = this.querySelector('.booking-dialog');
    const calendarPicker = this.querySelector('calendar-picker');
    const timePicker = this.querySelector('#bookingTimePicker');
    
    if (calendarPicker) {
        calendarPicker.addEventListener('date-selected', (e) => {
            this.selectedDate = e.detail.date;
            this.updateAvailableTimesForDate();
        });
    }
    
    if (timePicker) {
        timePicker.addEventListener('time-selected', (e) => {
            this.selectedTime = e.detail.time;
        });
    }
    
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

updateAvailableTimesForDate() {
    const timePicker = this.querySelector('#bookingTimePicker');
    if (!timePicker) return;
    
    const bookedTimes = this.getBookedTimesForDate(this.selectedDate);
    timePicker.setAttribute('booked-times', JSON.stringify(bookedTimes));
}

getBookedTimesForDate(date) {
    try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const dateString = new Date(date).toISOString().split('T')[0];
        
        const bookedTimes = bookings
            .filter(booking => {
                const bookingDate = new Date(booking.date).toISOString().split('T')[0];
                const salonMatch = booking.salon === this.salonName || booking.salonId === this.salonId;
                return salonMatch && 
                    bookingDate === dateString && 
                    booking.status === 'upcoming';
            })
            .map(booking => booking.time);
        
        return bookedTimes;
    } catch (error) {
        console.error('Error getting booked times:', error);
        return [];
    }
}

getDefaultTimes() {
    const times = [];
    for (let hour = 9; hour <= 22; hour++) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return times;
}

confirmBooking() {
    const calendarPicker = this.querySelector('calendar-picker');
    const timePicker = this.querySelector('#bookingTimePicker');
    
    const selectedDate = calendarPicker ? calendarPicker.getSelectedDate() : null;
    const selectedTime = timePicker ? timePicker.getSelectedTime() : null;
    
    if (!selectedDate) {
        alert('⚠️ Огноогоо сонгоно уу!');
        return;
    }
    
    if (!selectedTime) {
        alert('⚠️ Цагаа сонгоно уу!');
        return;
    }
    
    const bookingData = {
        service: this.serviceName,
        category: this.serviceCategory,
        duration: this.serviceDuration,
        price: this.servicePrice,
        date: selectedDate.toISOString(),
        dateFormatted: selectedDate.toLocaleDateString('mn-MN'),
        time: selectedTime,
        salon: this.salonName,
        salonId: this.salonId
    };
    
    console.log('✅ Booking confirmed:', bookingData);
    
    // ✅ BookingManager ашиглах (userId автоматаар нэмэгдэнэ)
    if (window.BookingManager) {
        const saved = window.BookingManager.saveBooking(bookingData);
        
        if (saved) {
            this.close();
            
            setTimeout(() => {
                window.BookingManager.navigateToProfile();
                setTimeout(() => {
                    window.BookingManager.showNotification('✅ Захиалга баталгаажсан', 'success');
                }, 400);
            }, 200);
        } else {
            alert('❌ Алдаа гарлаа. Дахин оролдоно уу.');
        }
    } else {
        console.error('❌ BookingManager not loaded');
        alert('❌ Систем ачааллаж байна. Түр хүлээнэ үү.');
    }
}
navigateToProfile() {
    // ✅ Router-based navigation
    window.location.hash = '#/profile';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

    showNotification(message, type = 'success') {
        const existingNotif = document.querySelector('.booking-notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `booking-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
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
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }



    show() {
        const dialog = this.querySelector('.booking-dialog');
        dialog.showModal();
    }

    close() {
        const dialog = this.querySelector('.booking-dialog');
        dialog.close();
        
        setTimeout(() => {
            this.remove();
        }, 300);
    }
}

customElements.define('booking-dialog', BookingDialog);