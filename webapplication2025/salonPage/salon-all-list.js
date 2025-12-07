class SalonAllList extends HTMLElement {
    constructor() {
        super();
        this.salons = [];
        this.independentArtists = [];
        this.currentFilter = 'all';
    }

    async connectedCallback() {
        await this.loadSalons();
        this.renderTabs(); 
        this.render();
        this.attachEvents();
    }

    async loadSalons() {
        try {
            const response = await fetch('./salonPage/json/salon.json');
            const data = await response.json();
            
            this.salons = data.salons.filter(salon => salon.id !== 'independent');
            
            const independentData = data.salons.find(salon => salon.id === 'independent');
            this.independentArtists = independentData ? independentData.artists : [];
            
        } catch (error) {
            console.error('Салон ачаалахад алдаа гарлаа:', error);
            this.salons = [];
            this.independentArtists = [];
        }
    }

    renderTabs() {
        const tabsContainer = document.querySelector('#salonTabs');
        if (tabsContainer) {
            tabsContainer.innerHTML = `
                <button class="tab active" data-tab="all">Бүгд</button>
                <button class="tab" data-tab="salons">Салон</button>
                <button class="tab" data-tab="artists">Бие даасан артист</button>
            `;
        }
    }

    render() {
        this.innerHTML = /*html*/`
            <div class="salon-content-wrapper">
                <div class="salon-list" id="salonList">
                    ${this.renderItems('all')}
                </div>
                <div class="salon-detail" id="salonDetail">
                    <div id="detailContent"></div>
                </div>
            </div>
        `;
        
        console.log('Render complete');
    }

    renderItems(filter) {
        let html = '';
        
        if (filter === 'all' || filter === 'salons') {
            html += this.salons.map(salon => {
                return `
                    <salon-description 
                        type="minimum" 
                        data-type="salon"
                        data="${salon.id}"
                        name="${salon.name}"
                        img="${salon.img}"
                        rating="${salon.rating}">
                    </salon-description>
                `;
            }).join('');
        }
        
        if (filter === 'all' || filter === 'artists') {
            html += this.independentArtists.map(artist => {
                return `
                    <salon-description 
                        type="minimum" 
                        data-type="artist"
                        data="${artist.id}"
                        name="${artist.name}"
                        img="${artist.img}"
                        rating="${artist.rating}"
                        profession="${artist.profession}">
                    </salon-description>
                `;
            }).join('');
        }
        
        return html;
    }

    attachEvents() {
        // Tab button-уудын event (HTML дээрх #salonTabs дотор)
        document.querySelectorAll('#salonTabs .tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        this.attachItemEvents();
    }

    attachItemEvents() {
        this.querySelectorAll('salon-description[type="minimum"]').forEach(card => {
            const article = card.querySelector('article');
            if (article) {
                article.addEventListener('click', () => {
                    const cardType = card.getAttribute('data-type');
                    console.log('Clicked:', card.getAttribute('name'), 'Type:', cardType);
                    
                    if (cardType === 'salon') {
                        this.showSalonDetail(card);
                    } else if (cardType === 'artist') {
                        this.showArtistDetail(card);
                    }
                });
            }
        });
    }

    switchTab(tab) {
        this.currentFilter = tab;
        
        // Tab button-уудын active class шинэчлэх
        document.querySelectorAll('#salonTabs .tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        const salonList = this.querySelector('#salonList');
        salonList.innerHTML = this.renderItems(tab);
        this.attachItemEvents();
    }

    showSalonDetail(salonCard) {
        const salonId = salonCard.getAttribute("data");
        const salon = this.salons.find(sal => sal.id === salonId);
        
        if (!salon) return;

        console.log('Showing salon detail for:', salon.name);
        
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

    showArtistDetail(artistCard) {
        const artistId = artistCard.getAttribute("data");
        const artist = this.independentArtists.find(art => art.id === artistId);
        
        if (!artist) return;

        console.log('Showing artist detail for:', artist.name);
        
        const salonList = this.querySelector('#salonList');
        salonList.classList.add('column-mode');
        
        const detailContainer = this.querySelector('#salonDetail');
        const detailContent = this.querySelector('#detailContent');

        const services = artist.service || [];
        const artPics = artist.art_pic || [];
        
        detailContent.innerHTML = `
            <salon-description 
                type="maximum" 
                data="${artist.id}"
                name="${artist.name}"
                img="${artist.img}"
                rating="${artist.rating}"
                location="${artist.location}"
                schedule="${artist.schedule}"
                profession="${artist.profession}"
                experience="${artist.experience}"
                fullservices='${this.escapeJSON(JSON.stringify(services))}'
                creative='${this.escapeJSON(JSON.stringify(artPics))}'>
            </salon-description>
        `;
        
        detailContainer.classList.add('active');
        
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