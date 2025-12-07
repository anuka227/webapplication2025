class OrderOuter extends HTMLElement {
    constructor() {
        super();
        //implementation
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
        <section>
            <h2>Захиалга</h2>
			<div class="Orders" >
				<order-inner 
  					service="Үйлчилгээ" 
  					svgpath='&lt;path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/&gt;'>
					<order-service></order-service>
				</order-inner>
				<order-inner 
  					service="Байршил" 
  					svgpath='&lt;path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;&lt;path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;'>
					<order-location></order-location>
				</order-inner>
    			<order-inner 
    				service="Огноо" 
    				svgpath='&lt;path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M7 4V2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M17 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/&gt;'>
					<order-date></order-date>
				</order-inner>
				<order-inner 
  					service="Цаг" 
  					svgpath='&lt;path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#0F0F0F"/&gt;
  							&lt;path d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z" fill="#0F0F0F"/&gt;'>
					<order-time></order-time>
				</order-inner>
				<button class="search">Search</button>
            </div>
        </section>
        `
    }

	orderDefault() {
		this.innerHTML = /*html*/`
        <section>
            <h2>Захиалга</h2>
			<div class="Orders" >
				<order-inner 
  					service="Үйлчилгээ" 
  					svgpath='&lt;path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/&gt;'>
					<order-service></order-service>
				</order-inner>
				<order-inner 
  					service="Байршил" 
  					svgpath='&lt;path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;&lt;path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;'>
					<order-location></order-location>
				</order-inner>
    			<order-inner 
    				service="Огноо" 
    				svgpath='&lt;path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M7 4V2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M17 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/&gt;'>
					<order-date></order-date>
				</order-inner>
				<order-inner 
  					service="Цаг" 
  					svgpath='&lt;path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#0F0F0F"/&gt;
  							&lt;path d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z" fill="#0F0F0F"/&gt;'>
					<order-time></order-time>
				</order-inner>
				<button class="search">Search</button>
            </div>
        </section>
        `
	}


	orderDetailed() {
		this.innerHTML = `
		
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

window.customElements.define('order-outer', OrderOuter);