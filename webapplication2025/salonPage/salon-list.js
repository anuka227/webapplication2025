class SalonList extends HTMLElement {
    constructor() {
        super();
        this.salons = [];
        //implementation
    }

    async connectedCallback() {
        //implementation
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

window.customElements.define('salon-list', SalonList);