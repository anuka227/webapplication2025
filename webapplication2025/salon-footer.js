class SalonFooter extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        //implementation
        this.innerHTML = /* html */`
        <footer>
            <p>Created by @WEBAPPLICATIONTEAM</p>
        </footer>
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

window.customElements.define('salon-footer', SalonFooter);