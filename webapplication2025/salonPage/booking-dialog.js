class BookingDialog extends HTMLElement {
    constructor() {
        super();
        this.selectedDate = new Date();
        this.currentDate = new Date();
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
            
            <style>    
                .time-btn.booked {
                    background: #ffebee !important;
                    color: #c62828 !important;
                    cursor: not-allowed !important;
                    opacity: 0.6;
                    position: relative;
                }
                
                .time-btn.booked::before {
                    content: '✕';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 18px;
                    font-weight: bold;
                }
                
                .time-btn.booked:hover {
                    background: #ffebee !important;
                    transform: none !important;
                }
            </style>
        `;
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
            
            console.log(`Booked times for ${this.salonName} on ${dateString}:`, bookedTimes);
            return bookedTimes;
        } catch (error) {
            console.error('Error getting booked times:', error);
            return [];
        }
    }

    renderTimeSlots() {
        const container = this.querySelector('#timeGroups');
        const bookedTimes = this.getBookedTimesForDate(this.selectedDate);
        
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
                            ${timeGroups[groupName].map(time => {
                                const isBooked = bookedTimes.includes(time);
                                return `
                                    <button 
                                        class="time-btn ${isBooked ? 'booked' : ''}" 
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
        
        container.innerHTML = html;
        
        this.querySelectorAll('.time-btn:not(.booked)').forEach(btn => {
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
                this.renderTimeSlots();
            });
        });
    }

    confirmBooking() {
        if (!this.selectedTime) {
            alert('Цагаа сонгоно уу!');
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
            salonId: this.salonId,
            timestamp: new Date().toISOString(),
            status: 'upcoming'
        };
        
        // 1. Save to localStorage
        this.saveBooking(bookingData);
        
        // 2. Dispatch events
        this.dispatchEvent(new CustomEvent('booking-confirmed', {
            detail: bookingData,
            bubbles: true,
            composed: true
        }));
        
        window.dispatchEvent(new CustomEvent('booking-added', {
            detail: bookingData
        }));
        
        console.log('✅ Booking confirmed:', bookingData);
        
        // 3. Close dialog
        this.close();
        
        // 4. Navigate to profile page
        setTimeout(() => {
            this.navigateToProfile();
            
            // 5. Show notification
            setTimeout(() => {
                this.showNotification('Захиалга баталгаажсан', 'success');
            }, 400);
        }, 200);
    }

    // Navigate to profile/orders page
    navigateToProfile() {
        console.log('🔄 Navigating to profile/orders page...');
        
        // Method 1: Hash navigation
        window.location.hash = '#orders';
        
        // Method 2: Section visibility
        const ordersSection = document.querySelector('#orders');
        if (ordersSection) {
            document.querySelectorAll('main > section').forEach(s => {
                s.style.display = 'none';
                s.classList.remove('active');
            });
            
            ordersSection.style.display = 'block';
            ordersSection.classList.add('active');
            ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Method 3: Update aside nav
        const asideNav = document.querySelector('aside-nav');
        if (asideNav) {
            const ordersLink = asideNav.querySelector('[data-page="orders"], [href="#orders"]');
            if (ordersLink) {
                asideNav.querySelectorAll('a, button').forEach(link => {
                    link.classList.remove('active');
                });
                ordersLink.classList.add('active');
            }
        }
        
        console.log('✅ Navigation completed');
    }

    showNotification(message, type = 'success') {
        // Remove existing notification
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

    saveBooking(bookingData) {
        try {
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            
            const newBooking = {
                id: Date.now().toString(),
                ...bookingData
            };
            
            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            console.log('💾 Booking saved:', newBooking);
        } catch (error) {
            console.error('❌ Error saving booking:', error);
        }
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