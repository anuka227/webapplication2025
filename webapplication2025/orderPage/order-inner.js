class OrderInner extends HTMLElement {
    constructor() {
    super();
    }

    connectedCallback() {
    const service = this.getAttribute('service') || '';
    const svg = this.getAttribute('svgpath') || '';
    const slotContent = this.innerHTML;

    this.innerHTML = `
        <button class="toggle-btn">
        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${svg}</svg> 
        <p>${service}</p>
        </button>
        <div class="hidden-content">
        ${slotContent}
        </div>
    `;

    const btn = this.querySelector('.toggle-btn');
    const contentDiv = this.querySelector('.hidden-content');
    const btnText = btn.querySelector('p');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
    document.querySelectorAll('order-one-segment .map-container').forEach(map => {
        map.style.display = 'none';
    });
    document.querySelectorAll('order-one-segment .hidden-content.show').forEach(el => {
        if (el !== contentDiv) el.classList.remove('show');
    });
        contentDiv.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
            contentDiv.classList.remove('show');
    }
    });

    // Үйлчилгээ хэсгийн утгыг солих
    const serviceList = contentDiv.querySelector('ul.services');
    if (serviceList) {
        const listItems = serviceList.querySelectorAll('li');
        listItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedText = item.querySelector('p')?.textContent || '';
            btnText.textContent = selectedText;
            contentDiv.classList.remove('show');
        });
    });
    }

    // Байршил авах код
    const locationLi = this.querySelector('.get-location');
    let mapContainer = this.querySelector('.map-container');
    if (locationLi) {
        locationLi.addEventListener('click', (e) => {
        e.stopPropagation();

        contentDiv.classList.remove('show');
        if (mapContainer) {
            mapContainer.remove();
        }
        mapContainer = document.createElement('div');
        mapContainer.className = 'map-container';
        mapContainer.style.display = 'block';
        this.appendChild(mapContainer);

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

    document.addEventListener('click', (e) => {
        if (!this.contains(e.target) && mapContainer) {
            mapContainer.style.display = 'none';
        }
    });
    }
    }
}

customElements.define('order-inner', OrderInner);



const addLoc = document.querySelector('.add-location');
const add2Loc = document.querySelector('.add-2-location');
    
if (addLoc) {
    addLoc.addEventListener('click', (e) => {
        e.stopPropagation();
        add2Loc.classList.toggle('show');
    });
}
document.addEventListener('click', (e) => {
if (!addLoc.contains(e.target) && !add2Loc.contains(e.target)) {
    add2Loc.classList.remove('show');
    }
});

