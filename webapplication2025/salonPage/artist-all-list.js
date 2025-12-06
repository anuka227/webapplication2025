class ArtistSpecialList extends HTMLElement {
    constructor() {
        super();
        this.salons = [];
        this.independentArtists = [];
        this.artists = [];
        this.specialArtists = [];
    }
    async connectedCallback() {
        await this.loadArtists();
        this.render();
        this.attachEvents();
    }

    async loadArtists() {
        try {
            const response = await fetch('./salonPage/json/salon.json');
            const data = await response.json();
            this.salons = data.salons || [];

            this.salons.forEach(salon => {
                if (salon.artists && Array.isArray(salon.artists)) {
                    salon.artists.forEach(artist => {
                        // Салоны мэдээллийг артист дээр нэмж өгөх
                        artist.salon_name = salon.name;
                        artist.salon_id = salon.id;
                        artist.type = 'salon'; // Салоны артист гэдгийг тэмдэглэх
                        
                        // Салбарын мэдээлэл олох
                        if (artist.branch_id && salon.branches) {
                            const branch = salon.branches.find(b => b.branch_id === artist.branch_id);
                            if (branch) {
                                artist.salon_location = branch.location;
                                artist.schedule = branch.schedule;
                            }
                        }
                        
                        this.artists.push(artist);
                    });
                }
            });
            
            // Independent артистуудыг нэмэх
            this.independentArtists.forEach(artist => {
                artist.type = 'independent'; // Independent артист гэдгийг тэмдэглэх
                artist.salon_name = 'Бие даасан'; // Салоны нэр байхгүй
                artist.salon_location = artist.location; // location шууд байна
                // schedule нь date + hours-аас үүсгэх
                if (artist.date && artist.date.length > 0) {
                    artist.schedule = `${artist.date.join(', ')}`;
                }
                this.artists.push(artist);
            });
            
            // Special артистуудыг шүүх (салон болон independent хоёуланд байна)
            this.specialArtists = this.artists.filter(artist => artist.special === "True");
            
            console.log('All Artists:', this.artists);
            console.log('Special Artists:', this.specialArtists);
            
        } catch (error) {
            console.error('Артистын өгөгдөл татахад алдаа:', error);
            this.artists = [];
            this.specialArtists = [];
        }
    }

    render() {
        this.innerHTML = /*html*/`
            <section class="artist-special-list">
                <h2>Онцлох Артист</h2>
                <div class="artistsections">
                    <button class="snav prev" aria-label="Өмнөх">‹</button>
                    <div class="artistsection">
                        ${this.specialArtists.map(artist => {
                            const location = artist.salon_location || artist.location || 'Байршил тодорхойгүй';
                            const schedule = artist.schedule || 'Цагийн хуваарь байхгүй';
                            const experience = artist.experience || '';
                            const img = artist.img || 'https://picsum.photos/300/300';
                            
                            return `
                                <artist-description 
                                    type="special" 
                                    data="${artist.artist_id || artist.id}"
                                    artistType="${artist.type}"
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
                const artistType = a.getAttribute("artistType");
                
                let artist;
                if (artistType === 'independent') {
                    artist = this.independentArtists.find(art => art.artist_id === artistId || art.id === artistId);
                } else {
                    artist = this.artists.find(art => (art.id === artistId || art.artist_id === artistId));
                }
                
                if (artist) {
                    const location = artist.salon_location || artist.location || 'Байршил тодорхойгүй';
                    const schedule = artist.schedule || 'Цагийн хуваарь байхгүй';
                    const experience = artist.experience || 'Туршлага тодорхойгүй';
                    const img = artist.img || 'https://picsum.photos/300/300';
                    
                    let artImg = [];
                    
                    if (artist.type === 'independent') {
                        // Independent артистын зургууд
                        if (artist.art_pic && Array.isArray(artist.art_pic)) {
                            artImg = artist.art_pic.map(pic => {
                                // art_pic нь {img: "...", alt: "..."} гэсэн format байна
                                return pic.img || pic[Object.keys(pic)[0]];
                            });
                        }
                    } else {
                        // Салоны creative зургууд - салоныг олох
                        const salon = this.salons.find(s => s.id === artist.salon_id);
                        if (salon && salon.creative && Array.isArray(salon.creative)) {
                            artImg = salon.creative;
                        }
                    }
                    
                    dlg.innerHTML = `<artist-description 
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
                        </artist-description>`;
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