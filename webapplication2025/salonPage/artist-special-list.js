// salonPage/artist-special-list.js

class ArtistSpecialList extends HTMLElement {
    constructor() {
        super();
        this.salons = [];
        this.independentArtists = [];
        this.specialIndependentArtists = []; // ✅ Зөвхөн independent
    }

    async connectedCallback() {
        await this.loadArtists();
        this.render();
        this.attachEvents();
    }

    async loadArtists() {
        try {
            const response = await fetch('http://localhost:3000/api/salons');
            const data = await response.json();
            this.salons = data.salons || [];
            
            const independentSalon = this.salons.find(s => s.id === 'independent');
            if (independentSalon && independentSalon.artists) {
                this.independentArtists = independentSalon.artists;
                
                this.independentArtists.forEach(artist => {
                    artist.type = 'independent';
                    artist.salon_name = 'Бие даасан';
                    artist.salon_location = artist.location;
                    
                    if (artist.date && artist.date.length > 0) {
                        artist.schedule = `${artist.date.join(', ')}`;
                    } else {
                        artist.schedule = 'Цагийн хуваарь байхгүй';
                    }
                });
            }
            this.specialIndependentArtists = this.independentArtists.filter(
                artist => artist.special === "True"
            );
            
            console.log('Independent Artists:', this.independentArtists);
            console.log('Special Independent Artists:', this.specialIndependentArtists);
            
        } catch (error) {
            console.error('Артистын өгөгдөл татахад алдаа:', error);
            this.independentArtists = [];
            this.specialIndependentArtists = [];
        }
    }

    render() {
        this.innerHTML = /*html*/`
            <section class="artist-special-list">
                <h2>Онцлох Бие Даасан Артист</h2>
                <div class="artistsections">
                    <button class="snav prev" aria-label="Өмнөх">‹</button>
                    <div class="artistsection">
                        ${this.specialIndependentArtists.map(artist => {
                            const location = artist.salon_location || artist.location || 'Байршил тодорхойгүй';
                            const schedule = artist.schedule || 'Цагийн хуваарь байхгүй';
                            const experience = artist.experience || '';
                            const img = artist.img || 'https://picsum.photos/300/300';
                            
                            return `
                                <artist-description 
                                    type="special" 
                                    data="${artist.artist_id || artist.id}"
                                    artistType="independent"
                                    name="${artist.name}"
                                    img="${img}"
                                    rating="${artist.rating}"
                                    profession="${artist.profession}"
                                    location="${location}"
                                    schedule="${schedule}"
                                    experience="${experience}">
                                </artist-description>
                            `;
                        }).join('')}
                    </div>
                    <button class="snav next" aria-label="Дараах">›</button>
                </div>
            </section>
            <dialog id="ArtistDetailInfo"></dialog>
        `;
    }

    attachEvents() {
        this.querySelectorAll('artist-description[type="special"]').forEach(a => {
            a.addEventListener('click', () => {
                const dlg = this.querySelector("#ArtistDetailInfo");
                const artistId = a.getAttribute("data");
                
                const artist = this.independentArtists.find(
                    art => art.artist_id === artistId || art.id === artistId
                );
                
                if (artist) {
                    const location = artist.salon_location || artist.location || 'Байршил тодорхойгүй';
                    const schedule = artist.schedule || 'Цагийн хуваарь байхгүй';
                    const experience = artist.experience || 'Туршлага тодорхойгүй';
                    const img = artist.img || 'https://picsum.photos/300/300';
                    
                    let artImg = [];
                    if (artist.art_pic && Array.isArray(artist.art_pic)) {
                        artImg = artist.art_pic.map(pic => {
                            if (typeof pic === 'object' && pic.img) {
                                return pic.img;
                            } else if (typeof pic === 'string') {
                                return pic;
                            }
                            return pic;
                        });
                    }
                    
                    dlg.innerHTML = `
                        <artist-description 
                            type="medium" 
                            data="${artist.artist_id || artist.id}"
                            name="${artist.name}"
                            img="${img}"
                            rating="${artist.rating}"
                            profession="${artist.profession}"
                            experience="${experience}"
                            location="${location}"
                            schedule="${schedule}"
                            artImg='${JSON.stringify(artImg)}'>
                        </artist-description>
                    `;
                    dlg.showModal();
                }
            });
        });

        const artistScroll = this.querySelector(".artistsection");
        const nextBtn = this.querySelector(".next");
        const prevBtn = this.querySelector(".prev");

        if (nextBtn && prevBtn && artistScroll) {
            nextBtn.addEventListener("click", () => {
                artistScroll.scrollBy({ left: 300, behavior: "smooth" });
            });

            prevBtn.addEventListener("click", () => {
                artistScroll.scrollBy({ left: -300, behavior: "smooth" });
            });
        }

        const dialog = this.querySelector("#ArtistDetailInfo");
        if (dialog) {
            dialog.addEventListener('click', (e) => {
                const rect = dialog.getBoundingClientRect();
                if (
                    e.clientX < rect.left ||
                    e.clientX > rect.right ||
                    e.clientY < rect.top ||
                    e.clientY > rect.bottom
                ) {
                    dialog.close();
                }
            });
        }
    }

    disconnectedCallback() {
    }
}

customElements.define('artist-special-list', ArtistSpecialList);