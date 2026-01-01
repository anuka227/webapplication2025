// orderPage/js/managers/BookingManager.js
import { showNotification } from '../../../salon-notification.js'; // ✅ IMPORT

class BookingManager {
    static checkAuth() {
        const user = localStorage.getItem('user');
        return !!user;
    }

    static showAuthPrompt() {
        const modal = document.createElement('login-modal');
        document.body.appendChild(modal);
    }

    static openBookingDialog(data) {
        console.log('🎫 Opening booking dialog:', data);
        
        if (!BookingManager.checkAuth()) {
            BookingManager.showAuthPrompt();
            return; 
        }

        if (!data.serviceName || !data.salonName) {
            console.error('❌ Missing required fields:', data);
            showNotification('Үйлчилгээний мэдээлэл дутуу байна'); // ✅ IMPORT
            return;
        }

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

    static getBookings() {
        try {
            return JSON.parse(localStorage.getItem('bookings') || '[]');
        } catch (error) {
            console.error('❌ Error loading bookings:', error);
            return [];
        }
    }

    static getUserBookings() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = currentUser.id || currentUser.email || 'anonymous';
            
            const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            
            return allBookings.filter(b => b.userId === userId);
        } catch (error) {
            console.error('❌ Error loading user bookings:', error);
            return [];
        }
    }

    static getBookedTimesForDate(date, salonId) {
        try {
            const bookings = BookingManager.getBookings();
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

    static isPastDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        
        return checkDate < today;
    }

    static getPastTimesForDate(date, allTimes) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectedDate.getTime() !== today.getTime()) {
            return [];
        }
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        return allTimes.filter(time => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours < currentHour || (hours === currentHour && minutes <= currentMinute);
        });
    }

    static navigateToProfile() {
        window.location.hash = '#/profile';
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

    static showNotification(message, duration = 3000, position = 'top-right') {
        showNotification(message, duration, position); // ✅ IMPORT ашиглах
    }
    
    static saveBooking(bookingData) {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (!currentUser.id && !currentUser.email) {
                console.error('❌ No user found');
                
                document.querySelectorAll('booking-dialog').forEach(d => {
                    try {
                        d.remove();
                    } catch(e) {
                        console.error('Error removing dialog:', e);
                    }
                });
                
                BookingManager.showAuthPrompt();
                return null;
            }
            
            const userId = currentUser.id || currentUser.email;
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            
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
                showNotification('Энэ цагт аль хэдийн захиалга хийсэн байна'); // ✅ IMPORT
                return null;
            }
            
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
            showNotification('Системд алдаа гарлаа'); // ✅ IMPORT
            return null;
        }
    }
}

window.BookingManager = BookingManager;
console.log('✅ BookingManager loaded');