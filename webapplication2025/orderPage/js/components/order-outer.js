import { SalonFilter } from '../utils/salonFilter.js';
import { showNotification } from '../../../salon-notification.js';
class OrderOuter extends HTMLElement {
    constructor() {
        super();
        this.salonFilter = null;
        this.salonsData = null;
    }

    async connectedCallback() {
        this.name = this.getAttribute('name') || "nergui";
        await this.loadSalonData();
        
        this.render();
        this.setupEventListeners();
    }

    async loadSalonData() {
        const response = await fetch('http://localhost:3000/api/salons');
        this.salonsData = await response.json();
        this.salonFilter = new SalonFilter(this.salonsData);
    }

    render() {
        this.innerHTML = /*html*/`
            <h2>Захиалга</h2>
			<div class="Orders" >
				<order-inner 
  					service="Үйлчилгээ" 
  					svgpath='&lt;path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/&gt;'>
					<order-service></order-service>
				</order-inner>
				<order-inner 
  					service="Байршил" 
  					svgpath='&lt;path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;&lt;path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;'>
					<order-location></order-location>
				</order-inner>
    			<order-inner 
    				service="Огноо" 
    				svgpath='&lt;path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M7 4V2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M17 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/&gt;'>
					<order-date></order-date>
				</order-inner>
				<order-inner 
  					service="Цаг" 
  					svgpath='&lt;path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#0F0F0F"/&gt;
  							&lt;path d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z" fill="#0F0F0F"/&gt;'>
					<order-time></order-time>
				</order-inner>
				<button class="search">Хайх</button>
            </div>
            <div class="detailedContainer"></div>
        `;
    }

