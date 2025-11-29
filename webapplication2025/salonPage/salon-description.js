class SalonDescription extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        //implementation
        const name = this.getAttribute("name") || "Unknown Salon";
        const img = this.getAttribute("img") || "https://picsum.photos/300/200";
        const rating = this.getAttribute("rating") || "0.0";

    }
    render() {

    }
    specialSalon() {
        

        this.innerHTML = /*html*/`
            <article>
                <img src="${img}" alt="${name}">
                <h4>${name}</h4>
            </article>
            <div class="salonInfo" style="display:none;">
                ${this.originalContent}
            </div>
        `;
    }

    salon() {
        const name = this.getAttribute("name") || "Unknown Salon";
        const img = this.getAttribute("img");
        const rating = this.getAttribute
    }

    salonDetailed() {

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



window.customElements.define('salon-description', SalonDescription);