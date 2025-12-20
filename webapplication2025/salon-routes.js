class SalonRoutes extends HTMLElement {
    constructor() {
        super();
        this.routes = new Map();
    }
    
    urlBurtguul(route) {
        this.routes.set(route.path, route.page);
        console.warn(this.routes);
    }
    
    connectedCallback() {
        console.log("ROUTES connected")
        this.querySelectorAll('salon-route')
            .forEach(r => { 
                const path = r.getAttribute('zam') ?? "/";
                const page = r.getAttribute('com') ?? "salon-app";
                // this.parentElement.routes.set(path, page); //muu arga
                this.parentElement.urlBurtguul({path, page});
            });
        
        
    }
    
    disconnectedCallback() {
    }
    
    attributeChangedCallback(name, oldVal, newVal) {
    }
    
    adoptedCallback() {
    }
}

window.customElements.define('salon-routes', SalonRoutes);