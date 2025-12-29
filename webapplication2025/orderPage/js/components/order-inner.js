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
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    ${svg}
                </svg> 
                <p>${service}</p>
            </button>
            <div class="hidden-content">
                ${slotContent}
            </div>
        `;

        const btn = this.querySelector('.toggle-btn');
        const contentDiv = this.querySelector('.hidden-content');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            document.querySelectorAll('order-inner .hidden-content.show').forEach(el => {
                if (el !== contentDiv) {
                    el.classList.remove('show');
                }
            });
            
            document.querySelectorAll('order-inner .map-container').forEach(map => {
                if (!this.contains(map)) {
                    map.style.display = 'none';
                }
            });
            
            contentDiv.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                contentDiv.classList.remove('show');
            }
        });
    }
}

customElements.define('order-inner', OrderInner);