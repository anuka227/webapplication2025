export class SalonHome extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        //implementation
        this.innerHTML = /* html */`
            <salon-header></salon-header>
		    <order-outer></order-outer>
		    <salon-special-list></salon-special-list>
		    <artist-special-list></artist-special-list>
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

window.customElements.define('salon-home', SalonHome);