// orderPage/js/managers/BookingManager.js

class BookingManager {

static checkAuth() {
        const user = localStorage.getItem('user');
        console.log('🔐 Auth check:', user ? '✅ Logged in' : '❌ Not logged in');
        return !!user;
    }

    /**
     * Нэвтрэх prompt харуулах
     */
    static showAuthPrompt() {
        const shouldLogin = confirm('⚠️ Захиалга хийхийн тулд нэвтэрнэ үү?');
        
        if (shouldLogin) {
            window.location.hash = '#/login';
        }
    }

    /**
     * Захиалгын dialog нээх
     */
    static openBookingDialog(data) {
        console.log('🎫 Opening booking dialog:', data);
        
        // ✅ 1. НЭВТРЭЛТ ШАЛГАХ - ЭНД!
        if (!BookingManager.checkAuth()) {
            BookingManager.showAuthPrompt();
            return; // ❌ Dialog нээхгүй
        }

        // ✅ 2. Validation
        if (!data.serviceName || !data.salonName) {
            console.error('❌ Missing required fields:', data);
            alert('❌ Алдаа: Үйлчилгээний мэдээлэл дутуу байна');
            return;
        }

        // ✅ 3. Dialog үүсгэх
        const dialog = document.createElement('booking-dialog');
        dialog.setAttribute('service-name', data.serviceName);
        dialog.setAttribute('service-category', data.serviceCategory || 'Үйлчилгээ');
        dialog.setAttribute('service-duration', data.serviceDuration || '');
        dialog.setAttribute('service-price', data.servicePrice || '');
        dialog.setAttribute('salon-name', data.salonName);
        dialog.setAttribute('salon-id', data.salonId || data.salonName);
        dialog.setAttribute('available-dates', JSON.stringify(data.availableDates || []));
        dialog.setAttribute('available-times', JSON.stringify(data.availableTimes || []));
        
        document.body.appendChild(dialog);
    }

    /**
     * Захиалга хадгалах
     */
    static saveBooking(bookingData) {
    try {
        // ✅ 1. USER ШАЛГАХ
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (!currentUser.id && !currentUser.email) {
            console.error('❌ No user found');
            // ✅ Нэвтрээгүй бол login руу
            BookingManager.showAuthPrompt();
            return null;
        }
        
        const userId = currentUser.id || currentUser.email;
        
        let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        // ✅ 2. ДАВХЦАЛ ШАЛГАХ
        const isDuplicate = bookings.some(b => 
            b.userId === userId &&
            b.date === bookingData.date &&
            b.time === bookingData.time &&
            b.salonId === bookingData.salonId &&
            b.service === bookingData.service &&
            b.status === 'upcoming'
        );
        
        if (isDuplicate) {
            console.warn('⚠️ Duplicate booking');
            alert('⚠️ Энэ цагт аль хэдийн захиалга хийсэн байна!');
            return null;
        }
        
        // ✅ 3. ХАДГАЛАХ
        const newBooking = {
            id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
            userId: userId,
            userName: currentUser.name || 'Хэрэглэгч',
            ...bookingData,
            timestamp: new Date().toISOString(),
            status: 'upcoming'
        };
        
        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        console.log('💾 Booking saved:', newBooking);
        
        window.dispatchEvent(new CustomEvent('booking-added', {
            detail: newBooking
        }));
        
        return newBooking;
    } catch (error) {
        console.error('❌ Error saving booking:', error);
        alert('❌ Системд алдаа гарлаа. Дахин оролдоно уу.');
        return null;
    }
}

static getBookings() {
    try {
        return JSON.parse(localStorage.getItem('bookings') || '[]');
    } catch (error) {
        console.error('❌ Error loading bookings:', error);
        return [];
    }
}

/**
 * Зөвхөн тухайн хэрэглэгчийн захиалгууд
 */
static getUserBookings() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = currentUser.id || currentUser.email || 'anonymous';
        
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        // ✅ Зөвхөн энэ хэрэглэгчийн захиалгууд
        return allBookings.filter(b => b.userId === userId);
    } catch (error) {
        console.error('❌ Error loading user bookings:', error);
        return [];
    }
}

/**
 * Тухайн өдрийн захиалагдсан цагууд (БҮХ хэрэглэгч)
 */
static getBookedTimesForDate(date, salonId) {
    try {
        const bookings = BookingManager.getBookings(); // ✅ БҮХ хэрэглэгчийн
        const dateString = new Date(date).toISOString().split('T')[0];
        
        return bookings
            .filter(booking => {
                const bookingDate = new Date(booking.date).toISOString().split('T')[0];
                const salonMatch = booking.salonId === salonId || booking.salon === salonId;
                return salonMatch && 
                    bookingDate === dateString && 
                    booking.status === 'upcoming';
            })
            .map(booking => booking.time);
    } catch (error) {
        console.error('❌ Error getting booked times:', error);
        return [];
    }
}

    /**
     * Өнгөрсөн өдөр эсэхийг шалгах
     */
    static isPastDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        
        return checkDate < today;
    }

    /**
     * Өнгөрсөн цагууд олох (зөвхөн өнөөдрийн хувьд)
     */
    static getPastTimesForDate(date, allTimes) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        
        // Өнөөдөр биш бол хоосон
        if (selectedDate.getTime() !== today.getTime()) {
            return [];
        }
        
        // Өнөөдрийн өнгөрсөн цагууд
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        return allTimes.filter(time => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours < currentHour || (hours === currentHour && minutes <= currentMinute);
        });
    }

    /**
     * Profile хуудас руу очих
     */
    static navigateToProfile() {
        window.location.hash = '#/profile';
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

    /**
     * Notification харуулах
     */
    static showNotification(message, type = 'success') {
        // Хуучин notification устгах
        const existingNotif = document.querySelector('.booking-notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        // Шинэ notification үүсгэх
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
        
        // 3 секундийн дараа устгах
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Огноо/Цаг сонгосон эсэхийг шалгах (Home page-н хувьд)
     */
    static validateDateTime(date, time) {
        if (!date) {
            alert('⚠️ Огноогоо сонгоно уу!');
            return false;
        }
        
        if (!time) {
            alert('⚠️ Цагаа сонгоно уу!');
            return false;
        }
        
        return true;
    }
}

// ✅ Global-д export хийх
window.BookingManager = BookingManager;

console.log('✅ BookingManager loaded');