class OrderInner extends HTMLElement {
    constructor() {
    super();
    }

    connectedCallback() {
    const service = this.getAttribute('service') || '';
    const svg = this.getAttribute('svgpath') || '';
    const slotContent = this.innerHTML;

    this.innerHTML = /*html*/`
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
    document.querySelectorAll('order-inner .map-container').forEach(map => {
        map.style.display = 'none';
    });
    document.querySelectorAll('order-inner .hidden-content.show').forEach(el => {
        if (el !== contentDiv) el.classList.remove('show');
    });
        contentDiv.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
            contentDiv.classList.remove('show');
    }
    });

    const orderTime = contentDiv.querySelector('order-time');
        if (orderTime) {
            orderTime.addEventListener('time-selected', (e) => {
                const selectedTime = e.detail.time;
                btnText.textContent = selectedTime;
                contentDiv.classList.remove('show');
                this.dispatchEvent(new CustomEvent('time-selected', {
                    detail: { time: selectedTime },
                    bubbles: true,
                    composed: true
                }));
            });
        }
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