class SalonDescription extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        //implementation
        this.name = this.getAttribute("name") || "Unknown Salon";
        this.img = this.getAttribute("img") || "https://picsum.photos/300/200";
        this.rating = this.getAttribute("rating") || "0.0";
        this.type = this.getAttribute("type") ?? "-";
        this.location = this.getAttribute("location");
        this.schedule = this.getAttribute("schedule");
        this.branch = this.getAttribute("branch");

        let branches = [];
    const branchAttri = this.getAttribute("branches");
    if(branchAttri) {
        try {
            branches = JSON.parse(branchAttri);
        } catch(e) {
            console.error('Branches parse алдаа:', e);
        }
    }
    this.branches = branches;

    let artists = [];
    const artistAttri = this.getAttribute("artists");
    if(artistAttri) {
        try {
            artists = JSON.parse(artistAttri);
        } catch(e) {
            console.error('Artists parse алдаа:', e);
        }
    }
    this.artists = artists;

        let services = [];
        const serviceAttri = this.getAttribute("services");
        if(serviceAttri) {
            services = JSON.parse(serviceAttri);
        }
        this.services = services;

        let creative = [];
        const creativeAttri = this.getAttribute("creative");
        if(creativeAttri) {
            creative = JSON.parse(creativeAttri);
        }
        this.creative = creative;
        switch (this.type) {
            case "special":
                this.specialSalon();
                break;
            case "maximum":
                this.salonMaximum();
                break;
            case "minimum":
                this.salonMinimum();
                break;
            default:
                this.salonDetailed();
                break;
        }
    }
    render() {

    }
    specialSalon() {
        this.innerHTML = /*html*/`
            <article>
                <img src="${this.img}" alt="${this.name}">
                <h4>${this.name}</h4>
            </article>
        `;
    }

salonMinimum() {
        const stars = this.getStarsHTML(parseFloat(this.rating));
        
        this.innerHTML =`
            <article>
                <img src="${this.img}" alt="${this.name}">
                <div>
                    <h4>${this.name}</h4>
                    <div class="rating">
                        ${stars}
                        <span style="margin-left: 5px; color: #666;">${this.rating}</span>
                    </div>
                </div>
            </article>
        `;
    }

    getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - Math.ceil(rating);
        let html = '';
        
        for (let i = 0; i < fullStars; i++) {
            html += '<span style="color: #ffd700;">★</span>';
        }
        for (let i = 0; i < emptyStars; i++) {
            html += '<span style="color: #ddd;">★</span>';
        }
        
        return html;
    }

    salonDetailed() {

        this.innerHTML = /*html*/ `
        <div class="salonMedium">
        <div class="head">
            <h5>${this.name}</h5>
            <svg class="close-btn" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="currentColor"/>
            </svg>
        </div>
        <div class="descriptionMain">
            <h5>Байршил</h5>
            <p>${this.location}</p>
            <h5>Цагийн хуваарь</h5>
            <p>${this.schedule}</p>
            <h5>Явуулдаг Үйлчилгээ</h5>
            <ul class="salonService">
                ${this.services.map(type => `<li>${type}</li>`).join('')}
            </ul>
            <h5>Бүтээлүүд</h5>
            <div class="creative">
                    ${this.creative.map(item => {
                        if (typeof item === 'object') {
                            return `<img src="${item.img}" alt="${item.alt || 'creative work'}">`;
                        }
                        return `<img src="${item}" alt="creative work">`;
                    }).join('')}
                </div>
            </div>`;

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
   salonMaximum() {
    console.log('Branches:', this.branches);
    console.log('Artists:', this.artists);
    
    this.innerHTML = /*html*/`
        <div class="information">
            <h1>${this.name}</h1>
            <article>
                <img src="${this.img}" alt="${this.name}">
                <address>
                    ${this.branches && this.branches.length > 0 ? this.branches.map((branch, index) => `
                        <h3>${branch.branch_name || `Салбар ${index + 1}`}</h3>
                        <h4>Хаяг</h4>
                        <p>${branch.location || 'Байршил тодорхойгүй'}</p>
                        <p>Цагийн хуваарь: ${branch.schedule || 'Байхгүй'}</p>
                        <p>Холбогдох утасны дугаар: 80808080</p>
                        ${index < this.branches.length - 1 ? '<br>' : ''}
                    `).join('') : `
                        <h3>Салбар</h3>
                        <h4>Хаяг</h4>
                        <p>${this.location || 'Байршил тодорхойгүй'}</p>
                        <p>Цагийн хуваарь: ${this.schedule || 'Байхгүй'}</p>
                        <p>Холбогдох утасны дугаар: 80808080</p>
                    `}
                </address>
            </article>
            
            ${this.services && this.services.length > 0 ? `
                <h3>Үйлчилгээнүүд</h3>
                <ul class="service-list">
                    ${this.services.map(type => `<li>${type}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${this.artists && this.artists.length > 0 ? `
                <section>
                    <h2>Артистууд</h2>
                    <div class="artist">
                        ${this.artists.map(artist => `
                            <div>
                                <img src="${artist.img || 'https://picsum.photos/80/80?random=' + Math.random()}">
                                <h3>${artist.specialty || 'Artist'}</h3>
                                <p>${artist.name} ${artist.surname || ''}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>
            ` : ''}
        </div>
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



window.customElements.define('salon-description', SalonDescription);