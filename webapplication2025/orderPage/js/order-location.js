class OrderLocation extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        //implementation
        this.innerHTML = /*html*/ `
            <ul class="locations">
                <li><p>Байршил</p></li>
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
        `
        const orderInner = this.closest('order-inner');
        if (!orderInner) return;

        // order-inner дотрох button болон hidden-content олох
        const btn = orderInner.querySelector('.toggle-btn');
        const btnText = btn?.querySelector('p');
        const contentDiv = orderInner.querySelector('.hidden-content');

        // Select элемент дээр listener нэмэх
        const locationSelect = this.querySelector('.add-location select');
        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                e.stopPropagation();
                const selectedValue = e.target.value;
                
                // "Байршил нэмэх" гэсэн анхны option-ыг алгасах
                if (selectedValue !== 'Байршил нэмэх' && btnText) {
                    btnText.textContent = selectedValue;
                    if (contentDiv) {
                        contentDiv.classList.remove('show');
                    }
                }
            });
        }

        // "Map" button дээр listener нэмэх
        const getLocationBtn = this.querySelector('.get-location');
        if (getLocationBtn) {
            getLocationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (contentDiv) {
                    contentDiv.classList.remove('show');
                }
                
                // Map container үүсгэх
                let mapContainer = orderInner.querySelector('.map-container');
                if (mapContainer) {
                    mapContainer.remove();
                }
                
                mapContainer = document.createElement('div');
                mapContainer.className = 'map-container';
                mapContainer.style.display = 'block';
                orderInner.appendChild(mapContainer);

                if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const lat = pos.coords.latitude;
                            const lon = pos.coords.longitude;
                            mapContainer.innerHTML = `
                                <iframe
                                    width="500"
                                    height="500"
                                    style="border-radius:10px; border: 4px solid #eba7ac"
                                    loading="lazy"
                                    allowfullscreen
                                    referrerpolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps?q=${lat},${lon}&hl=mn&z=15&output=embed">
                                </iframe>
                            `;
                        },
                        (err) => {
                            mapContainer.innerHTML = `<p style="color:red;">Алдаа гарлаа: ${err.message}</p>`;
                        }
                    );
                } else {
                    mapContainer.innerHTML = `<p style="color:red;">Таны browser байршил авахыг дэмжихгүй байна.</p>`;
                }
            });
        }
    }


    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }

}
window.customElements.define('order-location', OrderLocation);