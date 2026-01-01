// salonPage/salon-all-list.js

class SalonAllList extends HTMLElement {
    constructor() {
        super();
        this.salons = [];
        this.independentArtists = [];
        this.currentFilter = 'all';
        this.searchQuery = ''; 
    }

    async connectedCallback() {
        await this.loadSalons();
        this.renderTabs();
        this.render();
        this.attachEvents();
        this.attachSearchEvent();
        
        // ✅ Сонгосон салон шалгах
        this.checkSelectedSalon();
    }

    async loadSalons() {
        try {
            const response = await fetch('http://localhost:3000/api/salons');
            const data = await response.json();
            
            this.salons = data.salons.filter(salon => salon.id !== 'independent');
            
            const independentData = data.salons.find(salon => salon.id === 'independent');
            this.independentArtists = independentData ? independentData.artists : [];
            
        } catch (error) {
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
    }

    renderItems(filter) {
        let items = [];
        
        if (filter === 'all' || filter === 'salons') {
            items = [...items, ...this.salons.map(salon => ({
                ...salon,
                type: 'salon'
            }))];
        }
        
        if (filter === 'all' || filter === 'artists') {
            items = [...items, ...this.independentArtists.map(artist => ({
                ...artist,
                type: 'artist'
            }))];
        }
        
        if (this.searchQuery) {
            items = items.filter(item => {
                const name = item.name?.toLowerCase() || '';
                const profession = item.profession?.toLowerCase() || '';
                const location = item.location?.toLowerCase() || '';
                const query = this.searchQuery.toLowerCase();
                
                return name.includes(query) || 
                       profession.includes(query) || 
                       location.includes(query);
            });
        }
        
        if (items.length === 0) {
            return '<div class="no-results"><p>Илэрц олдсонгүй</p></div>';
        }
        
        return items.map(item => {
            if (item.type === 'salon') {
                return `
                    <salon-description 
                        type="minimum" 
                        data-type="salon"
                        data="${item.id}"
                        name="${item.name}"
                        img="${item.img}"
                        rating="${item.rating}">
                    </salon-description>
                `;
            } else {
                return `
                    <salon-description 
                        type="minimum" 
                        data-type="artist"
                        data="${item.id}"
                        name="${item.name}"
                        img="${item.img}"
                        rating="${item.rating}"
                        profession="${item.profession}">
                    </salon-description>
                `;
            }
        }).join('');
    }

    attachSearchEvent() {
        const searchInput = document.querySelector('.searchbar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.updateList();
            });
        }
    }

    updateList() {
        const salonList = this.querySelector('#salonList');
        if (salonList) {
            salonList.innerHTML = this.renderItems(this.currentFilter);
            this.attachItemEvents();
        }
    }

    attachEvents() {
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
        
        document.querySelectorAll('#salonTabs .tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        this.hideDetail();
        this.updateList();
    }

    // ✅ ШИНЭ МЕТОД: SessionStorage-с сонгосон салон шалгах
    checkSelectedSalon() {
        const selectedSalonId = sessionStorage.getItem('selectedSalonId');
        const selectedType = sessionStorage.getItem('selectedSalonType');
        
        if (selectedSalonId) {
            console.log('📌 Auto-selecting salon:', selectedSalonId, 'Type:', selectedType);
            
            // sessionStorage цэвэрлэх
            sessionStorage.removeItem('selectedSalonId');
            sessionStorage.removeItem('selectedSalonType');
            
            // Delay-тай maximum харуулах
            setTimeout(() => {
                if (selectedType === 'salon') {
                    this.showSalonDetailById(selectedSalonId);
                } else if (selectedType === 'artist') {
                    this.showArtistDetailById(selectedSalonId);
                }
            }, 300);
        }
    }

    // ✅ ШИНЭ МЕТОД: ID-гаар салон харуулах
    showSalonDetailById(salonId) {
        const salon = this.salons.find(sal => sal.id === salonId);
        
        if (!salon) {
            console.error('Salon not found:', salonId);
            return;
        }
        
        const salonList = this.querySelector('#salonList');
        salonList.classList.add('column-mode');
        
        const detailContainer = this.querySelector('#salonDetail');
        const detailContent = this.querySelector('#detailContent');

        const location = salon.branches?.[0]?.location || salon.location || '?';
        const schedule = salon.branches?.[0]?.schedule || salon.schedule || '?';

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
        
        // Буцах button
        setTimeout(() => {
            const infoHeader = detailContent.querySelector('.information-header');
            if (infoHeader && !infoHeader.querySelector('.back-btn')) {
                const backBtn = document.createElement('button');
                backBtn.className = 'back-btn';
                backBtn.textContent = 'Буцах';
                backBtn.addEventListener('click', () => this.hideDetail());
                infoHeader.insertBefore(backBtn, infoHeader.firstChild);
            }
        }, 50);
    }

    // ✅ ШИНЭ МЕТОД: ID-гаар артист харуулах
    showArtistDetailById(artistId) {
        const artist = this.independentArtists.find(art => art.id === artistId);
        
        if (!artist) {
            console.error('Artist not found:', artistId);
            return;
        }
        
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
            const infoHeader = detailContent.querySelector('.information-header');
            if (infoHeader && !infoHeader.querySelector('.back-btn')) {
                const backBtn = document.createElement('button');
                backBtn.className = 'back-btn';
                backBtn.textContent = 'Буцах';
                backBtn.addEventListener('click', () => this.hideDetail());
                infoHeader.insertBefore(backBtn, infoHeader.firstChild);
            }
        }, 50);
    }

    showSalonDetail(salonCard) {
        const salonId = salonCard.getAttribute("data");
        this.showSalonDetailById(salonId);
    }

    showArtistDetail(artistCard) {
        const artistId = artistCard.getAttribute("data");
        this.showArtistDetailById(artistId);
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