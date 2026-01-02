import { salonService } from '../salon-service.js';
class SalonSpecialList extends HTMLElement {
    constructor() {
        super();
        this.salons = [];
        this.specialSalons = [];
    }

    async connectedCallback() {
        await this.loadSalons();
        this.render();
        this.attachEvents();
    }

    async loadSalons() {
        try {
            await salonService.fetchData();
            this.salons = salonService.getSalons();
            this.specialSalons = salonService.getSpecialSalons();  
        } catch (error) {
            console.error('Салоны өгөгдөл татахад алдаа:', error);
            this.salons = [];
            this.specialSalons = [];
        }
    }

    render() {
        this.innerHTML = /*html*/`
            <section class="salon-special-list">
                <h2>Онцлох салон</h2>
                <div class="salonsections">
                    <button class="snav prev" aria-label="Өмнөх">‹</button>
                    <div class="salonsection">
                        ${this.specialSalons.map(salon => {
                            const location = salon.branches && salon.branches.length > 0 
                                ? salon.branches[0].location 
                                : salon.location || 'Байршил тодорхойгүй';
                            
                            const schedule = salon.branches && salon.branches.length > 0
                                ? salon.branches[0].schedule
                                : salon.schedule || 'Цагийн хуваарь байхгүй';

                            return `
                                <salon-description 
                                    type="special" 
                                    data="${salon.id}"
                                    name="${salon.name}"
                                    img="${salon.img}"
                                    rating="${salon.rating}"
                                    location="${location}"
                                    schedule="${schedule}">
                                </salon-description>
                            `;
                        }).join('')}
                    </div>
                    <button class="snav next" aria-label="Дараах">›</button>
                </div>
            </section>
            <dialog id="detailInfo"></dialog>
        `;
    }

    attachEvents() {
        this.querySelectorAll('salon-description[type="special"]').forEach(s => {
            s.addEventListener('click', () => {
                const dlg = this.querySelector("#detailInfo");
                const salonId = s.getAttribute("data");
                const salon = salonService.getSalonById(salonId);
                
                if (salon) {
                    const location = salon.branches && salon.branches.length > 0 
                        ? salon.branches[0].location 
                        : salon.location || 'Байршил тодорхойгүй';
                    
                    const schedule = salon.branches && salon.branches.length > 0
                        ? salon.branches[0].schedule
                        : salon.schedule || 'Цагийн хуваарь байхгүй';

                    const serviceTypes = salon.service?.map(s => s.type) || [];
                    const creativeImages = salon.creative || [];
                    dlg.innerHTML = `<salon-description 
                        type="detailed" 
                        data="${salon.id}"
                        name="${salon.name}"
                        img="${salon.img}"
                        rating="${salon.rating}"
                        location="${location}"
                        schedule="${schedule}"
                        description="${salon.description || ''}"
                        mission="${salon.mission || ''}"
                        services='${JSON.stringify(serviceTypes)}'
                        creative='${JSON.stringify(creativeImages)}'>
                        </salon-description>`;
                    dlg.showModal();
                }
            });
        });

        const salonScroll = this.querySelector(".salonsection");
        const nextBtn = this.querySelector(".next");
        const prevBtn = this.querySelector(".prev");

        if (nextBtn && prevBtn && salonScroll) {
            nextBtn.addEventListener("click", () => {
                salonScroll.scrollBy({ left: 300, behavior: "smooth" });
            });

            prevBtn.addEventListener("click", () => {
                salonScroll.scrollBy({ left: -300, behavior: "smooth" });
            });
        }

        const dialog = this.querySelector("#detailInfo");
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

customElements.define('salon-special-list', SalonSpecialList);