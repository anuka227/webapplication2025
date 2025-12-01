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
            // console.log(Loaded ${this.salons.length} salons);
        } catch (error) {
            console.error('Салоны өгөгдөл татахад алдаа:', error);
            this.salons = [];
        }
    }

    render() {
        console.log('Rendering salon list...');
        
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
                    <button class="back-btn" id="backBtn">← Буцах</button>
                    <div id="detailContent"></div>
                </div>
            </div>
        `;
        
        console.log('Render complete');
    }

    attachEvents() {
        console.log('Attaching events...');
        
        // Add click event to each salon card
        this.querySelectorAll('salon-description[type="minimum"]').forEach(salonCard => {
            const article = salonCard.querySelector('article');
            if (article) {
                article.addEventListener('click', () => {
                    console.log('Salon clicked:', salonCard.getAttribute('name'));
                    this.showDetail(salonCard);
                });
            }
        });
        
        // Back button event
        const backBtn = this.querySelector('#backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('Back button clicked');
                this.hideDetail();
            });
        }
        
        console.log('Events attached');
    }

    showDetail(salonCard) {
        const salonId = salonCard.getAttribute("data");
        const salon = this.salons.find(sal => sal.id === salonId);
        
        if (!salon) {
            console.error('Salon not found:', salonId);
            return;
        }

        console.log('Showing detail for:', salon.name);
        console.log('Salon data:', salon);
        
        // Switch to column mode
        const salonList = this.querySelector('#salonList');
        salonList.classList.add('column-mode');
        
        const detailContainer = this.querySelector('#salonDetail');
        const detailContent = this.querySelector('#detailContent');

        // Get data
        const location = salon.branches && salon.branches.length > 0 
            ? salon.branches[0].location 
            : salon.location || 'Байршил тодорхойгүй';
        
        const schedule = salon.branches && salon.branches.length > 0
            ? salon.branches[0].schedule
            : salon.schedule || 'Цагийн хуваарь байхгүй';

        const serviceTypes = salon.service?.map(s => s.type) || [];
        const branches = salon.branches || [];
        const artists = salon.artists || [];

        console.log('Branches to pass:', branches);
        console.log('Artists to pass:', artists);

        // Create maximum view with all data
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
                branches='${JSON.stringify(branches)}'
                artists='${JSON.stringify(artists)}'>
            </salon-description>
        `;

        // Show detail panel
        detailContainer.classList.add('active');
    }

    hideDetail() {
        console.log('Hiding detail...');
        
        const salonList = this.querySelector('#salonList');
        const detailContainer = this.querySelector('#salonDetail');

        // Remove column mode - back to wrap
        salonList.classList.remove('column-mode');

        // Hide detail panel
        detailContainer.classList.remove('active');
    }

    disconnectedCallback() {
        // Cleanup if needed
    }
}

customElements.define('salon-all-list', SalonAllList);