class SalonDescription extends HTMLElement {
    constructor() {
        super();
        this.salonData = null; 
    }

    connectedCallback() {
        this.name = this.getAttribute("name") || "Unknown Salon";
        this.img = this.getAttribute("img") || "https://picsum.photos/300/200";
        this.rating = this.getAttribute("rating") || "0.0";
        this.type = this.getAttribute("type") ?? "-";
        this.location = this.getAttribute("location");
        this.schedule = this.getAttribute("schedule");
        this.branch = this.getAttribute("branch");

        let services = [];
        const serviceAttri = this.getAttribute("services");
        if(serviceAttri) {
            try {
                services = JSON.parse(serviceAttri);
            } catch(e) {
                console.error('Error parsing services:', e);
            }
        }
        this.services = services;
        let fullServices = [];
        const fullServicesAttri = this.getAttribute("fullservices");
        if(fullServicesAttri) {
            try {
                const decoded = this.decodeHTMLEntities(fullServicesAttri);
                fullServices = JSON.parse(decoded);
                console.log('Parsed full services:', fullServices);
            } catch(e) {
                console.error('Error parsing full services:', e);
            }
        }
        this.fullServices = fullServices;
        let branches = [];
        const branchesAttri = this.getAttribute("branches");
        if(branchesAttri) {
            try {
                branches = JSON.parse(branchesAttri);
            } catch(e) {
                console.error('Error parsing branches:', e);
            }
        }
        this.branches = branches;
        let artists = [];
        const artistsAttri = this.getAttribute("artists");
        if(artistsAttri) {
            try {
                artists = JSON.parse(artistsAttri);
            } catch(e) {
                console.error('Error parsing artists:', e);
            }
        }
        this.artists = artists;
        let creative = [];
        const creativeAttri = this.getAttribute("creative");
        if(creativeAttri) {
            try {
                creative = JSON.parse(creativeAttri);
            } catch(e) {
                console.error('Error parsing creative:', e);
            }
        }
        this.creative = creative;
        this.loadFullSalonData();

        switch (this.type) {
            case "special":
                console.log("SPECIAL");
                this.specialSalon();
                break;
            case "maximum":
                console.log("MAX");
                this.salonMaximum();
                break;
            case "minimum":
                console.log("MIN");
                this.salonMinimum();
                break;
            default:
                console.log("Detailed");
                this.salonDetailed();
                break;
        }
    }

    async loadFullSalonData() {
        try {
            const salonId = this.getAttribute("data");
            const response = await fetch('./salonPage/json/salon.json');
            const data = await response.json();
            this.salonData = data.salons?.find(s => s.id === salonId);
            console.log('Loaded full salon data:', this.salonData);
        } catch (error) {
            console.error('Error loading salon data:', error);
        }
    }

    render() {
    }

    decodeHTMLEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    specialSalon() {
        this.innerHTML = /*html*/`
            <article>
                <img src="${this.img}" alt="${this.name}">
                <h4>${this.name}</h4>
            </article>
        `;
        console.log("/SPECIAL");
    }

    salonMinimum() {
        const stars = this.getStarsHTML(parseFloat(this.rating));
        
        this.innerHTML = `
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
        console.log('/MIN');
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
            </div>
        `;
        console.log("/DETAILED");

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
        this.innerHTML = /*html*/`
            <div class="information">
                <h1>${this.name}</h1>
                <article>
                    <img src="${this.img}" alt="${this.name}">
                    <address>
                        ${this.branches ? this.branches.map((branch, index) => `
                            <h3>${branch.branch_name || `NULL`}</h3>
                            <h4>Хаяг</h4>
                            <p>${branch.location || '?'}</p>
                            <p>Цагийн хуваарь: ${branch.schedule || '?'}</p>
                            
                        `).join('') : `
                            <h3>Салбар</h3>
                            <h4>Хаяг</h4>
                            <p>${this.location || '?'}</p>
                            <p>Цагийн хуваарь: ${this.schedule || '?'}</p>
                        `}
                    </address>
                </article>
                
                <section class="services-section">
                    <h2>Үйлчилгээнүүд</h2>
                    <div class="services-container" id="servicesContainer">
                    </div>
                </section>
                
                ${this.artists ? `
                    <section>
                        <h2>Артистууд</h2>
                        <div class="artist">
                            ${this.artists.map(artist => `
                                <div>
                                    <img src="${artist.img || 'https://picsum.photos/80/80?random=' + Math.random()}" alt="${artist.name}">
                                    <h3>${artist.profession || 'Artist'}</h3>
                                    <p>${artist.name}</p>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                ` : ''}
            </div>
                
        `;
        setTimeout(() => this.loadAndRenderServices(), 100);
    }
    async loadAndRenderServices() {
        const container = this.querySelector('#servicesContainer');
        if (!container) return;
        let servicesToRender = this.fullServices;
        
        if (!servicesToRender || servicesToRender.length === 0) {
            container.innerHTML = `<div class="loading-message">Үйлчилгээ байхгүй байна.</div>`;
            return;
        }
        container.innerHTML = servicesToRender.map((serviceCategory, index) => `
            <div class="service-category" data-category-index="${index}">
                <div class="service-category-header">
                    <div>
                        <h3>${serviceCategory.type}</h3>
                        ${serviceCategory.description ? `<div class="description">${serviceCategory.description}</div>` : ''}
                    </div>
                   
                </div>
                <div class="service-category-content">
                    <ul class="subservice-list">
                        ${(serviceCategory.subservice || []).map(subservice => `
                            <li class="subservice-item">
                                <div class="subservice-info">
                                    <div class="subservice-name">${subservice.name}</div>
                                    <div class="subservice-duration">${subservice.duration}</div>
                                </div>
                                <div class="subservice-price">${this.formatPrice(subservice.price)}</div>
                                <button class="book-button" data-service-id="${subservice.id}">
                                    Захиалах
                                </button>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        this.attachServiceEvents();
    }

    formatPrice(price) {
        return parseInt(price).toLocaleString('mn-MN') + '₮';
    }

    attachServiceEvents() {
        this.querySelectorAll('.service-category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const category = e.currentTarget.closest('.service-category');
                category.classList.toggle('expanded');
            });
        });

        this.querySelectorAll('.book-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceId = e.target.dataset.serviceId;
                this.handleBooking(serviceId);
            });
        });
    }

    handleBooking(serviceId) {
        console.log('Booking service:', serviceId);
        alert(`Үйлчилгээ захиалах: ${serviceId}\nСалон: ${this.name}`);
    }

    disconnectedCallback() {
       
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }
}

window.customElements.define('salon-description', SalonDescription);