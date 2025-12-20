export class SalonRouter extends HTMLElement {
    constructor() {
        super();
        this.routes = new Map();
    }
    
    urlBurtguul(route) {
        this.routes.set(route.path, route.page);
        console.log(this.routes);
    }
    
    connectedCallback() {
        window.addEventListener('hashchange', _ => {
            const hash = window.location.hash;
            const target = document.getElementById('content');
            switch(hash) {
                case '#/home':
                    target.innerHTML = `<salon-home></salon-home>`;
                    break;
                case '#/info':
                    target.innerHTML = `<salon-info></salon-info>`;
                    break;
                case '#/profile':
                    target.innerHTML = `<salon-profile></salon-profile>`;
                    break;
                default:
                    target.innerHTML = `<h1>404 - Хуудас олдсонгүй</h1>`;
            }
        });
        
    }
    
    disconnectedCallback() {
    }
    
    attributeChangedCallback(name, oldVal, newVal) {
    }
    
    adoptedCallback() {
    }
}

window.customElements.define('salon-router', SalonRouter);