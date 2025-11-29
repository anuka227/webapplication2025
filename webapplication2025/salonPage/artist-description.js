class ArtistDescription extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.type = this.getAttribute("type") || "special";
        this.name = this.getAttribute("name") || "Unknown Artist";
        
        switch(this.type) {
            case "max": 
            case "medium":
            case "min":
            default:
        }
    }
    artistSpecial() {

    }
    artistMax() {

    }
    artistMedium() {
        
    }
    artistMin() {

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

window.customElements.define('artist-description', ArtistDescription);