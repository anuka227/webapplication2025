class OrderLocation extends HTMLElement {
    constructor() {
        super();
        this.selectedCoords = null;
        this.map = null;
        this.marker = null;

        this.locationsData = {
            "Офицер": { lat: 47.9155352, lng: 106.9686054},
            "Зүүн 4 зам": { lat: 47.9189213, lng: 106.9412899 },
            "Сансар": { lat: 47.9269738, lng: 106.9236946 },
            "Шинэ зуун айл": { lat: 47.9059041, lng: 106.9520625 },
            "Амгалан": { lat: 47.9059041, lng: 106.9520625 },
            "Натур": { lat: 47.9116262, lng: 106.9176731 },
            "Зайсан": { lat: 47.9116262, lng: 106.9176731 },
            "Дөлгөөннуур": { lat: 47.9323515, lng: 106.9147106 },
            "Сүхбаатарын талбай": { lat: 47.9190455, lng: 106.9175499 },
            "10-р хороолол": { lat: 47.9139691, lng: 106.8671358 },
            "5 шар": { lat: 47.9139691, lng: 106.8671358 },
            "3,4 Хороолол": { lat: 47.9214453, lng: 106.8747682 },
            "Яармаг": { lat: 47.870042, lng: 106.8158627 },
            "120 мянгат": { lat: 47.9016616, lng: 106.9076207 },
            "Нарны зам": { lat: 47.9082281, lng: 106.9298725 },
            "Баянмонгол": { lat: 47.9045486, lng: 106.9224587 },
            "Баруун 4 зам": { lat: 47.9153454, lng: 106.8624716 },
            "Шар хад": { lat: 47.9153454, lng: 106.8624716 },
            "Дүнжингарав": { lat: 47.9189213, lng: 106.9412899}
        };
    }

    connectedCallback() {
        this.innerHTML = /*html*/ `
            <ul class="locations">
                <li class="service-header"><p>Байршил</p></li>
                <li class="get-location">
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.36328 12.0523C4.01081 11.5711 3.33457 11.3304 3.13309 10.9655C2.95849 10.6492 2.95032 10.2673 3.11124 9.94388C3.29694 9.57063 3.96228 9.30132 5.29295 8.76272L17.8356 3.68594C19.1461 3.15547 19.8014 2.89024 20.2154 3.02623C20.5747 3.14427 20.8565 3.42608 20.9746 3.7854C21.1106 4.19937 20.8453 4.85465 20.3149 6.16521L15.2381 18.7078C14.6995 20.0385 14.4302 20.7039 14.0569 20.8896C13.7335 21.0505 13.3516 21.0423 13.0353 20.8677C12.6704 20.6662 12.4297 19.99 11.9485 18.6375L10.4751 14.4967C10.3815 14.2336 10.3347 14.102 10.2582 13.9922C10.1905 13.8948 10.106 13.8103 10.0086 13.7426C9.89876 13.6661 9.76719 13.6193 9.50407 13.5257L5.36328 12.0523Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>Map</p>
                </li>
                <li class="add-location">
                    <svg width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><g id="Complete"><g data-name="add" id="add-2"><g>
                        <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="19" y2="5"/>
                        <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" x2="19" y1="12" y2="12"/></g></g></g>
                    </svg>
                    <select>
                        <option>Байршил нэмэх</option>
                        <option>Офицер</option>
                        <option>Зүүн 4 зам</option>
                        <option>Дүнжингарав</option>
                        <option>Сансар</option>
                        <option>Шинэ зуун айл</option>
                        <option>Амгалан</option>
                        <option>Натур</option>
                        <option>Зайсан</option>
                        <option>Дөлгөөннуур</option>
                        <option>Сүхбаатарын талбай</option>
                        <option>10-р хороолол</option>
                        <option>5 шар</option>
                        <option>3,4 Хороолол</option>
                        <option>Яармаг</option>
                        <option>120 мянгат</option>
                        <option>Нарны зам</option>
                        <option>Баянмонгол</option>
                        <option>Баруун 4 зам</option>
                        <option>Шар хад</option>
                    </select>
                </li>
            </ul>
        `;
        this.setupListeners();
    }

    setupListeners() {
        const orderInner = this.closest('order-inner');
        if (!orderInner) return;
        const btnText = orderInner.querySelector('.toggle-btn p');
        const contentDiv = orderInner.querySelector('.hidden-content');
        this.querySelector('.add-location select').addEventListener('change', (e) => {
            e.stopPropagation();
            const locationName = e.target.value;
            
            if (locationName !== 'Байршил нэмэх') {
                btnText.textContent = locationName;
                contentDiv?.classList.remove('show');
                const coords = this.locationsData[locationName];
                if (coords) {
                    window.orderManager?.updateLocation({
                        name: locationName,
                        coordinates: coords
                    });
                    
                    console.log('📍 Dropdown-оос сонгосон:', locationName, coords);
                } else {
                    console.warn('⚠️ Байршил олдсонгүй:', locationName);
                }
            }
        });

        this.querySelector('.get-location').addEventListener('click', (e) => {
            e.stopPropagation();
            contentDiv?.classList.remove('show');
            this.openMap(orderInner, btnText);
        });
    }

    openMap(orderInner, btnText) {
        orderInner.querySelector('.map-container')?.remove();

        const container = this.createMapContainer();
        orderInner.appendChild(container);

        this.getUserLocation(container, btnText);
    }

    createMapContainer() {
        const container = document.createElement('div');
        container.className = 'map-container';
        container.innerHTML = `
            <svg class="close-btn" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="currentColor"/>
            </svg>            
            <div class="map-view" id="map-${Date.now()}"></div>
            <div class="coords-box" style="display:none">
                <p><strong>Одоогийн байршил:</strong></p>
                <p class="coords-text"></p>
            </div>
        `;
        container.querySelector('.close-btn').onclick = () => container.remove();
        return container;
    }

    getUserLocation(container, btnText) {
        navigator.geolocation.getCurrentPosition(
            (pos) => this.initMap(container, pos.coords.latitude, pos.coords.longitude, btnText),
            () => container.querySelector('.map-view').innerHTML = '<p style="text-align:center;padding:50px;color:red">Алдаа гарлаа</p>'
        );
    }

    initMap(container, lat, lng, btnText) {
        const mapDiv = container.querySelector('.map-view');
        setTimeout(() => {
            // Map үүсгэх
            this.map = L.map(mapDiv.id).setView([lat, lng], 16);
            L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(this.map);

            const userIcon = L.divIcon({
                html: '<div style="width:18px;height:18px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            });
            L.marker([lat, lng], { icon: userIcon }).addTo(this.map);

            // Координат харуулах
            this.updateCoords(container, lat, lng);
            btnText.textContent = 'ОДООГИЙН БАЙРШИЛ';
            
            // ✅ Map нээгдэхэд ч координатыг хадгалах
            window.orderManager?.updateLocation({
                name: 'Одоогийн байршил',
                coordinates: { lat, lng }
            });
            
            this.map.on('click', (e) => this.onMapClick(e, container, btnText));
        }, 100);
    }

    onMapClick(e, container, btnText) {
        const { lat, lng } = e.latlng;

        // Хуучин marker устгах
        if (this.marker) this.map.removeLayer(this.marker);

        // Улаан marker
        const icon = L.divIcon({
            html: `<svg width="32" height="45"><ellipse cx="16" cy="42" rx="10" ry="3" fill="rgba(0,0,0,0.2)"/><path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28s12-19 12-28c0-6.627-5.373-12-12-12z" fill="#EA4335"/><circle cx="16" cy="12" r="5" fill="white"/><circle cx="16" cy="12" r="3" fill="#EA4335"/></svg>`,
            iconSize: [32, 45],
            iconAnchor: [16, 45]
        });
        this.marker = L.marker([lat, lng], { icon }).addTo(this.map);
        this.selectedCoords = { lat, lng };
        this.updateCoords(container, lat, lng);
        btnText.textContent = 'СОНГОСОН БАЙРШИЛ';
        
        console.log('🗺️ Map-аас сонгосон:', { lat, lng });

        window.orderManager?.updateLocation({
            name: 'Сонгосон байршил',
            coordinates: { lat, lng }
        });
    }

    updateCoords(container, lat, lng) {
        const box = container.querySelector('.coords-box');
        const text = container.querySelector('.coords-text');
        text.innerHTML = `<strong>Өргөрөг:</strong> ${lat.toFixed(6)}<br><strong>Уртраг:</strong> ${lng.toFixed(6)}`;
        box.style.display = 'block';
    }

    disconnectedCallback() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }
}

window.customElements.define('order-location', OrderLocation);