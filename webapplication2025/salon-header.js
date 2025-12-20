export class SalonHeader extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
        <div class="header">
		<p id="paragraph-one">Гоо Сайхныг </p>
		<p id="paragraph-two">Мэдэр</p>
		<div class="logo">
			<img src="./IMG/logo/woman.png" class="logo-element" alt="woman">
        	<img src="./IMG/logo/eyelash.png" class="logo-element" alt="eyelash">
			<img src="./IMG/logo/hair.png" class="logo-element" alt="hair">
			<img src="./IMG/logo/manicure.png" class="logo-element" alt="manicure">
			<img src="./IMG/logo/hand.png" class="logo-element" alt="hand">
			<img src="./IMG/logo/pedicure.png" class="logo-element" alt="pedicure">
			<img src="./IMG/logo/makeup.png" class="logo-element" alt="makeup">
		</div>
        </div>
        `
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

window.customElements.define('salon-header', SalonHeader);