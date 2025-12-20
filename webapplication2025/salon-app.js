import './app.js';
class SalonApp extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        //implementation
        this.innerHTML = /*html*/`
        <aside-nav></aside-nav>
        <main id="content"></main>
        <salon-router>
            <salon-routes>
                <salon-route zam="/" com="salon-home"></salon-route>
                <salon-route zam="/info" com="salon-info"></salon-route>
                <salon-route zam="/profile" com="salon-profile"></salon-route>
            </salon-routes>
        </salon-router>    
        <salon-footer></salon-footer>
        `;

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

window.customElements.define('salon-app', SalonApp);