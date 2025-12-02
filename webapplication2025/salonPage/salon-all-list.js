class SalonAllList extends HTMLElement {
    constructor() {
        super();
        this.salons = [];
    }

    async connectedCallback() {
        await this.loadSalons();
        this.render();
        this.attachEvents();
    }

    async loadSalons() {
        try {
             const response = await fetch('./salonPage/json/salon.json');
            const data = await response.json();
            this.salons = data.salons || [];
        } catch (error) {
            this.salons = [];
        }
    }

    render() {
        this.innerHTML = /*html*/`
            <div class="salon-content-wrapper">
                <div class="salon-list" id="salonList">
                    ${this.salons.map(salon => {
                        return `
                            <salon-description 
                                type="minimum" 
                                data="${salon.id}"
                                name="${salon.name}"
                                img="${salon.img}"
                                rating="${salon.rating}"
                                >
                            </salon-description>
                        `;
                    }).join('')}
                </div>
                <div class="salon-detail" id="salonDetail">
                    <div id="detailContent"></div>
                </div>
            </div>
        `;
        
        console.log('Render complete');
    }

    attachEvents() {
        this.querySelectorAll('salon-description[type="minimum"]').forEach(salonCard => {
            const article = salonCard.querySelector('article');
            if (article) {
                article.addEventListener('click', () => {
                    console.log('Salon clicked:', salonCard.getAttribute('name'));
                    this.showDetail(salonCard);
                });
            }
        });
    }

    showDetail(salonCard) {
        const salonId = salonCard.getAttribute("data");
        const salon = this.salons.find(sal => sal.id === salonId);
        
        if (!salon) {
            return;
        }

        console.log('Showing detail for:', salon.name);
        console.log('Full salon data:', salon);
        
        const salonList = this.querySelector('#salonList');
        salonList.classList.add('column-mode');
        
        const detailContainer = this.querySelector('#salonDetail');
        const detailContent = this.querySelector('#detailContent');

        const location = salon.branches ? salon.branches[0].location : salon.location || '?';
        const schedule = salon.branches ? salon.branches[0].schedule : salon.schedule || '?';

        const serviceTypes = salon.service?.map(s => s.type) || [];
        const branches = salon.branches || [];
        const artists = salon.artists || [];
        const services = salon.service || []; 
        const creative = salon.creative || [];
        
        detailContent.innerHTML = `
            <salon-description 
                type="maximum" 
                data="${salon.id}"
                name="${salon.name}"
                img="${salon.img}"
                rating="${salon.rating}"
                location="${location}"
                schedule="${schedule}"
                services='${JSON.stringify(serviceTypes)}'
                fullservices='${this.escapeJSON(JSON.stringify(services))}'
                branches='${this.escapeJSON(JSON.stringify(branches))}'
                artists='${this.escapeJSON(JSON.stringify(artists))}'
                creative='${this.escapeJSON(JSON.stringify(creative))}'>
            </salon-description>
        `;
        
        detailContainer.classList.add('active');
        
        // Буцах товч нэмэх
        setTimeout(() => {
            const infoSection = detailContent.querySelector('.information article');
            if (infoSection && !infoSection.querySelector('.back-btn')) {
                const backBtn = document.createElement('button');
                backBtn.className = 'back-btn';
                backBtn.textContent = 'Буцах';
                backBtn.addEventListener('click', () => this.hideDetail());
                infoSection.insertBefore(backBtn, infoSection.firstChild);
            }
        }, 50);
    }

    escapeJSON(jsonString) {
        return jsonString
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    hideDetail() {
        const salonList = this.querySelector('#salonList');
        const detailContainer = this.querySelector('#salonDetail');   
        salonList.classList.remove('column-mode');
        detailContainer.classList.remove('active');
    }

    disconnectedCallback() {
    }
}

customElements.define('salon-all-list', SalonAllList);