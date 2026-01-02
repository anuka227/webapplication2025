class SalonLogin extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `<auth-form mode="standalone"></auth-form>`;
    }
}

customElements.define('salon-login', SalonLogin);