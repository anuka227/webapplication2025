class ArtistDescription extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.type = this.getAttribute("type") || "special";
        this.name = this.getAttribute("name") || "Unknown Artist";
        this.img = this.getAttribute("img") || "https://picsum.photos/300/200";
        this.profession = this.getAttribute("profession") || "";
        this.rating = this.getAttribute("rating") || "0.0";
        this.location = this.getAttribute("location") || "0.0";
        this.experience = this.getAttribute("experience") || "4";
        this.artImg = this.getAttribute("artImg");
        

        switch(this.type) {
            case "max": 
                console.log("MAX");
                this.artistMax();
            case "medium":
                console.log("Med");
                this.artistMedium();
            case "min":
                console.log("MIN");
                this.artistMin();
            default:
                console.log("Spec");
                this.artistSpecial();
        }
    }
    artistSpecial() {
        this.innerHTML = /*html */`
            <img src="${this.img}" alt = "${this.name}">
            <h4>${this.name}</h4>
        `;
        console.log("/SpecialArt");
    }
    artistMedium() {
        this.innerHTML = /*html*/`
        <div class="artistMedium">
        <div class="head">
            <h5>${this.name}</h5>
            <svg class="close-btn" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="currentColor"/>
            </svg>
        </div>
        <div class="main">
            <img src="${this.img}">
            <p>${this.profession}</p>
            <p>★<span>${this.rating}</span></p>
            <h5>Туршлага</h5>
            <p>${this.experience}</p>
            <h5>Ажлын хуваарь</h5>
            <p>${this.schedule}</p>
            <h5>Салоны байршил</h5>
            <p>${this.location}</p>
            <h5>Бүтээлүүд</p>
            <div class="creative">
                ${this.creative.map(item => {
                    if (typeof item === 'object') {
                        return `<img src="${item.img}" alt="${item.alt || 'creative work'}">`;
                    }
                    return `<img src="${item}" alt="creative work">`;
                }).join('')}
            </div>
        </div>
        `

        const closeBtn = this.querySelector('.close-btn');
            if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dialog = document.querySelector('#detailInfo');
                if (dialog) {
                    dialog.close();
                }
            });
        }
    }
    artistMax() {

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