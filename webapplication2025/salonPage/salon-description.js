class SalonDescription extends HTMLElement {
    constructor() {
        super();
        //implementation
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

        switch (this.type) {
            case "special":
                console.log("SPECIAL");
                this.specialSalon();
                break;
            case "maximum":
                console.log("MAX");
                this.salonMaximum();
                break;
            default:
                console.log("MIN");
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
            <div class="salonInfo" style="display:none;">
                ${this.originalContent}
            </div>
        `;
        console.log("/SPECIAL");
    }

    salonMinimum() {
        
    }

    salonDetailed() {
        this.innerHTML = /*html*/ `
        <div class="salonMedium">
        <div class="head">
            <h5>${this.salonName}</h5>
            <svg class="close-btn" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="currentColor"/>
            </svg>
        </div>
        <div class="descriptionMain">
            <h5>Байршил</h5>
            <p>${this.location}</p>
            <h5>Цагийн хуваарь</h5>
            <p>${this.schedule}</p>
            <ul class="salonService">
                <li>Lash</li>
			    <li>Make Up</li>
				<li>Tattoo</li>
				<li>Wax</li>
				<li>Manicure</li>
				<li>Pedicure</li>
            </ul>
            <div class="creative">
                <img src="../salon-images/creative/Sodon salon/salon-sale.jpg" alt="sale">
				<img src="../salon-images/creative/Sodon salon/lash-3D.jpg" alt="lash-3D">
				<img src="../salon-images/creative/Sodon salon/manicure-red.jpg" alt="lash-3D">
            </div>
            </div>`;
            console.log("/MIN");

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
					<h3>Салбар 1</h3><br>
					<h4>Хаяг</h4>
                    <p>${this.location}</p>
					Цагийн хуваарь: Бүх өдөр 10:00-19:00 <br>
					Холбогдох утасны дугаар: 80808080 <br>
					<strong>Салбар 2 </strong><br>
					Хаяг: БЗД 9-р хороо 130-р байр 2 тоот<br>
					Цагийн хуваарь: Бүх өдөр 10:00-19:00 <br>
					Холбогдох утасны дугаар: 80808080 <br> 
				</address>
			</article>
			<ul>
    			<li>Pedicure - 45,000₮ (40min)<button>Book</button></li>
    			<li>Manicure - 60,000₮<button>Book</button></li>
    			<li>Wax - 30,000₮ <button>Book</button></li>
				<li>Uschin - 30,000₮ <button>Book</button></li>
				<li>Make up - 30,000₮<button>Book</button></li>
				
			</ul>
			<section>
				<h2>Artist</h2>
				<div class="artist">
					<div>
						<img src="../artist-images/Jiji.jpg">
            			<h3>Manicurist</h3>
            			<p>Х. Хулан</p>
            			
					</div>
				
					<div>
           				<img src="../artist-images/make-upartist.webp">
            			<h3>Make up artist</h3>
          		    	<p>Б. Гүнж</p>
            			
					</div>
					<div>
            			<img src="../artist-images/Miss.jpg">
            			<h3>Hairdresser</h3>
           				<p>Ж. Хүслэн</p>
            		
					</div>

					<div>
            			<img src="../artist-images/Urnaa.webp">
            			<h3>Spa therapist</h3>
            			<p>С. Даваагийн</p>
            			
					</div>
			</section>
		</div>`;
        console.log("/MAX");
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