    setupEventListeners() {
        const searchBtn = this.querySelector('.search');
        searchBtn?.addEventListener('click', () => this.handleSearch());
        
        // ✅ Subservice booking button event listener
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('subservice-book-btn')) {
                this.handleBookingClick(e);
            }
        });
    }

    handleBookingClick(e) {
        const row = e.target.closest('.subservice-row');
        const card = e.target.closest('.salon-card, .artist-card');
        
        if (!row || !card) return;
        
        const serviceName = row.querySelector('.subservice-name')?.textContent || '';
        const duration = row.querySelector('.subservice-duration')?.textContent || '';
        const price = row.querySelector('.subservice-price')?.textContent.replace('₮', '') || '';
        
        const nameElement = card.querySelector('.name strong, .top p strong');
        const salonName = nameElement?.textContent || '';
        
        // Get salon/artist full data
        let fullData = null;
        let serviceCategory = null;
        
        if (card.classList.contains('salon-card')) {
            // Salon
            fullData = this.salonsData.salons.find(s => s.name === salonName);
        } else {
            // Independent Artist
            const independent = this.salonsData.salons.find(s => s.id === 'independent');
            fullData = independent?.artists.find(a => a.name === salonName);
        }
        
        // ✅ Find the service category from JSON
        if (fullData && fullData.service) {
            fullData.service.forEach(serviceGroup => {
                if (serviceGroup.subservice) {
                    const foundSub = serviceGroup.subservice.find(sub => 
                        sub.name === serviceName || sub.id === serviceName
                    );
                    if (foundSub) {
                        serviceCategory = serviceGroup.type; // ✅ "Хумс", "Үс" гэх мэт
                    }
                }
            });
        }
        
        if (fullData) {
            this.openBookingDialog({
                serviceName: serviceName,
                serviceCategory: serviceCategory || 'Үйлчилгээ',
                duration: duration,
                price: price,
                salonName: salonName,
                salonId: fullData.id,
                availableDates: fullData.date || [],
                availableTimes: fullData.time || fullData.hours || []
            });
        } else {
            console.error('❌ Salon/Artist not found:', salonName);
        }
    }

    openBookingDialog(data) {
        console.log('🎫 Opening booking dialog:', data);
        
        const dialog = document.createElement('booking-dialog');
        dialog.setAttribute('service-name', data.serviceName);
        dialog.setAttribute('service-category', data.serviceCategory);
        dialog.setAttribute('service-duration', data.duration);
        dialog.setAttribute('service-price', data.price);
        dialog.setAttribute('salon-name', data.salonName);
        dialog.setAttribute('salon-id', data.salonId);
        dialog.setAttribute('available-dates', JSON.stringify(data.availableDates));
        dialog.setAttribute('available-times', JSON.stringify(data.availableTimes));
        
        document.body.appendChild(dialog);
    }

    handleSearch() {
        const orderData = window.orderManager.getData();
        const filters = {
            location: orderData.location,
            maxDistance: 2,
            service: orderData.service,
            date: orderData.date,
            time: orderData.time
        };
        const results = this.salonFilter.applyFilters(filters);        
        this.showResults(results);
    }

    showResults(results) {
        const container = this.querySelector('.detailedContainer');
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p style="text-align:center;padding:40px;font-size:18px;">
                        Таны шүүлтэд тохирох салон олдсонгүй.
                    </p>
                </div>
            `;
            return;
        }

        const salons = results.filter(r => r.id !== 'independent');
        const independentArtists = results.find(r => r.id === 'independent')?.artists || [];

        container.innerHTML = /*html*/`
            <div class="availableData">
                <div class="leftSalons">
                    <h2>Салон (${salons.length})</h2>
                    ${salons.map(salon => this.renderSalonCard(salon)).join('')}
                </div>
                <div class="rightArtist">
                    <h2>Бие даасан артист (${independentArtists.length})</h2>
                    ${independentArtists.map(artist => this.renderArtistCard(artist)).join('')}
                </div>
            </div>
        `;
    }

    renderSalonCard(salon) {
        const selectedServiceId = window.orderManager?.getData().service || null;
        
        let filteredSubservices = [];
        
        if (salon.service && Array.isArray(salon.service)) {
            salon.service.forEach(serviceGroup => {
                if (serviceGroup.subservice && Array.isArray(serviceGroup.subservice)) {
                    serviceGroup.subservice.forEach(sub => {
                        if (!selectedServiceId || sub.id === selectedServiceId) {
                            filteredSubservices.push(sub);
                        }
                    });
                }
            });
        }
        
        const subservicesHTML = filteredSubservices.length > 0 
            ? filteredSubservices.map(sub => `
                <li class="subservice-row">
                    <div class="subservice-left">
                        <p class="subservice-name">${sub.name || sub.id}</p>
                        <p class="subservice-duration">${sub.duration || ''}</p>
                    </div>
                    <div class="subservice-right">
                        <p class="subservice-price">${sub.price}₮</p>
                        <button class="subservice-book-btn">></button>
                    </div>
                </li>
            `).join('')
            : '<li class="no-service">Үйлчилгээ байхгүй</li>';
        
        return /*html*/`
            <div class="salon-card">
                <div class="selected-information">
                    <img src="${salon.img || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500'}" 
                         alt="${salon.name}">
                    <div class="info-text">
                        <div class="top">
                            <p class="name"><strong>${salon.name || 'Салон'}</strong></p>
                            <p>${salon.rating || '0.0'} (${salon.reviews_count || 0})</p>
                        </div>
                        <p>${salon.location || ''}</p>
                    </div>
                </div>
                <ul class="subservices-list">
                    ${subservicesHTML}
                </ul>
            </div>
        `;
    }

    renderArtistCard(artist) {
        const selectedServiceId = window.orderManager?.getData().service || null;
        
        let filteredSubservices = [];
        
        if (artist.service && Array.isArray(artist.service)) {
            artist.service.forEach(serviceGroup => {
                if (serviceGroup.subservice && Array.isArray(serviceGroup.subservice)) {
                    serviceGroup.subservice.forEach(sub => {
                        if (!selectedServiceId || sub.id === selectedServiceId) {
                            filteredSubservices.push(sub);
                        }
                    });
                }
            });
        }
        
        const subservicesHTML = filteredSubservices.length > 0 
            ? filteredSubservices.map(sub => `
                <li class="subservice-row">
                    <div class="subservice-left">
                        <p class="subservice-name">${sub.name || sub.id}</p>
                        <p class="subservice-duration">${sub.duration || ''}</p>
                    </div>
                    <div class="subservice-right">
                        <p class="subservice-price">${sub.price}₮</p>
                        <button class="subservice-book-btn">></button>
                    </div>
                </li>
            `).join('')
            : '<li class="no-service">Үйлчилгээ байхгүй</li>';
        
        return /*html*/`
            <div class="artist-card">
                <div class="selected-information">
                    <img src="${artist.img || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500'}" 
                         alt="${artist.name}">
                    <div class="info-text">
                        <div class="top">
                            <p><strong>${artist.name || 'Артист'}</strong></p>
                            <p>${artist.rating || '0.0'} (${artist.reviews_count || 0})</p>
                        </div>
                        <p>${artist.location || ''}</p>
                    </div>
                </div>
                <ul class="subservices-list">
                    ${subservicesHTML}
                </ul>
            </div>
        `;
    }
// components/orderOuter.js

handleBookingClick(e) {
    // ✅ 0. НЭВТРЭЛТ ШАЛГАХ - НЭГ Л УДАА ALERT
    if (!window.BookingManager || !window.BookingManager.checkAuth()) {
        // ✅ Зөвхөн showAuthPrompt() - энэ нь confirm() харуулна
        if (window.BookingManager) {
            window.BookingManager.showAuthPrompt();
        } else {
            // BookingManager байхгүй бол
            const shouldLogin = confirm('⚠️ Захиалга хийхийн тулд нэвтэрнэ үү?');
            if (shouldLogin) {
                window.location.hash = '#/login';
            }
        }
        return; // ❌ ЗОГСОХ
    }
    
    // ✅ 1. ОГНОО/ЦАГ ШАЛГАХ
    const orderData = window.orderManager?.getData();
    
    if (!orderData || !orderData.date) {
        showNotification('Огноогоо сонгоно уу');
        const dateDropdown = document.querySelector('order-date');
        if (dateDropdown) {
            dateDropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    if (!orderData.time) {
        showNotification('Цагаа сонгоно уу');
        const timeDropdown = document.querySelector('order-time');
        if (timeDropdown) {
            timeDropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // ✅ 2. SERVICE МЭДЭЭЛЭЛ
    const row = e.target.closest('.subservice-row');
    const card = e.target.closest('.salon-card, .artist-card');
    
    if (!row || !card) return;
    
    const serviceName = row.querySelector('.subservice-name')?.textContent || '';
    const duration = row.querySelector('.subservice-duration')?.textContent || '';
    const price = row.querySelector('.subservice-price')?.textContent.replace('₮', '') || '';
    
    const nameElement = card.querySelector('.name strong, .top p strong');
    const salonName = nameElement?.textContent || '';
    
    // ✅ 3. FULL DATA
    let fullData = null;
    let serviceCategory = null;
    
    if (card.classList.contains('salon-card')) {
        fullData = this.salonsData.salons.find(s => s.name === salonName);
    } else {
        const independent = this.salonsData.salons.find(s => s.id === 'independent');
        fullData = independent?.artists.find(a => a.name === salonName);
    }
    
    // ✅ 4. CATEGORY
    if (fullData && fullData.service) {
        fullData.service.forEach(serviceGroup => {
            if (serviceGroup.subservice) {
                const foundSub = serviceGroup.subservice.find(sub => 
                    sub.name === serviceName || sub.id === serviceName
                );
                if (foundSub) {
                    serviceCategory = serviceGroup.type;
                }
            }
        });
    }
    
    // ✅ 5. ХАДГАЛАХ
    if (fullData) {
        const bookingData = {
            service: serviceName,
            category: serviceCategory || 'Үйлчилгээ',
            duration: duration,
            price: price,
            date: new Date(orderData.date).toISOString(),
            dateFormatted: new Date(orderData.date).toLocaleDateString('mn-MN'),
            time: orderData.time,
            salon: salonName,
            salonId: fullData.id
        };
        
        console.log('💾 Saving booking:', bookingData);
        
        if (window.BookingManager) {
            const saved = window.BookingManager.saveBooking(bookingData);
            
            if (saved) {
                window.BookingManager.navigateToProfile();
                setTimeout(() => {
                    window.BookingManager.showNotification('✅ Захиалга баталгаажсан', 'success');
                }, 400);
            }
            // ✅ saved === null бол BookingManager-аас мессеж өгсөн байна
        } else {
            console.error('❌ BookingManager not loaded');
        }
    } else {
        console.error('❌ Salon/Artist not found:', salonName);
    }
}

openBookingDialog(data) {
    console.log('🎫 Opening booking dialog:', data);
    
    // ✅ НЭГ Л УДАА ALERT
    if (!window.BookingManager || !window.BookingManager.checkAuth()) {
        if (window.BookingManager) {
            window.BookingManager.showAuthPrompt();
        } else {
            const shouldLogin = confirm('⚠️ Захиалга хийхийн тулд нэвтэрнэ үү?');
            if (shouldLogin) {
                window.location.hash = '#/login';
            }
        }
        return;
    }
    
    const dialog = document.createElement('booking-dialog');
    dialog.setAttribute('service-name', data.serviceName);
    dialog.setAttribute('service-category', data.serviceCategory);
    dialog.setAttribute('service-duration', data.duration);
    dialog.setAttribute('service-price', data.price);
    dialog.setAttribute('salon-name', data.salonName);
    dialog.setAttribute('salon-id', data.salonId);
    dialog.setAttribute('available-dates', JSON.stringify(data.availableDates));
    dialog.setAttribute('available-times', JSON.stringify(data.availableTimes));
    
    document.body.appendChild(dialog);
}
}

window.customElements.define('order-outer', OrderOuter);