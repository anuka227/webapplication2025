(()=>{var te=(l=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(l,{get:(e,t)=>(typeof require<"u"?require:e)[t]}):l)(function(l){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+l+'" is not supported')});var fe=te("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");var f=class extends HTMLElement{static get observedAttributes(){return["message"]}constructor(){super(),this._message="\u041C\u044D\u0434\u044D\u0433\u0434\u044D\u043B"}connectedCallback(){this.render(),this.show()}attributeChangedCallback(e,t,s){e==="message"&&s&&(this._message=s,this.isConnected&&this.render())}render(){this.innerHTML=`
            <div class="salon-notification">
                <div class="notification-content">
                    <span class="notification-message">${this._message}</span>
                    <button class="notification-close" id="notifClose">\xD7</button>
                </div>
            </div>
            
            <style>
                .salon-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #ec407a 0%, #f06292 100%);
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(236, 64, 122, 0.4);
                    z-index: 99999;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 15px;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideIn 0.3s ease-out;
                    pointer-events: auto;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .notification-message {
                    flex: 1;
                    font-weight: 500;
                }
                
                .notification-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 22px;
                    cursor: pointer;
                    padding: 0;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s;
                    flex-shrink: 0;
                }
                
                .notification-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                }
                
                .salon-notification.closing {
                    animation: slideOut 0.3s ease-out;
                }
                
                /* Mobile */
                @media (max-width: 768px) {
                    .salon-notification {
                        left: 10px;
                        right: 10px;
                        top: 10px;
                        min-width: auto;
                        padding: 14px 20px;
                    }
                    
                    .notification-message {
                        font-size: 14px;
                    }
                    
                    .notification-close {
                        width: 24px;
                        height: 24px;
                        font-size: 20px;
                    }
                }
            </style>
        `;let e=this.querySelector("#notifClose");e&&e.addEventListener("click",()=>this.close())}show(){setTimeout(()=>{this.close()},3e3)}close(){let e=this.querySelector(".salon-notification");e&&e.classList.add("closing"),setTimeout(()=>{this.remove()},300)}};customElements.define("salon-notification",f);function p(l){let e=document.querySelector("salon-notification");e&&e.remove();let t=document.createElement("salon-notification");t.setAttribute("message",l),document.body.appendChild(t)}var w=class{constructor(){this.orderData={service:null,location:null,date:null,time:null}}updateService(e){this.orderData.service=e}updateLocation(e){this.orderData.location=e}updateDate(e){this.orderData.date=e}updateTime(e){this.orderData.time=e,typeof e=="string"&&e.length>0?(this.filters.time=e,this.applyFilters()):console.error("Invalid time:",e)}isComplete(){return this.orderData.service&&this.orderData.location&&this.orderData.date&&this.orderData.time}getData(){return this.orderData}reset(){this.orderData={service:null,location:null,date:null,time:null}}};window.orderManager||(window.orderManager=new w);var y=class extends HTMLElement{constructor(){super()}connectedCallback(){let e=this.getAttribute("service")||"",t=this.getAttribute("svgpath")||"",s=this.innerHTML;this.innerHTML=`
            <button class="toggle-btn">
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    ${t}
                </svg> 
                <p>${e}</p>
            </button>
            <div class="hidden-content">
                ${s}
            </div>
        `;let o=this.querySelector(".toggle-btn"),i=this.querySelector(".hidden-content");o.addEventListener("click",n=>{n.stopPropagation(),document.querySelectorAll("order-inner .hidden-content.show").forEach(a=>{a!==i&&a.classList.remove("show")}),document.querySelectorAll("order-inner .map-container").forEach(a=>{this.contains(a)||(a.style.display="none")}),i.classList.toggle("show")}),document.addEventListener("click",n=>{this.contains(n.target)||i.classList.remove("show")})}};customElements.define("order-inner",y);var k=class{static calculateDistance(e,t,s,o){let n=this.toRad(s-e),a=this.toRad(o-t),r=Math.sin(n/2)*Math.sin(n/2)+Math.cos(this.toRad(e))*Math.cos(this.toRad(s))*Math.sin(a/2)*Math.sin(a/2);return 6371*(2*Math.atan2(Math.sqrt(r),Math.sqrt(1-r)))}static toRad(e){return e*(Math.PI/180)}};window.DistanceCalculator=k;var v=class{constructor(e){this.allData=e.salons}filterByLocation(e,t,s=2){let o=t.coordinates;return e.map(i=>{if(i.id==="independent"){let n=i.artists.filter(a=>{if(!a.coordinates)return!1;let r=window.DistanceCalculator.calculateDistance(o.lat,o.lng,a.coordinates.lat,a.coordinates.lng);return a.distance=r,r<=s});return{...i,artists:n}}else{if(!i.coordinates)return null;let n=window.DistanceCalculator.calculateDistance(o.lat,o.lng,i.coordinates.lat,i.coordinates.lng);return n<=s?{...i,distance:n}:null}}).filter(i=>i?i.id==="independent"?i.artists.length>0:!0:!1)}filterByService(e,t){return!t||t==="\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D"?e:e.map(s=>{if(s.id==="independent"){let o=s.artists.filter(i=>i.service?i.service.some(a=>a.subservice?a.subservice.some(r=>{let c=r.id===t;return c}):!1):!1);return{...s,artists:o}}else return s.service&&s.service.some(i=>i.subservice?i.subservice.some(n=>n.id===t):!1)?s:null}).filter(s=>s?s.id==="independent"?s.artists.length>0:!0:!1)}filterByDate(e,t){if(!t)return e;let o=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][t.getDay()];return e.map(i=>{if(i.id==="independent"){let n=i.artists.filter(a=>a.date&&a.date.includes(o));return{...i,artists:n}}else return i.date&&i.date.includes(o)?i:null}).filter(i=>i?i.id==="independent"?i.artists.length>0:!0:!1)}filterByTime(e,t){return e.map(s=>{if(s.id==="independent"){let o=s.artists.filter(i=>{let n=i.hours&&i.hours.includes(t);return i.hours&&console.log(`${i.name}: ${i.hours} \u2192 includes "${t}"? ${n}`),n});return{...s,artists:o}}else return s.time&&s.time.includes(t)?s:null}).filter(s=>s?s.id==="independent"?s.artists.length>0:!0:!1)}applyFilters(e){let t=JSON.parse(JSON.stringify(this.allData));return e.service&&(t=this.filterByService(t,e.service)),e.date&&(t=this.filterByDate(t,e.date)),e.time&&(t=this.filterByTime(t,e.time)),e.location&&(t=this.filterByLocation(t,e.location,e.maxDistance)),e.location&&e.location.coordinates&&t.sort((s,o)=>{let i=s.distance||(s.id==="independent"?999:0),n=o.distance||(o.id==="independent"?999:0);return i-n}),t}};window.SalonFilter=v;var S=class extends HTMLElement{constructor(){super(),this.salonFilter=null,this.salonsData=null}async connectedCallback(){this.name=this.getAttribute("name")||"nergui",await this.loadSalonData(),this.render(),this.setupEventListeners()}async loadSalonData(){let e=await fetch("http://localhost:3000/api/salons");this.salonsData=await e.json(),this.salonFilter=new v(this.salonsData)}render(){this.innerHTML=`
            <h2>\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430</h2>
			<div class="Orders" >
				<order-inner 
  					service="\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D" 
  					svgpath='&lt;path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/&gt;'>
					<order-service></order-service>
				</order-inner>
				<order-inner 
  					service="\u0411\u0430\u0439\u0440\u0448\u0438\u043B" 
  					svgpath='&lt;path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;&lt;path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/&gt;'>
					<order-location></order-location>
				</order-inner>
    			<order-inner 
    				service="\u041E\u0433\u043D\u043E\u043E" 
    				svgpath='&lt;path d="M14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C20.1752 21.4816 19.3001 21.7706 18 21.8985" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M7 4V2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M17 4V2.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/&gt;
    				&lt;path d="M21.5 9H16.625H10.75M2 9H5.875" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/&gt;'>
					<order-date></order-date>
				</order-inner>
				<order-inner 
  					service="\u0426\u0430\u0433" 
  					svgpath='&lt;path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z" fill="#0F0F0F"/&gt;
  							&lt;path d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z" fill="#0F0F0F"/&gt;'>
					<order-time></order-time>
				</order-inner>
				<button class="search">\u0425\u0430\u0439\u0445</button>
            </div>
            <div class="detailedContainer"></div>
        `}setupEventListeners(){this.querySelector(".search")?.addEventListener("click",()=>this.handleSearch()),document.addEventListener("click",t=>{t.target.classList.contains("subservice-book-btn")&&this.handleBookingClick(t)})}handleSearch(){let e=window.orderManager.getData(),t={location:e.location,maxDistance:2,service:e.service,date:e.date,time:e.time},s=this.salonFilter.applyFilters(t);this.showResults(s)}showResults(e){let t=this.querySelector(".detailedContainer");if(e.length===0){t.innerHTML=`
                <div class="no-results">
                    <p style="text-align:center;padding:40px;font-size:18px;">
                        \u0422\u0430\u043D\u044B \u0448\u04AF\u04AF\u043B\u0442\u044D\u0434 \u0442\u043E\u0445\u0438\u0440\u043E\u0445 \u0441\u0430\u043B\u043E\u043D \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439.
                    </p>
                </div>
            `;return}let s=e.filter(i=>i.id!=="independent"),o=e.find(i=>i.id==="independent")?.artists||[];t.innerHTML=`
            <div class="availableData">
                <div class="leftSalons">
                    <h2>\u0421\u0430\u043B\u043E\u043D (${s.length})</h2>
                    ${s.map(i=>this.renderSalonCard(i)).join("")}
                </div>
                <div class="rightArtist">
                    <h2>\u0411\u0438\u0435 \u0434\u0430\u0430\u0441\u0430\u043D \u0430\u0440\u0442\u0438\u0441\u0442 (${o.length})</h2>
                    ${o.map(i=>this.renderArtistCard(i)).join("")}
                </div>
            </div>
        `}renderSalonCard(e){let t=window.orderManager?.getData().service||null,s=[];e.service&&Array.isArray(e.service)&&e.service.forEach(i=>{i.subservice&&Array.isArray(i.subservice)&&i.subservice.forEach(n=>{(!t||n.id===t)&&s.push(n)})});let o=s.length>0?s.map(i=>`
                <li class="subservice-row">
                    <div class="subservice-left">
                        <p class="subservice-name">${i.name||i.id}</p>
                        <p class="subservice-duration">${i.duration||""}</p>
                    </div>
                    <div class="subservice-right">
                        <p class="subservice-price">${i.price}\u20AE</p>
                        <button class="subservice-book-btn">></button>
                    </div>
                </li>
            `).join(""):'<li class="no-service">\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D \u0431\u0430\u0439\u0445\u0433\u04AF\u0439</li>';return`
            <div class="salon-card">
                <div class="selected-information">
                    <img src="${e.img||"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500"}" 
                         alt="${e.name}">
                    <div class="info-text">
                        <div class="top">
                            <p class="name"><strong>${e.name||"\u0421\u0430\u043B\u043E\u043D"}</strong></p>
                            <p>${e.rating||"0.0"} (${e.reviews_count||0})</p>
                        </div>
                        <p>${e.location||""}</p>
                    </div>
                </div>
                <ul class="subservices-list">
                    ${o}
                </ul>
            </div>
        `}renderArtistCard(e){let t=window.orderManager?.getData().service||null,s=[];e.service&&Array.isArray(e.service)&&e.service.forEach(i=>{i.subservice&&Array.isArray(i.subservice)&&i.subservice.forEach(n=>{(!t||n.id===t)&&s.push(n)})});let o=s.length>0?s.map(i=>`
                <li class="subservice-row">
                    <div class="subservice-left">
                        <p class="subservice-name">${i.name||i.id}</p>
                        <p class="subservice-duration">${i.duration||""}</p>
                    </div>
                    <div class="subservice-right">
                        <p class="subservice-price">${i.price}\u20AE</p>
                        <button class="subservice-book-btn">></button>
                    </div>
                </li>
            `).join(""):'<li class="no-service">\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D \u0431\u0430\u0439\u0445\u0433\u04AF\u0439</li>';return`
            <div class="artist-card">
                <div class="selected-information">
                    <img src="${e.img||"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500"}" 
                         alt="${e.name}">
                    <div class="info-text">
                        <div class="top">
                            <p><strong>${e.name||"\u0410\u0440\u0442\u0438\u0441\u0442"}</strong></p>
                            <p>${e.rating||"0.0"} (${e.reviews_count||0})</p>
                        </div>
                        <p>${e.location||""}</p>
                    </div>
                </div>
                <ul class="subservices-list">
                    ${o}
                </ul>
            </div>
        `}handleBookingClick(e){if(!window.BookingManager||!window.BookingManager.checkAuth()){window.BookingManager?window.BookingManager.showAuthPrompt():confirm("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0445\u0438\u0439\u0445\u0438\u0439\u043D \u0442\u0443\u043B\u0434 \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D \u04AF\u04AF")&&(window.location.hash="#/login");return}let t=window.orderManager?.getData();if(!t||!t.date){p("\u041E\u0433\u043D\u043E\u043E \u0431\u043E\u043B\u043E\u043D \u0446\u0430\u0433\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");let h=document.querySelector("order-date");h&&h.scrollIntoView({behavior:"smooth",block:"center"});return}if(!t.time){p("\u0426\u0430\u0433\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");let h=document.querySelector("order-time");h&&h.scrollIntoView({behavior:"smooth",block:"center"});return}let s=e.target.closest(".subservice-row"),o=e.target.closest(".salon-card, .artist-card");if(!s||!o)return;let i=s.querySelector(".subservice-name")?.textContent||"",n=s.querySelector(".subservice-duration")?.textContent||"",a=s.querySelector(".subservice-price")?.textContent.replace("\u20AE","")||"",c=o.querySelector(".name strong, .top p strong")?.textContent||"",d=null,g=null;if(o.classList.contains("salon-card")?d=this.salonsData.salons.find(h=>h.name===c):d=this.salonsData.salons.find(u=>u.id==="independent")?.artists.find(u=>u.name===c),d&&d.service&&d.service.forEach(h=>{h.subservice&&h.subservice.find(m=>m.name===i||m.id===i)&&(g=h.type)}),d){let h={service:i,category:g||"\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D",duration:n,price:a,date:new Date(t.date).toISOString(),dateFormatted:new Date(t.date).toLocaleDateString("mn-MN"),time:t.time,salon:c,salonId:d.id};window.BookingManager?window.BookingManager.saveBooking(h)&&(window.BookingManager.navigateToProfile(),setTimeout(()=>{window.BookingManager.showNotification("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0442\u0430\u043B\u0433\u0430\u0430\u0436\u0441\u0430\u043D","success")},400)):console.error("BookingManager not loaded")}else console.error("Salon/Artist not found:",c)}openBookingDialog(e){if(!window.BookingManager||!window.BookingManager.checkAuth()){window.BookingManager?window.BookingManager.showAuthPrompt():confirm("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0445\u0438\u0439\u0445\u0438\u0439\u043D \u0442\u0443\u043B\u0434 \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D \u04AF\u04AF?")&&(window.location.hash="#/login");return}let t=document.createElement("booking-dialog");t.setAttribute("service-name",e.serviceName),t.setAttribute("service-category",e.serviceCategory),t.setAttribute("service-duration",e.duration),t.setAttribute("service-price",e.price),t.setAttribute("salon-name",e.salonName),t.setAttribute("salon-id",e.salonId),t.setAttribute("available-dates",JSON.stringify(e.availableDates)),t.setAttribute("available-times",JSON.stringify(e.availableTimes)),document.body.appendChild(t)}};window.customElements.define("order-outer",S);var C=class extends HTMLElement{constructor(){super(),this.servicesData=null}async connectedCallback(){await this.loadServicesData(),this.render(),this.setupEventListeners()}async loadServicesData(){try{let t=await(await fetch("http://localhost:3000/api/salons")).json(),s=new Map;t.salons.forEach(i=>{i.id!=="independent"&&i.service&&Array.isArray(i.service)&&i.service.forEach(n=>{let a=n.type;s.has(a)||s.set(a,new Set),n.subservice&&Array.isArray(n.subservice)&&n.subservice.forEach(r=>{s.get(a).add(r.id)})})});let o=t.salons.find(i=>i.id==="independent");o&&o.artists&&o.artists.forEach(i=>{i.service&&Array.isArray(i.service)&&i.service.forEach(n=>{let a=n.type;s.has(a)||s.set(a,new Set),n.subservice&&Array.isArray(n.subservice)&&n.subservice.forEach(r=>{s.get(a).add(r.id)})})}),this.servicesData={},s.forEach((i,n)=>{this.servicesData[n]=Array.from(i)}),console.log("Services loaded:",this.servicesData)}catch(e){console.error("JSON \u0430\u0447\u0430\u0430\u043B\u0430\u0445 \u0430\u043B\u0434\u0430\u0430:",e)}}getSVGIcon(e){return{\u04AE\u0441:`<svg width="25px" height="25px" fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 30 29.893" xml:space="preserve" stroke="currentColor">
<g id="SVGRepo_bgCarrier" stroke-width="0"/>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
<g id="SVGRepo_iconCarrier"> <g id="hair-dryer"> <g> <path d="M29.807,27.973l0.004-0.005c-2.826-2.949-5.441-1.813-7.752-0.807c-1.651,0.721-3.213,1.402-4.92,0.749 c-0.871-0.33-1.423-0.809-1.645-1.419c-0.184-0.502-0.135-1.045-0.028-1.488l1.228,0.22c0.619,0.109,1.218-0.307,1.326-0.925 l1.508-8.447c3.688-0.714,6.474-3.955,6.474-7.851c0-4.419-3.582-8-8-8c-2.524,0-4.772,1.173-6.239,3H4v9h7.079 c0.565,0.977,1.34,1.813,2.25,2.474l-1.556,8.71c-0.11,0.618,0.306,1.216,0.925,1.326l1.081,0.191 c-0.15,0.686-0.201,1.527,0.099,2.362c0.394,1.104,1.287,1.931,2.647,2.451c2.365,0.899,4.412,0.006,6.218-0.78 c2.225-0.971,3.829-1.669,5.831,0.419l0.006-0.007c0.15,0.136,0.35,0.218,0.566,0.218c0.473,0,0.854-0.382,0.854-0.852 C30,28.309,29.928,28.121,29.807,27.973z M18,4c2.206,0,4,1.794,4,4c0,2.205-1.794,4-4,4s-4-1.795-4-4C14,5.794,15.794,4,18,4z"/> <circle cx="18" cy="8" r="2"/> <path d="M0,4.001v6.997C0,11.552,0.448,12,1.001,12H3V3H1.001C0.448,3,0,3.448,0,4.001z"/> </g> </g> <g id="Layer_1_1_"> </g> </g>
</svg>`,\u0425\u0443\u043C\u0441:`<svg fill="currentColor" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.063 511.063" xml:space="preserve">
								<g>
									<g>
										<g>
											<path d="M404.625,221.279c-4.378-40.286-16.375-82.577-47.343-128.708c3.371-6.613,3.132-14.507-1.084-21.129
												c-5.393-8.457-15.394-12.015-25.481-8.644c-2.227,0.725-3.806-0.418-4.378-0.939c-0.572-0.529-1.86-2.005-1.323-4.233l0.23-0.956
												c1.664-7.39-0.734-14.925-6.409-20.139c-5.854-5.402-14.174-7.253-21.709-4.898l-78.976,43.759L119.731,5.275
												c-9.182-5.367-19.874-6.682-30.08-3.746C79.437,4.481,71.108,11.3,66.201,20.72c-4.907,9.438-5.717,20.164-2.278,30.225
												c3.447,10.061,10.658,18.039,20.233,22.443l108.015,51.183l9.173,88.695l0.35,1.69c1.724,5.47,5.564,9.95,10.496,12.664
												c-22.75,19.081-36.019,47.095-36.019,77.201v112.375c0,51.755,42.112,93.867,93.867,93.867h85.333
												c51.755,0,93.867-42.112,93.867-93.867V304.821C449.237,271.131,432.555,240.138,404.625,221.279z M208.913,120.586
												l12.672-24.337l2.389-4.574l78.925-43.913c1.818-0.307,3.422,0.435,4.386,1.323c0.819,0.759,1.715,2.039,1.152,4.523
												c-1.843,7.697,0.538,15.488,6.374,20.838c5.837,5.342,13.815,7.049,21.871,4.352c2.961-0.99,4.565,0.947,5.12,1.818
												c0.555,0.87,1.621,3.149-0.922,5.82c-0.051,0.06-0.085,0.137-0.137,0.196c-0.009,0.008-0.026,0.008-0.034,0.026
												c-0.273,0.29-0.427,0.649-0.683,0.956c-0.981,1.186-1.929,2.381-2.62,3.703c-0.145,0.282-0.196,0.589-0.324,0.87
												c-0.674,1.417-1.271,2.867-1.604,4.386c-0.068,0.316-0.034,0.649-0.094,0.964c-0.256,1.519-0.461,3.038-0.384,4.599
												c0.026,0.521,0.213,1.041,0.282,1.562c0.162,1.331,0.282,2.662,0.7,3.985c0.009,0.034,0.034,0.06,0.051,0.102
												c0,0.017,0,0.034,0.009,0.051c0.239,0.759,0.683,1.391,0.998,2.108c0.461,1.033,0.845,2.108,1.442,3.038
												c0.521,0.794,1.229,1.434,1.843,2.142c0.614,0.717,1.135,1.51,1.852,2.133c0.947,0.828,2.082,1.459,3.191,2.125
												c0.546,0.333,1.007,0.768,1.596,1.058c1.766,0.862,3.695,1.519,5.76,1.937c3.055,0.623,3.49,3.098,3.533,4.147
												c0.051,1.033-0.171,3.533-3.703,4.582c-7.586,2.253-13.133,8.218-14.848,15.94c-0.435,1.929-0.597,3.866-0.503,5.76
												c0.282,5.709,2.884,11.128,7.654,15.352c1.681,1.502,1.681,3.132,1.374,4.275c-0.111,0.435-0.256,0.819-0.393,1.067
												c-0.469,0.922-1.946,2.987-5.495,2.125c-7.689-1.826-15.488,0.546-20.838,6.374c-5.35,5.837-7.049,13.807-4.361,21.879
												c0.981,2.953-0.947,4.557-1.818,5.12c-0.87,0.546-3.14,1.613-5.828-0.93c-1.434-1.357-3.004-2.492-4.676-3.396
												c-0.495-0.265-1.041-0.367-1.545-0.589c-3.499-1.544-7.287-2.091-11.145-1.604c-1.297,0.171-2.594,0.282-3.874,0.691
												c-5.393,1.698-9.643,5.333-12.288,10.274c-0.137,0.247-0.333,0.427-0.461,0.683c-0.87,1.775-1.527,3.712-1.954,5.794
												c-0.623,3.046-3.098,3.49-4.13,3.533c-1.05,0.094-3.541-0.179-4.591-3.721c-2.253-7.578-8.218-13.141-15.94-14.848h-0.043
												c-1.587-0.35-3.174-0.521-4.736-0.521c-0.196,0-0.384,0.051-0.589,0.06c-0.478,0.017-0.939,0.102-1.417,0.145
												c-1.323,0.128-2.611,0.367-3.874,0.734c-0.435,0.128-0.862,0.265-1.297,0.427c-1.451,0.529-2.833,1.212-4.156,2.057
												c-0.171,0.111-0.35,0.188-0.529,0.307c-1.468,1.007-2.867,2.142-4.096,3.533l-0.316,0.358l-0.811,0.606
												c-0.094,0.077-0.145,0.188-0.23,0.265c-1.041,0.614-2.15,0.606-2.995,0.41c-1.28-0.29-2.825-1.169-3.601-2.825L208.913,120.586z
												M432.171,417.196c0,42.351-34.458,76.8-76.8,76.8h-85.333c-42.342,0-76.8-34.449-76.8-76.8V304.821
												c0-23.031,9.344-44.604,25.6-60.254v16.631c-0.341,14.097-0.23,27.921-0.111,41.506c0.06,6.579,0.111,13.073,0.111,19.482v7.927
												c0,43.315,35.234,78.549,78.558,78.549h30.618c43.324,0,78.558-35.234,78.558-78.549v-7.927c0-7.927,0.111-15.906,0.23-23.927
												c0.23-16.606,0.461-33.357-0.23-50.398v-3.294c16.256,15.65,25.6,37.222,25.6,60.254V417.196z"/>
											<path d="M280.158,183.222c1.664,2.33,4.292,3.575,6.955,3.575c1.715,0,3.448-0.521,4.949-1.596
												c3.84-2.731,4.727-8.064,1.988-11.896l-33.033-46.242h60.22c4.71,0,8.533-3.814,8.533-8.533s-3.823-8.533-8.533-8.533h-76.8
												c-3.2,0-6.127,1.783-7.586,4.625c-1.468,2.85-1.212,6.263,0.64,8.866L280.158,183.222z"/>
										</g>
									</g>
								</g>
							</svg>`,"\u0413\u043E\u043E \u0441\u0430\u0439\u0445\u0430\u043D":`<svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 							width="25px" height="25px" viewBox="0 0 172.687 172.687"
	 							xml:space="preserve">
							<g>
								<g>
									<path d="M84.866,140.97c-1.144,0-4.305-1.68-7.554-1.68c-5.721,0-12.254,1.686-12.254,1.68c0,0,4.891,2.923,12.13,3.256
										c2.309,0.104,5.021-0.607,7.671-0.607c3.218,0,6.26,0.514,8.947,0.363c6.453-0.353,10.856-3.012,10.856-3.012
										s-5.417-1.438-10.501-1.438C90.066,139.531,86.276,140.97,84.866,140.97z"/>
									<path d="M84.866,129.243c-12.361,0-22.415,11.727-22.415,11.727s10.053,14.162,22.415,14.162
											c12.365,0,22.412-14.162,22.412-14.162S97.231,129.243,84.866,129.243z M84.866,151.262c-12.368,0-19.804-10.292-19.804-10.292
											s10.972-7.77,13.58-7.584c2.604,0.186,6.225,2.949,6.225,2.949s4.549-2.949,7.714-2.949s12.088,7.584,12.088,7.584
											S97.231,151.262,84.866,151.262z"/>
										<path d="M78.058,103.99c0-7.814-6.356-14.161-14.162-14.161c-7.816,0-14.159,6.347-14.159,14.161
											c0,7.808,6.348,14.156,14.159,14.156C71.702,118.146,78.058,111.798,78.058,103.99z M69.019,100.226
											c3.549,1.707,4.468,5.526,4.683,7.037c0.219,1.51-2.996,0.562-3.103-0.4c-0.073-0.673,0.178-1.713-1.475-3.267l-0.048,0.969
											c-1.267,2.194-4.08,2.95-6.266,1.681c-2.192-1.265-2.941-4.051-1.697-6.238c-3.397-0.536-7.039-0.607-7.039-0.607
											S64.255,97.916,69.019,100.226z M55.409,105.369c0,0,3.221,1.488,6.058,2.08c2.554,0.524,8.909,0.814,8.909,0.814
											s-5.436,0.788-8.315,0.788C59.181,109.047,55.409,105.369,55.409,105.369z"/>
										<path d="M156.165,75.221c0.065-1.239,0.199-2.46,0.199-3.721c0-39.426-32.077-71.5-71.498-71.5C45.445,0,13.368,32.08,13.368,71.5
											c0,21.088,9.224,40.014,23.796,53.108c9.319,27.838,35.565,48.078,47.702,48.078c12.136,0,38.38-20.24,47.704-48.078
											c5.767-5.188,10.659-11.327,14.512-18.123c0.887-0.668,1.644-1.429,2.145-2.32l1.686-2.934l-0.87-0.448l0.011-0.027l1.932-1.116
											c4.192-2.413,6.677-8.77,7.214-13.663C159.702,81.372,158.605,77.58,156.165,75.221z M149.435,69.448l0.033,0.375l-0.252-0.391
											L149.435,69.448z M84.866,6.81c30.784,0,56.558,21.634,63.042,50.491c-3.146-4.685-8.323-8.215-13.319-8.215l-1.384,0.156
											c-26.277-24.476-64.7-29.735-93.145-24.285C51.694,13.746,67.473,6.81,84.866,6.81z M106.918,106.245
											c-2.189,1.27-5,0.514-6.261-1.681l-0.055-0.969c-1.653,1.554-1.401,2.594-1.472,3.267c-0.104,0.958-3.321,1.904-3.101,0.4
											c0.219-1.511,1.136-5.33,4.682-7.037c4.761-2.31,14.938-0.826,14.938-0.826s-3.633,0.076-7.037,0.607
											C109.861,102.194,109.108,104.985,106.918,106.245z M114.323,105.369c0,0-3.772,3.678-6.648,3.678c-2.892,0-8.32-0.789-8.32-0.789
											s6.359-0.284,8.909-0.82C111.098,106.857,114.323,105.369,114.323,105.369z M121.584,48.414c-3.493,0.695-6.699,2.465-9.179,5.453
											c-0.562,0.684-0.979,1.488-1.461,2.246c-7.639-4.011-16.535-5.995-26.078-5.995c-8.967,0-17.393,1.718-24.712,5.256
											c0.496-0.495,0.946-1.021,1.458-1.502c11.689-11.004,26.701-16.58,42.309-15.677C110.118,40.859,116.047,44.296,121.584,48.414z
											 M34.217,111.629c-8.764-11.042-14.042-24.975-14.042-40.124c0-14.082,4.573-27.081,12.238-37.71
											c15.331-4.684,35.457-5.727,55.054-1.037c-11.248,2.432-21.742,7.888-30.522,16.16c-8.523,8.024-14.703,18.06-17.703,28.016
											c-3.456,7.538-5.452,16.692-5.452,27.658C33.791,106.966,33.942,109.319,34.217,111.629z M84.866,168.177
											c-17.36,0-46.229-35.262-46.229-65.096c0-25.945,20.693-46.974,46.229-46.974c8.524,0,16.491,2.39,23.35,6.478
											c-0.686,2.942-0.816,6.035-0.257,9.006l0.58,2.851l-0.462,0.936c-1.948,4.73-1.696,10.025,0.493,14.731
											c-0.882-0.171-1.796-0.274-2.73-0.274c-7.807,0-14.162,6.349-14.162,14.156c0,7.813,6.355,14.161,14.162,14.161
											c7.82,0,14.156-6.348,14.156-14.161c0-1.769-0.354-3.441-0.952-5.007l3.917,0.771c0.121,1.078,0.374,2.092,0.799,3.021
											c1.298,2.802,3.997,4.53,7.037,5.488C127.799,136.844,101.231,168.177,84.866,168.177z M121.889,94.283
											c-0.053-0.592,0.761-1.691,2.146-2.993c-0.505,1.724-0.899,3.502-1.063,5.226L121.889,94.283z M135.514,111.629
											c0.101-0.804,0.088-1.63,0.143-2.446c0.515,0.033,1.028,0.061,1.523,0.061C136.608,110.031,136.115,110.863,135.514,111.629z
											 M150.365,96.849c-6.127-11.867-14.783-14.093-14.783-14.093s3.335,15.976,10.843,19.812c-2.788,4.87-17.039,4.695-19.732-1.149
											c-2.689-5.845,4.608-18.968,4.608-18.968s-15.003,7.686-12.317,13.229c-5.784-1.134-11.491-10.37-7.924-19.082
											c2.621-6.397,17.444,0.721,17.444,0.721s-14.058-12.184-17.373-6.329c-1.915-10.151,5.237-21.891,16.202-19.475
											c-8.682,7.984,4.183,22.72,4.183,22.72s-4.79-16.068-1.243-20.042c5.264-5.907,17.313,3.161,17.384,11.872
											c-6.167-0.465-12,11.825-12,11.825s13.444-4.774,18.191-0.459C158.573,81.766,155.029,94.162,150.365,96.849z M145.149,94.49
											c-0.229,0.602-0.442,1.204-0.694,1.796c-1.28-1.861-2.435-4.132-3.371-6.513C142.399,90.967,143.787,92.542,145.149,94.49z
											 M143.245,72.783l-0.607,0.05l0.384-0.429L143.245,72.783z"/>
									</g>
								</g>
							</svg>`,\u0412\u0430\u043A\u0441:`<svg fill="currentColor" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
								 viewBox="0 0 496 496" xml:space="preserve">
							<g>
								<g>
									<g>
										<path d="M496,16V0H296c-22.056,0-40,17.944-40,40c0,22.056,17.944,40,40,40c8.816,0,16,7.184,16,16v30.312
											c0,4.76-1.392,9.36-4.032,13.312l-5.248,7.872c-4.4,6.592-6.72,14.264-6.72,22.192V176c0,22.056,17.944,40,40,40
											c22.056,0,40-17.944,40-40v-6.312c0-7.928-2.32-15.6-6.72-22.184l-5.248-7.872c-2.64-3.96-4.032-8.56-4.032-13.32V96
											c0-8.816,7.176-16,16-16h120V64H392v-8c0-13.232-10.768-24-24-24c-4.416,0-8-3.584-8-8v-8H496z M360,176
											c0,13.232-10.768,24-24,24s-24-10.768-24-24v-6.312c0-4.76,1.392-9.36,4.032-13.312l5.248-7.872
											c4.4-6.592,6.72-14.264,6.72-22.192V96c0-5.856-1.696-11.272-4.448-16h24.896C345.696,84.728,344,90.144,344,96v30.312
											c0,7.928,2.32,15.6,6.72,22.192l5.248,7.872c2.64,3.952,4.032,8.552,4.032,13.312V176z M368,48c4.416,0,8,3.584,8,8v8h-80
											c-13.232,0-24-10.768-24-24s10.768-24,24-24h48v8C344,37.232,354.768,48,368,48z"/>
										<path d="M264,160c0-22.056-17.944-40-40-40H40c-22.056,0-40,17.944-40,40v336h136h8h296v-32.552c31.52-3.96,56-30.872,56-63.448
											v-96H264V160z M16,160c0-13.232,10.768-24,24-24h184c13.232,0,24,10.768,24,24v24H16V160z M16,200h232v16H16V200z M16,232h232v72
											h-36.904c-11.76-33.256-43.424-56-79.096-56c-46.32,0-84,37.68-84,84c0,25.624,11.952,49.8,32,65.696V400
											c0,11.664,3.184,22.576,8.656,32H16V232z M193.872,304H80v71.632C69.816,363.504,64,348.096,64,332c0-37.496,30.504-68,68-68
											C158.92,264,183.024,280.008,193.872,304z M136,480H16v-32h85.808c9.384,8.256,21.168,13.808,34.192,15.448V480z M424,480H152
											v-16h272V480z M480,320v16h-16v16h16v48c0,26.472-21.528,48-48,48H144c-26.472,0-48-21.528-48-48v-48h352v-16H96v-16H480z"/>
									</g>
								</g>
							</g>
							</svg>`,\u0425\u04E9\u043C\u0441\u04E9\u0433:`<svg width="25px" height="25px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    							<title>eyebrow_fill</title>
    								<g id="\u9875\u9762-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        								<g id="Part" transform="translate(-192.000000, -48.000000)" fill-rule="nonzero">
            							<g id="eyebrow_fill" transform="translate(192.000000, 48.000000)">
                					<path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero">
									</path>
                					<path d="M18.9372,9.36167 C20.6395,10.1301 22.108,11.2831 22.8998,12.9158 C23.0681,13.2628 23.0219,13.6757 22.781,13.9769 C22.5401,14.278 22.1474,14.4138 21.772,14.3258 C15.8145,12.93 9.78907,15.3311 6.61118,16.6414 C4.618,17.4633 2.68113,16.7923 1.68066,15.44 C1.18289,14.7672 0.915929,13.9186 1.02369,13.0307 C1.36416,10.2254 4.88953,9.02468 7.21626,8.49728 C10.9972,7.64025 15.3643,7.74879 18.9372,9.36167 Z" id="\u8DEF\u5F84" fill="currentColor">
									</path>
            						</g>
        						</g>
    						</g>
							</svg>`,\u0421\u043E\u0440\u043C\u0443\u0443\u0441:`<svg height="25px" width="25px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 								viewBox="0 0 512 512"  xml:space="preserve">
							<style type="text/css">
									.st0{fill: currentColor;}
							</style>
							<g>
								<path class="st0" d="M404.946,230.669C428.2,245.234,463.907,261.977,512,268.662c-32.248-25.252-53.918-48.832-67.492-66.023
									c14.297-12.091,27.43-25.52,39.049-40.207l-37.515-29.708c-21.308,26.916-48.434,49.013-79.43,64.366
									c-31.011,15.346-65.853,23.971-102.884,23.985c-37.027-0.014-71.872-8.639-102.883-23.985c-31-15.353-58.129-37.45-79.43-64.366
									l-37.522,29.708c9.073,11.461,19.068,22.154,29.791,32.067C60.933,211.915,37.696,239.141,0,268.662
									c53.55-7.446,91.748-27.35,114.486-42.848c8.111,5.122,16.475,9.884,25.121,14.159c1.249,0.615,2.515,1.208,3.774,1.802
									c-3.662,21.749-12.658,60.502-33.55,94.696c40.634-18.03,69.264-54.359,83.775-76.427c10.882,2.807,22.017,4.971,33.362,6.461
									l29.028,112.77l28.623-111.15c12.177-0.897,24.155-2.554,35.866-4.963c15.075,22.242,42.917,56.103,81.691,73.308
									c-18.993-31.083-28.153-65.928-32.414-88.351c6.135-2.51,12.184-5.217,18.096-8.147
									C393.68,237.087,399.352,233.932,404.946,230.669z"/>
							</g>
							</svg>`,"\u041D\u04AF\u04AF\u0440 \u0431\u0443\u0434\u0430\u043B\u0442":`<svg fill="currentColor" height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
								 viewBox="0 0 219.992 219.992" xml:space="preserve">
							<path d="M147.206,102.657l-33.167,30.359l-27.075-27.075l30.359-33.167L147.206,102.657z M81.557,111.848L3.435,197.195
								c-4.793,5.416-4.541,13.664,0.572,18.777c2.589,2.589,6.031,4.015,9.694,4.015c3.349,0,6.574-1.223,9.133-3.487l85.297-78.077
								L81.557,111.848z M211.809,50.894L169.085,8.17c-5.266-5.265-11.898-8.165-18.678-8.165c-9.933,0-17.749,6.389-19.449,15.897
								l-8.979,50.214l31.884,31.884l50.214-8.979c7.306-1.306,12.746-6.039,14.927-12.985C221.649,67.612,218.892,57.978,211.809,50.894z"
								/>
							</svg>`,Spa:`<svg fill="currentColor" height="25px" width="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
					viewBox="0 0 511.999 511.999" xml:space="preserve"><g><g>
						<path d="M511.505,390.084c-1.954-6.81-9.071-10.624-15.821-8.798l-83.908,23.979L339.9,357.35c-2.099-1.399-4.574-2.15-7.1-2.15
						H38.4c-7.074,0-12.8,5.726-12.8,12.8c0,7.074,5.726,12.8,12.8,12.8h290.517l73.574,49.05c2.125,1.417,4.599,2.15,7.1,2.15
						c1.178,0,2.364-0.162,3.516-0.486l89.6-25.6C509.508,403.959,513.442,396.876,511.505,390.084z"/></g></g>
						<g><g>
						<path d="M422.391,252.799c-35.285,0-64,28.706-64,64c0,35.285,28.715,64,64,64c35.294,0,64-28.715,64-64
						C486.391,281.506,457.685,252.799,422.391,252.799z M422.391,355.199c-21.205,0-38.4-17.195-38.4-38.4
						c0-21.205,17.195-38.4,38.4-38.4c21.205,0,38.4,17.195,38.4,38.4C460.792,338.005,443.597,355.199,422.391,355.199z"/></g></g><g><g>
						<path d="M217.6,79.999c-35.285,0-64,28.706-64,64s28.706,64,64,64c35.294,0,64-28.715,64-64
						C281.6,108.706,252.894,79.999,217.6,79.999z M217.6,182.399c-21.205,0-38.4-17.195-38.4-38.4s17.186-38.4,38.4-38.4
						c21.205,0,38.4,17.195,38.4,38.4S238.805,182.399,217.6,182.399z"/></g></g>
<g>
	<g>
		<path d="M288.179,280.226l-128-76.8c-3.063-1.826-6.758-2.347-10.163-1.314c-3.422,0.998-6.272,3.379-7.876,6.562l-51.2,102.4
			c-3.157,6.323-0.589,14.012,5.734,17.178c1.835,0.913,3.789,1.348,5.709,1.348c4.702,0,9.216-2.586,11.46-7.074l45.013-90.035
			l116.147,69.683c6.076,3.635,13.926,1.673,17.562-4.386S294.238,283.861,288.179,280.226z"/>
	</g>
</g>
<g>
	<g>
		<path d="M332.8,406.399h-320c-7.074,0-12.8,5.726-12.8,12.8c0,7.074,5.726,12.8,12.8,12.8h320c7.074,0,12.8-5.726,12.8-12.8
			C345.6,412.125,339.874,406.399,332.8,406.399z"/>
	</g>
</g>
</svg>`,\u0428\u0438\u0432\u044D\u044D\u0441:`<svg fill="currentColor" height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 459.82 459.82" xml:space="preserve" stroke="currentColor">
						<g id="SVGRepo_bgCarrier" stroke-width="0"/>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
						<g id="SVGRepo_iconCarrier"> <path d="M458.648,213.641l-53.128-53.128c1.471-4.246,4.284-13.429,5.426-24.395c1.9-18.255-1.774-33.442-10.608-44.271 c0.864-1.96,1.329-4.05,1.397-6.155l12.564-3.165l1.051,6.227c0.33,1.953,2.023,3.335,3.939,3.335c0.221,0,0.445-0.019,0.67-0.057 l28.453-4.803c2.179-0.368,3.646-2.432,3.279-4.61l-3.325-19.699c-0.177-1.046-0.762-1.979-1.626-2.594 c-0.865-0.614-1.939-0.859-2.984-0.685l-28.454,4.803c-1.046,0.177-1.979,0.762-2.594,1.626s-0.861,1.938-0.685,2.984l0.938,5.558 l-12.899,3.249c-1.347-2.756-3.458-5.229-6.49-7.004c-5.664-3.316-12.913-2.987-18.188,0.918c-4.711,3.488-6.936,8.79-6.735,14.015 l-9.028,2.275l1.955,7.758l9.301-2.344c0.703,1.21,1.554,2.356,2.589,3.392c1.378,1.378,2.946,2.443,4.613,3.234 c2.981,6.526-0.104,19.573-3.721,29.245l-53.308-53.308c-0.75-0.75-1.768-1.172-2.829-1.172s-2.078,0.422-2.829,1.172 L194.227,197.21l-15.745-15.745c-0.75-0.75-1.768-1.172-2.829-1.172s-2.078,0.422-2.829,1.172l-4.496,4.496l-4.283-4.284 l13.39-13.39c1.562-1.562,1.562-4.094,0-5.656l-12.818-12.818c-1.562-1.562-4.095-1.562-5.657,0l-32.438,32.438 c-1.562,1.562-1.562,4.095,0,5.656l12.818,12.818c0.781,0.781,1.805,1.172,2.829,1.172s2.047-0.391,2.829-1.172l13.39-13.39 l4.283,4.284l-4.496,4.496c-1.562,1.562-1.562,4.094,0,5.656l7.371,7.371l-24.255,24.256l-2.924-2.924 c-0.807-0.807-1.921-1.242-3.058-1.165l-16.651,0.956c-0.98,0.056-1.905,0.471-2.599,1.165l-67.491,67.49 c-0.694,0.693-1.108,1.619-1.165,2.599l-0.955,16.651c-0.065,1.139,0.359,2.251,1.165,3.058l3.45,3.45l-19.049,19.05 c-1.109,1.109-1.559,2.766-1.017,4.238c1.356,3.677,0.447,7.841-2.309,10.599c-2.689,2.688-6.617,3.621-10.247,2.434 c-1.836-0.602-3.836,0.196-4.758,1.893l-9.231,16.997c-0.846,1.557-0.566,3.485,0.687,4.737l2.406,2.406l-6.374,6.374 c-1.562,1.562-1.562,4.095,0,5.657h0c1.562,1.562,4.094,1.562,5.656,0l6.374-6.374l3.45,3.45c0.781,0.781,1.805,1.172,2.829,1.172 s2.047-0.391,2.829-1.172l50.107-50.107l3.415,3.415c0.785,0.785,1.856,1.233,2.966,1.205c0.042-0.001,0.084-0.003,0.126-0.006 l16.651-0.955c0.98-0.056,1.905-0.471,2.599-1.165l67.491-67.491c0.694-0.693,1.108-1.619,1.165-2.599l0.956-16.651 c0.065-1.139-0.359-2.251-1.165-3.058l-2.924-2.924l24.255-24.256l7.371,7.371c0.75,0.75,1.768,1.172,2.829,1.172 s2.078-0.422,2.829-1.172l14.649-14.649c1.562-1.562,1.562-4.094,0-5.656l-15.745-15.745l1.668-1.668l134.769,134.77 c0.75,0.75,1.768,1.172,2.829,1.172s2.078-0.422,2.829-1.172l116.67-116.671C460.21,217.736,460.21,215.203,458.648,213.641z M441.144,68.197l1.993,11.811l-20.565,3.471l-1.994-11.811L441.144,68.197z M142.17,192.24l-7.162-7.161l26.781-26.78l7.162,7.161 L142.17,192.24z M19.48,387.652l-6.572-6.571l6.367-11.725c5.498,0.717,11.05-1.117,15.069-5.136 c4.31-4.311,6.108-10.527,4.902-16.412l17.471-17.471l10.039,10.038L19.48,387.652z M158.929,276.455l-65.335,65.336l-13.34,0.766 l-25.716-25.717l0.765-13.34l65.336-65.335l13.339-0.766l25.716,25.716L158.929,276.455z M158.039,250.145l-11.09-11.09 l24.255-24.256l11.09,11.09L158.039,250.145z M198.151,230.432l-31.489-31.489l8.993-8.992l31.489,31.489L198.151,230.432z M379.124,79.085c1.672-1.672,3.869-2.508,6.065-2.508s4.394,0.836,6.065,2.508c3.345,3.345,3.345,8.787,0,12.132 c-3.344,3.344-8.787,3.344-12.131,0C375.78,87.872,375.78,82.429,379.124,79.085z M385.015,122.183 c2.196-8.264,2.797-15.136,1.819-20.546c2.994-0.296,5.914-1.415,8.417-3.332c13.03,17.688,7.368,44.149,3.895,55.834 l-18.637-18.637C381.672,132.664,383.532,127.767,385.015,122.183z M406.737,215.948l-68.112,68.112l-37.768-37.768l68.112-68.112 L406.737,215.948z M322.4,279.149l-4.282,4.282L301.487,266.8l4.282-4.282L322.4,279.149z M328.056,284.805l7.74,7.74 c0.75,0.75,1.768,1.172,2.829,1.172s2.078-0.422,2.829-1.172l73.769-73.77c1.562-1.562,1.562-4.095,0-5.656l-7.74-7.74l4.282-4.282 l12.757,12.757l-87.991,87.99l-12.757-12.757L328.056,284.805z M401.826,199.723l-16.631-16.631l4.283-4.282l16.631,16.631 L401.826,199.723z M379.538,177.435l-7.74-7.74c-0.75-0.75-1.768-1.172-2.829-1.172s-2.078,0.422-2.829,1.172l-73.769,73.77 c-1.562,1.562-1.562,4.095,0,5.656l7.74,7.74l-4.282,4.282l-29.083-29.083l4.282-4.282l7.74,7.74c0.75,0.75,1.768,1.172,2.829,1.172 s2.078-0.422,2.829-1.172l73.77-73.77c0.75-0.75,1.171-1.768,1.171-2.828s-0.421-2.078-1.171-2.828l-7.74-7.74l4.282-4.282 l29.083,29.083L379.538,177.435z M349.71,158.92l-68.113,68.112l-37.768-37.768l68.112-68.111L349.71,158.92z M265.372,222.122 l-4.282,4.282l-16.631-16.631l4.282-4.282L265.372,222.122z M344.798,142.695l-16.631-16.63l4.283-4.283l16.631,16.631 L344.798,142.695z M322.511,120.408l-7.74-7.74c-1.563-1.563-4.095-1.562-5.657,0l-73.769,73.769c-1.562,1.562-1.562,4.095,0,5.656 l7.74,7.74l-4.282,4.282l-20.084-20.084l87.991-87.991l20.084,20.084L322.511,120.408z M339.149,327.483l-131.941-131.94 l5.854-5.854l120.64,120.641c0.75,0.75,1.768,1.172,2.829,1.172s2.078-0.422,2.829-1.172l93.647-93.647 c1.562-1.562,1.562-4.095,0-5.656L312.366,90.385l5.856-5.856l131.941,131.94L339.149,327.483z"/> </g>
					</svg>`}[e]||'<circle cx="12" cy="12" r="10"/>'}render(){let e=Object.entries(this.servicesData).map(([t,s])=>{let o=s.map(i=>`<li data-service="${i}">${i}</li>`).join("");return`
                <li class="service-category">
                    <div class="category-row">
                        ${this.getSVGIcon(t)}
                        <p class="category-name">${t}</p>
                    </div>
                    <ul class="subservice">
                        ${o}
                    </ul>
                </li>
            `}).join("");this.innerHTML=`
            <ul class="service">
                ${e}
            </ul>`}setupEventListeners(){let e=this.closest("order-inner");if(!e)return;let s=e.querySelector(".toggle-btn")?.querySelector("p"),o=e.querySelector(".hidden-content"),i=this.querySelectorAll(".service-category");i.forEach(n=>{let a=n.querySelector(".category-row"),r=n.querySelector(".category-name"),c=n.querySelector(".subservice");a.addEventListener("click",g=>{g.stopPropagation(),i.forEach(h=>{h!==n&&h.querySelector(".subservice")?.classList.remove("show")}),c.classList.toggle("show")}),c.querySelectorAll("li").forEach(g=>{g.addEventListener("click",h=>{h.stopPropagation();let u=g.textContent,m=g.dataset.service;s&&(s.textContent=u),window.orderManager&&window.orderManager.updateService(m),c.classList.remove("show"),o&&o.classList.remove("show")})})})}};window.customElements.define("order-service",C);var x=class extends HTMLElement{constructor(){super()}connectedCallback(){this.render(),this.setupOrderInnerIntegration()}render(){let e=[];for(let t=9;t<=22;t++)e.push(`${t.toString().padStart(2,"0")}:00`);this.innerHTML=`
        <div class="order-time-pick">
        <time-picker 
                available-times='${JSON.stringify(e)}'>
            </time-picker>
        </div>
            
        `}setupOrderInnerIntegration(){let e=this.querySelector("time-picker"),t=this.closest("order-inner");if(!e||!t)return;let o=t.querySelector(".toggle-btn")?.querySelector("p"),i=t.querySelector(".hidden-content");e.addEventListener("time-selected",n=>{let a=n.detail.time;o&&(o.textContent=a),i&&i.classList.remove("show"),window.orderManager&&window.orderManager.updateTime(a)})}getSelectedTime(){let e=this.querySelector("time-picker");return e?e.getSelectedTime():null}setTimeSlots(e){let t=this.querySelector("time-picker");t&&t.setAvailableTimes(e)}};customElements.define("order-time",x);var M=class extends HTMLElement{constructor(){super()}connectedCallback(){this.render(),this.setupOrderInnerIntegration()}render(){this.innerHTML="<calendar-picker></calendar-picker>"}setupOrderInnerIntegration(){let e=this.querySelector("calendar-picker"),t=this.closest("order-inner");if(!e||!t)return;let o=t.querySelector(".toggle-btn")?.querySelector("p"),i=t.querySelector(".hidden-content");e.addEventListener("date-selected",n=>{let a=n.detail.formatted,r=n.detail.date;o&&(o.textContent=a),i&&i.classList.remove("show"),window.orderManager&&window.orderManager.updateDate(r)})}getSelectedDate(){let e=this.querySelector("calendar-picker");return e?e.getSelectedDate():null}setDate(e){let t=this.querySelector("calendar-picker");t&&t.setDate(e)}};customElements.define("order-date",M);var E=class extends HTMLElement{constructor(){super(),this.selectedCoords=null,this.map=null,this.marker=null,this.locationsData={\u041E\u0444\u0438\u0446\u0435\u0440:{lat:47.9155352,lng:106.9686054},"\u0417\u04AF\u04AF\u043D 4 \u0437\u0430\u043C":{lat:47.9189213,lng:106.9412899},\u0421\u0430\u043D\u0441\u0430\u0440:{lat:47.9269738,lng:106.9236946},"\u0428\u0438\u043D\u044D \u0437\u0443\u0443\u043D \u0430\u0439\u043B":{lat:47.9059041,lng:106.9520625},\u0410\u043C\u0433\u0430\u043B\u0430\u043D:{lat:47.9059041,lng:106.9520625},\u041D\u0430\u0442\u0443\u0440:{lat:47.9116262,lng:106.9176731},\u0417\u0430\u0439\u0441\u0430\u043D:{lat:47.9116262,lng:106.9176731},\u0414\u04E9\u043B\u0433\u04E9\u04E9\u043D\u043D\u0443\u0443\u0440:{lat:47.9323515,lng:106.9147106},"\u0421\u04AF\u0445\u0431\u0430\u0430\u0442\u0430\u0440\u044B\u043D \u0442\u0430\u043B\u0431\u0430\u0439":{lat:47.9190455,lng:106.9175499},"10-\u0440 \u0445\u043E\u0440\u043E\u043E\u043B\u043E\u043B":{lat:47.9139691,lng:106.8671358},"5 \u0448\u0430\u0440":{lat:47.9139691,lng:106.8671358},"3,4 \u0425\u043E\u0440\u043E\u043E\u043B\u043E\u043B":{lat:47.9214453,lng:106.8747682},\u042F\u0430\u0440\u043C\u0430\u0433:{lat:47.870042,lng:106.8158627},"120 \u043C\u044F\u043D\u0433\u0430\u0442":{lat:47.9016616,lng:106.9076207},"\u041D\u0430\u0440\u043D\u044B \u0437\u0430\u043C":{lat:47.9082281,lng:106.9298725},\u0411\u0430\u044F\u043D\u043C\u043E\u043D\u0433\u043E\u043B:{lat:47.9045486,lng:106.9224587},"\u0411\u0430\u0440\u0443\u0443\u043D 4 \u0437\u0430\u043C":{lat:47.9153454,lng:106.8624716},"\u0428\u0430\u0440 \u0445\u0430\u0434":{lat:47.9153454,lng:106.8624716},\u0414\u04AF\u043D\u0436\u0438\u043D\u0433\u0430\u0440\u0430\u0432:{lat:47.9189213,lng:106.9412899}}}connectedCallback(){this.innerHTML=`
            <ul class="locations">
                <li class="get-location">
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.36328 12.0523C4.01081 11.5711 3.33457 11.3304 3.13309 10.9655C2.95849 10.6492 2.95032 10.2673 3.11124 9.94388C3.29694 9.57063 3.96228 9.30132 5.29295 8.76272L17.8356 3.68594C19.1461 3.15547 19.8014 2.89024 20.2154 3.02623C20.5747 3.14427 20.8565 3.42608 20.9746 3.7854C21.1106 4.19937 20.8453 4.85465 20.3149 6.16521L15.2381 18.7078C14.6995 20.0385 14.4302 20.7039 14.0569 20.8896C13.7335 21.0505 13.3516 21.0423 13.0353 20.8677C12.6704 20.6662 12.4297 19.99 11.9485 18.6375L10.4751 14.4967C10.3815 14.2336 10.3347 14.102 10.2582 13.9922C10.1905 13.8948 10.106 13.8103 10.0086 13.7426C9.89876 13.6661 9.76719 13.6193 9.50407 13.5257L5.36328 12.0523Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>Map</p>
                </li>
                <li class="add-location">
                    <svg width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><g id="Complete"><g data-name="add" id="add-2"><g>
                        <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="19" y2="5"/>
                        <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" x2="19" y1="12" y2="12"/></g></g></g>
                    </svg>
                    <select>
                        <option>\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u043D\u044D\u043C\u044D\u0445</option>
                        <option>\u041E\u0444\u0438\u0446\u0435\u0440</option>
                        <option>\u0417\u04AF\u04AF\u043D 4 \u0437\u0430\u043C</option>
                        <option>\u0414\u04AF\u043D\u0436\u0438\u043D\u0433\u0430\u0440\u0430\u0432</option>
                        <option>\u0421\u0430\u043D\u0441\u0430\u0440</option>
                        <option>\u0428\u0438\u043D\u044D \u0437\u0443\u0443\u043D \u0430\u0439\u043B</option>
                        <option>\u0410\u043C\u0433\u0430\u043B\u0430\u043D</option>
                        <option>\u041D\u0430\u0442\u0443\u0440</option>
                        <option>\u0417\u0430\u0439\u0441\u0430\u043D</option>
                        <option>\u0414\u04E9\u043B\u0433\u04E9\u04E9\u043D\u043D\u0443\u0443\u0440</option>
                        <option>\u0421\u04AF\u0445\u0431\u0430\u0430\u0442\u0430\u0440\u044B\u043D \u0442\u0430\u043B\u0431\u0430\u0439</option>
                        <option>10-\u0440 \u0445\u043E\u0440\u043E\u043E\u043B\u043E\u043B</option>
                        <option>5 \u0448\u0430\u0440</option>
                        <option>3,4 \u0425\u043E\u0440\u043E\u043E\u043B\u043E\u043B</option>
                        <option>\u042F\u0430\u0440\u043C\u0430\u0433</option>
                        <option>120 \u043C\u044F\u043D\u0433\u0430\u0442</option>
                        <option>\u041D\u0430\u0440\u043D\u044B \u0437\u0430\u043C</option>
                        <option>\u0411\u0430\u044F\u043D\u043C\u043E\u043D\u0433\u043E\u043B</option>
                        <option>\u0411\u0430\u0440\u0443\u0443\u043D 4 \u0437\u0430\u043C</option>
                        <option>\u0428\u0430\u0440 \u0445\u0430\u0434</option>
                    </select>
                </li>
            </ul>
        `,this.setupListeners()}setupListeners(){let e=this.closest("order-inner");if(!e)return;let t=e.querySelector(".toggle-btn p"),s=e.querySelector(".hidden-content");this.querySelector(".add-location select").addEventListener("change",o=>{o.stopPropagation();let i=o.target.value;if(i!=="\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u043D\u044D\u043C\u044D\u0445"){t.textContent=i,s?.classList.remove("show");let n=this.locationsData[i];n&&window.orderManager?.updateLocation({name:i,coordinates:n})}}),this.querySelector(".get-location").addEventListener("click",o=>{o.stopPropagation(),s?.classList.remove("show"),this.openMap(e,t)})}openMap(e,t){e.querySelector(".map-container")?.remove();let s=this.createMapContainer();e.appendChild(s),this.getUserLocation(s,t)}createMapContainer(){let e=document.createElement("div");return e.className="map-container",e.innerHTML=`
            <svg class="close-btn" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="currentColor"/>
            </svg>            
            <div class="map-view" id="map-${Date.now()}"></div>
            <div class="coords-box" style="display:none">
                <p><strong>\u041E\u0434\u043E\u043E\u0433\u0438\u0439\u043D \u0431\u0430\u0439\u0440\u0448\u0438\u043B:</strong></p>
                <p class="coords-text"></p>
            </div>
        `,e.querySelector(".close-btn").onclick=()=>e.remove(),e}getUserLocation(e,t){navigator.geolocation.getCurrentPosition(s=>this.initMap(e,s.coords.latitude,s.coords.longitude,t),()=>e.querySelector(".map-view").innerHTML='<p style="text-align:center;padding:50px;color:red">\u0410\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430</p>')}initMap(e,t,s,o){let i=e.querySelector(".map-view");setTimeout(()=>{this.map=L.map(i.id).setView([t,s],16),L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",{maxZoom:20,subdomains:["mt0","mt1","mt2","mt3"]}).addTo(this.map);let n=L.divIcon({html:'<div style="width:18px;height:18px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',iconSize:[18,18],iconAnchor:[9,9]});L.marker([t,s],{icon:n}).addTo(this.map),this.updateCoords(e,t,s),o.textContent="\u041E\u0414\u041E\u041E\u0413\u0418\u0419\u041D \u0411\u0410\u0419\u0420\u0428\u0418\u041B",window.orderManager?.updateLocation({name:"\u041E\u0434\u043E\u043E\u0433\u0438\u0439\u043D \u0431\u0430\u0439\u0440\u0448\u0438\u043B",coordinates:{lat:t,lng:s}}),this.map.on("click",a=>this.onMapClick(a,e,o))},100)}onMapClick(e,t,s){let{lat:o,lng:i}=e.latlng;this.marker&&this.map.removeLayer(this.marker);let n=L.divIcon({html:'<svg width="32" height="45"><ellipse cx="16" cy="42" rx="10" ry="3" fill="rgba(0,0,0,0.2)"/><path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28s12-19 12-28c0-6.627-5.373-12-12-12z" fill="#EA4335"/><circle cx="16" cy="12" r="5" fill="white"/><circle cx="16" cy="12" r="3" fill="#EA4335"/></svg>',iconSize:[32,45],iconAnchor:[16,45]});this.marker=L.marker([o,i],{icon:n}).addTo(this.map),this.selectedCoords={lat:o,lng:i},this.updateCoords(t,o,i),s.textContent="\u0421\u041E\u041D\u0413\u041E\u0421\u041E\u041D \u0411\u0410\u0419\u0420\u0428\u0418\u041B",window.orderManager?.updateLocation({name:"\u0421\u043E\u043D\u0433\u043E\u0441\u043E\u043D \u0431\u0430\u0439\u0440\u0448\u0438\u043B",coordinates:{lat:o,lng:i}})}updateCoords(e,t,s){let o=e.querySelector(".coords-box"),i=e.querySelector(".coords-text");i.innerHTML=`<strong>\u04E8\u0440\u0433\u04E9\u0440\u04E9\u0433:</strong> ${t.toFixed(6)}<br><strong>\u0423\u0440\u0442\u0440\u0430\u0433:</strong> ${s.toFixed(6)}`,o.style.display="block"}disconnectedCallback(){this.map&&(this.map.remove(),this.map=null)}};window.customElements.define("order-location",E);var D=class extends HTMLElement{constructor(){super(),this.currentDate=new Date,this.selectedDate=null,this.minDate=new Date,this.availableDates=null}connectedCallback(){let e=this.getAttribute("min-date");e&&(this.minDate=new Date(e));let t=this.getAttribute("available-dates");if(t)try{this.availableDates=JSON.parse(t)}catch(s){console.error("Available dates parse error:",s)}this.render(),this.attachEvents()}static get observedAttributes(){return["min-date","available-dates"]}attributeChangedCallback(e,t,s){if(t!==s&&(e==="min-date"&&(this.minDate=new Date(s),this.renderCalendar()),e==="available-dates")){try{this.availableDates=JSON.parse(s)}catch{this.availableDates=null}this.renderCalendar()}}render(){let e=["1-\u0440 \u0441\u0430\u0440","2-\u0440 \u0441\u0430\u0440","3-\u0440 \u0441\u0430\u0440","4-\u0440 \u0441\u0430\u0440","5-\u0440 \u0441\u0430\u0440","6-\u0440 \u0441\u0430\u0440","7-\u0440 \u0441\u0430\u0440","8-\u0440 \u0441\u0430\u0440","9-\u0440 \u0441\u0430\u0440","10-\u0440 \u0441\u0430\u0440","11-\u0440 \u0441\u0430\u0440","12-\u0440 \u0441\u0430\u0440"];this.innerHTML=`
            <div class="calendar-picker">
                <div class="calendar-header">
                    <button class="calendar-nav prev" aria-label="\u04E8\u043C\u043D\u04E9\u0445 \u0441\u0430\u0440">\u2039</button>
                    <div class="calendar-title" id="calendarMonth">
                        ${e[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}
                    </div>
                    <button class="calendar-nav next" aria-label="\u0414\u0430\u0440\u0430\u0430\u0445 \u0441\u0430\u0440">\u203A</button>
                </div>
                
                <div class="calendar-weekdays">
                    ${["\u0414\u0430","\u041C\u044F","\u041B\u0445","\u041F\u04AF","\u0411\u0430","\u0411\u044F","\u041D\u044F"].map(t=>`<div class="calendar-weekday">${t}</div>`).join("")}
                </div>
                
                <div class="calendar-days" id="calendarDays"></div>
            </div>
        `,this.renderCalendar()}isDayAvailable(e){if(!this.availableDates||this.availableDates.length===0)return!0;let s=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][e.getDay()];return this.availableDates.includes(s)}renderCalendar(){let e=this.currentDate.getFullYear(),t=this.currentDate.getMonth(),s=new Date;s.setHours(0,0,0,0);let o=new Date(this.minDate);o.setHours(0,0,0,0);let i=new Date(e,t,1),a=new Date(e,t+1,0).getDate(),r=i.getDay(),c="",d=r===0?6:r-1;for(let h=0;h<d;h++)c+='<div class="calendar-day empty"></div>';for(let h=1;h<=a;h++){let u=new Date(e,t,h);u.setHours(0,0,0,0);let m=u.getTime()===s.getTime(),Q=this.selectedDate&&u.getTime()===new Date(this.selectedDate).setHours(0,0,0,0),G=u<o,K=this.isDayAvailable(u),ee=G||!K,b=["calendar-day"];m&&b.push("today"),Q&&b.push("selected"),ee&&b.push("disabled"),c+=`
                <div class="${b.join(" ")}" 
                     data-date="${u.toISOString()}"
                     data-day="${h}">
                    ${h}
                </div>
            `}let g=this.querySelector("#calendarDays");g&&(g.innerHTML=c)}attachEvents(){let e=this.querySelector(".prev"),t=this.querySelector(".next");e&&e.addEventListener("click",()=>{this.currentDate.setMonth(this.currentDate.getMonth()-1),this.updateMonthTitle(),this.renderCalendar(),this.attachDayEvents()}),t&&t.addEventListener("click",()=>{this.currentDate.setMonth(this.currentDate.getMonth()+1),this.updateMonthTitle(),this.renderCalendar(),this.attachDayEvents()}),this.attachDayEvents()}attachDayEvents(){this.querySelectorAll(".calendar-day:not(.disabled):not(.empty)").forEach(e=>{e.addEventListener("click",()=>{let t=e.getAttribute("data-date");this.selectedDate=new Date(t),console.log("\u{1F4C5} Calendar selected:",this.selectedDate),this.dispatchEvent(new CustomEvent("date-selected",{detail:{date:this.selectedDate,formatted:this.selectedDate.toLocaleDateString("mn-MN"),dayName:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.selectedDate.getDay()]},bubbles:!0,composed:!0})),this.renderCalendar(),this.attachDayEvents()})})}updateMonthTitle(){let e=["1-\u0440 \u0441\u0430\u0440","2-\u0440 \u0441\u0430\u0440","3-\u0440 \u0441\u0430\u0440","4-\u0440 \u0441\u0430\u0440","5-\u0440 \u0441\u0430\u0440","6-\u0440 \u0441\u0430\u0440","7-\u0440 \u0441\u0430\u0440","8-\u0440 \u0441\u0430\u0440","9-\u0440 \u0441\u0430\u0440","10-\u0440 \u0441\u0430\u0440","11-\u0440 \u0441\u0430\u0440","12-\u0440 \u0441\u0430\u0440"],t=this.querySelector("#calendarMonth");t&&(t.textContent=`${e[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`)}getSelectedDate(){return this.selectedDate}setDate(e){this.currentDate=new Date(e),this.selectedDate=new Date(e),this.updateMonthTitle(),this.renderCalendar(),this.attachDayEvents()}setMinDate(e){this.minDate=new Date(e),this.renderCalendar()}setAvailableDates(e){this.availableDates=e,this.renderCalendar()}reset(){this.selectedDate=null,this.renderCalendar()}};customElements.define("calendar-picker",D);var T=class extends HTMLElement{constructor(){super(),this.selectedTime=null,this.availableTimes=[],this.bookedTimes=[],this.pastTimes=[]}static get observedAttributes(){return["available-times","booked-times","past-times"]}connectedCallback(){this.parseAttributes(),this.render(),this.attachEvents()}attributeChangedCallback(e,t,s){t!==s&&(this.parseAttributes(),this.render(),this.attachEvents())}parseAttributes(){let e=this.getAttribute("available-times"),t=this.getAttribute("booked-times"),s=this.getAttribute("past-times");try{this.availableTimes=e?JSON.parse(e):[]}catch{this.availableTimes=[]}try{this.bookedTimes=t?JSON.parse(t):[]}catch{this.bookedTimes=[]}try{this.pastTimes=s?JSON.parse(s):[]}catch{this.pastTimes=[]}}render(){let e=this.availableTimes.length>0?this.availableTimes:this.getDefaultTimes(),t={\u04E8\u0433\u043B\u04E9\u04E9:[],\u04E8\u0434\u04E9\u0440:[],\u041E\u0440\u043E\u0439:[]};e.forEach(o=>{let i=parseInt(o.split(":")[0]);i>=6&&i<12?t.\u04E8\u0433\u043B\u04E9\u04E9.push(o):i>=12&&i<18?t.\u04E8\u0434\u04E9\u0440.push(o):i>=18&&i<=23&&t.\u041E\u0440\u043E\u0439.push(o)});let s='<div class="time-picker-container">';Object.keys(t).forEach(o=>{t[o].length>0&&(s+='<div class="time-group">',s+=`<h4 class="time-group-label">${o}</h4>`,s+='<div class="time-buttons">',t[o].forEach(i=>{let n=this.bookedTimes.includes(i),a=this.pastTimes.includes(i),r=this.selectedTime===i,c=n||a,d="time-btn";n&&(d+=" booked"),a&&(d+=" past"),r&&(d+=" selected"),s+=`<button class="${d}" data-time="${i}" ${c?"disabled":""}>${i}</button>`}),s+="</div>",s+="</div>")}),s+="</div>",this.innerHTML=s}attachEvents(){this.querySelectorAll(".time-btn:not([disabled])").forEach(e=>{e.addEventListener("click",()=>{this.selectedTime=e.dataset.time,this.dispatchEvent(new CustomEvent("time-selected",{detail:{time:this.selectedTime},bubbles:!0,composed:!0})),this.render(),this.attachEvents()})})}getDefaultTimes(){let e=[];for(let t=9;t<=22;t++)e.push(`${t.toString().padStart(2,"0")}:00`);return e}getSelectedTime(){return this.selectedTime}};customElements.define("time-picker",T);var $=class extends HTMLElement{constructor(){super(),this.salons=[],this.independentArtists=[],this.currentFilter="all",this.searchQuery=""}async connectedCallback(){await this.loadSalons(),this.renderTabs(),this.render(),this.attachEvents(),this.attachSearchEvent(),this.checkSelectedSalon()}async loadSalons(){try{let t=await(await fetch("http://localhost:3000/api/salons")).json();this.salons=t.salons.filter(o=>o.id!=="independent");let s=t.salons.find(o=>o.id==="independent");this.independentArtists=s?s.artists:[]}catch{this.salons=[],this.independentArtists=[]}}renderTabs(){let e=document.querySelector("#salonTabs");e&&(e.innerHTML=`
                <button class="tab active" data-tab="all">\u0411\u04AF\u0433\u0434</button>
                <button class="tab" data-tab="salons">\u0421\u0430\u043B\u043E\u043D</button>
                <button class="tab" data-tab="artists">\u0411\u0438\u0435 \u0434\u0430\u0430\u0441\u0430\u043D \u0430\u0440\u0442\u0438\u0441\u0442</button>
            `)}render(){this.innerHTML=`
            <div class="salon-content-wrapper">
                <div class="salon-list" id="salonList">
                    ${this.renderItems("all")}
                </div>
                <div class="salon-detail" id="salonDetail">
                    <div id="detailContent"></div>
                </div>
            </div>
        `}renderItems(e){let t=[];return(e==="all"||e==="salons")&&(t=[...t,...this.salons.map(s=>({...s,type:"salon"}))]),(e==="all"||e==="artists")&&(t=[...t,...this.independentArtists.map(s=>({...s,type:"artist"}))]),this.searchQuery&&(t=t.filter(s=>{let o=s.name?.toLowerCase()||"",i=s.profession?.toLowerCase()||"",n=s.location?.toLowerCase()||"",a=this.searchQuery.toLowerCase();return o.includes(a)||i.includes(a)||n.includes(a)})),t.length===0?'<div class="no-results"><p>\u0418\u043B\u044D\u0440\u0446 \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439</p></div>':t.map(s=>s.type==="salon"?`
                    <salon-description 
                        type="minimum" 
                        data-type="salon"
                        data="${s.id}"
                        name="${s.name}"
                        img="${s.img}"
                        rating="${s.rating}">
                    </salon-description>
                `:`
                    <salon-description 
                        type="minimum" 
                        data-type="artist"
                        data="${s.id}"
                        name="${s.name}"
                        img="${s.img}"
                        rating="${s.rating}"
                        profession="${s.profession}">
                    </salon-description>
                `).join("")}attachSearchEvent(){let e=document.querySelector(".searchbar input");e&&e.addEventListener("input",t=>{this.searchQuery=t.target.value,this.updateList()})}updateList(){let e=this.querySelector("#salonList");e&&(e.innerHTML=this.renderItems(this.currentFilter),this.attachItemEvents())}attachEvents(){document.querySelectorAll("#salonTabs .tab").forEach(e=>{e.addEventListener("click",t=>{let s=t.target.dataset.tab;this.switchTab(s)})}),this.attachItemEvents()}attachItemEvents(){this.querySelectorAll('salon-description[type="minimum"]').forEach(e=>{let t=e.querySelector("article");t&&t.addEventListener("click",()=>{let s=e.getAttribute("data-type");console.log("Clicked:",e.getAttribute("name"),"Type:",s),s==="salon"?this.showSalonDetail(e):s==="artist"&&this.showArtistDetail(e)})})}switchTab(e){this.currentFilter=e,document.querySelectorAll("#salonTabs .tab").forEach(t=>{t.classList.toggle("active",t.dataset.tab===e)}),this.hideDetail(),this.updateList()}checkSelectedSalon(){let e=sessionStorage.getItem("selectedSalonId"),t=sessionStorage.getItem("selectedSalonType");e&&(console.log("\u{1F4CC} Auto-selecting salon:",e,"Type:",t),sessionStorage.removeItem("selectedSalonId"),sessionStorage.removeItem("selectedSalonType"),setTimeout(()=>{t==="salon"?this.showSalonDetailById(e):t==="artist"&&this.showArtistDetailById(e)},300))}showSalonDetailById(e){let t=this.salons.find(u=>u.id===e);if(!t){console.error("Salon not found:",e);return}this.querySelector("#salonList").classList.add("column-mode");let o=this.querySelector("#salonDetail"),i=this.querySelector("#detailContent"),n=t.branches?.[0]?.location||t.location||"?",a=t.branches?.[0]?.schedule||t.schedule||"?",r=t.service?.map(u=>u.type)||[],c=t.branches||[],d=t.artists||[],g=t.service||[],h=t.creative||[];i.innerHTML=`
            <salon-description 
                type="maximum" 
                data="${t.id}"
                name="${t.name}"
                img="${t.img}"
                rating="${t.rating}"
                location="${n}"
                schedule="${a}"
                services='${JSON.stringify(r)}'
                fullservices='${this.escapeJSON(JSON.stringify(g))}'
                branches='${this.escapeJSON(JSON.stringify(c))}'
                artists='${this.escapeJSON(JSON.stringify(d))}'
                creative='${this.escapeJSON(JSON.stringify(h))}'>
            </salon-description>
        `,o.classList.add("active"),setTimeout(()=>{let u=i.querySelector(".information-header");if(u&&!u.querySelector(".back-btn")){let m=document.createElement("button");m.className="back-btn",m.textContent="\u0411\u0443\u0446\u0430\u0445",m.addEventListener("click",()=>this.hideDetail()),u.insertBefore(m,u.firstChild)}},50)}showArtistDetailById(e){let t=this.independentArtists.find(r=>r.id===e);if(!t){console.error("Artist not found:",e);return}this.querySelector("#salonList").classList.add("column-mode");let o=this.querySelector("#salonDetail"),i=this.querySelector("#detailContent"),n=t.service||[],a=t.art_pic||[];i.innerHTML=`
            <salon-description 
                type="maximum" 
                data="${t.id}"
                name="${t.name}"
                img="${t.img}"
                rating="${t.rating}"
                location="${t.location}"
                schedule="${t.schedule}"
                profession="${t.profession}"
                experience="${t.experience}"
                fullservices='${this.escapeJSON(JSON.stringify(n))}'
                creative='${this.escapeJSON(JSON.stringify(a))}'>
            </salon-description>
        `,o.classList.add("active"),setTimeout(()=>{let r=i.querySelector(".information-header");if(r&&!r.querySelector(".back-btn")){let c=document.createElement("button");c.className="back-btn",c.textContent="\u0411\u0443\u0446\u0430\u0445",c.addEventListener("click",()=>this.hideDetail()),r.insertBefore(c,r.firstChild)}},50)}showSalonDetail(e){let t=e.getAttribute("data");this.showSalonDetailById(t)}showArtistDetail(e){let t=e.getAttribute("data");this.showArtistDetailById(t)}escapeJSON(e){return e.replace(/"/g,"&quot;").replace(/'/g,"&#39;")}hideDetail(){let e=this.querySelector("#salonList"),t=this.querySelector("#salonDetail");e.classList.remove("column-mode"),t.classList.remove("active")}disconnectedCallback(){}};customElements.define("salon-all-list",$);var A=class extends HTMLElement{constructor(){super(),this.salons=[],this.specialSalons=[]}async connectedCallback(){await this.loadSalons(),this.render(),this.attachEvents()}async loadSalons(){try{let t=await(await fetch("http://localhost:3000/api/salons")).json();this.salons=t.salons||[],this.specialSalons=this.salons.filter(s=>s.special==="True")}catch(e){console.error("\u0421\u0430\u043B\u043E\u043D\u044B \u04E9\u0433\u04E9\u0433\u0434\u04E9\u043B \u0442\u0430\u0442\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430:",e),this.salons=[],this.specialSalons=[]}}render(){this.innerHTML=`
            <section class="salon-special-list">
                <h2>\u041E\u043D\u0446\u043B\u043E\u0445 \u0441\u0430\u043B\u043E\u043D</h2>
                <div class="salonsections">
                    <button class="snav prev" aria-label="\u04E8\u043C\u043D\u04E9\u0445">\u2039</button>
                    <div class="salonsection">
                        ${this.specialSalons.map(e=>{let t=e.branches&&e.branches.length>0?e.branches[0].location:e.location||"\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",s=e.branches&&e.branches.length>0?e.branches[0].schedule:e.schedule||"\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C \u0431\u0430\u0439\u0445\u0433\u04AF\u0439";return`
                                <salon-description 
                                    type="special" 
                                    data="${e.id}"
                                    name="${e.name}"
                                    img="${e.img}"
                                    rating="${e.rating}"
                                    location="${t}"
                                    schedule="${s}">
                                </salon-description>
                            `}).join("")}
                    </div>
                    <button class="snav next" aria-label="\u0414\u0430\u0440\u0430\u0430\u0445">\u203A</button>
                </div>
            </section>
            <dialog id="detailInfo"></dialog>
        `}attachEvents(){this.querySelectorAll('salon-description[type="special"]').forEach(i=>{i.addEventListener("click",()=>{let n=this.querySelector("#detailInfo"),a=i.getAttribute("data"),r=this.salons.find(c=>c.id===a);if(r){let c=r.branches&&r.branches.length>0?r.branches[0].location:r.location||"\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",d=r.branches&&r.branches.length>0?r.branches[0].schedule:r.schedule||"\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C \u0431\u0430\u0439\u0445\u0433\u04AF\u0439",g=r.service?.map(u=>u.type)||[],h=r.creative||[];n.innerHTML=`<salon-description 
                        type="detailed" 
                        data="${r.id}"
                        name="${r.name}"
                        img="${r.img}"
                        rating="${r.rating}"
                        location="${c}"
                        schedule="${d}"
                        description="${r.description||""}"
                        mission="${r.mission||""}"
                        services='${JSON.stringify(g)}'
                        creative='${JSON.stringify(h)}'>
                        </salon-description>`,n.showModal()}})});let e=this.querySelector(".salonsection"),t=this.querySelector(".next"),s=this.querySelector(".prev");t&&s&&e&&(t.addEventListener("click",()=>{e.scrollBy({left:300,behavior:"smooth"})}),s.addEventListener("click",()=>{e.scrollBy({left:-300,behavior:"smooth"})}));let o=this.querySelector("#detailInfo");o&&o.addEventListener("click",i=>{let n=o.getBoundingClientRect();(i.clientX<n.left||i.clientX>n.right||i.clientY<n.top||i.clientY>n.bottom)&&o.close()})}disconnectedCallback(){}};customElements.define("salon-special-list",A);var I=class extends HTMLElement{constructor(){super(),this.salonData=null}connectedCallback(){this.name=this.getAttribute("name")||"Unknown Salon",this.img=this.getAttribute("img")||"https://picsum.photos/300/200",this.rating=this.getAttribute("rating")||"0.0",this.type=this.getAttribute("type")??"-",this.location=this.getAttribute("location"),this.schedule=this.getAttribute("schedule"),this.branch=this.getAttribute("branch");let e=[],t=this.getAttribute("branches");t&&(e=JSON.parse(t)),this.branches=e;let s=[],o=this.getAttribute("artists");o&&(s=JSON.parse(o)),this.artists=s;let i=[],n=this.getAttribute("services");n&&(i=JSON.parse(n)),this.services=i;let a=[],r=this.getAttribute("fullservices");if(r){let g=this.decodeHTMLEntities(r);a=JSON.parse(g),console.log("Parsed full services:",a)}this.fullServices=a;let c=[],d=this.getAttribute("creative");switch(d&&(c=JSON.parse(d)),this.creative=c,this.loadFullSalonData(),this.type){case"special":this.specialSalon();break;case"maximum":this.salonMaximum();break;case"minimum":this.salonMinimum();break;default:this.salonDetailed();break}}async loadFullSalonData(){let e=this.getAttribute("data"),s=await(await fetch("http://localhost:3000/api/salons")).json();this.salonData=s.salons?.find(o=>o.id===e),console.log("Loaded full salon data:",this.salonData)}decodeHTMLEntities(e){let t=document.createElement("textarea");return t.innerHTML=e,t.value}specialSalon(){this.innerHTML=`
            <article>
                <img src="${this.img}" alt="${this.name}">
                <h4>${this.name}</h4>
            </article>
        `}salonMinimum(){let e=this.getStarsHTML(parseFloat(this.rating));this.innerHTML=`
            <article>
                <img src="${this.img}" alt="${this.name}">
                <div>
                    <h4>${this.name}</h4>
                    <div class="rating">
                        ${e}
                        <span style="margin-left: 5px; color: #666;">${this.rating}</span>
                    </div>
                </div>
            </article>
        `}getStarsHTML(e){let t=Math.floor(e),s=5-Math.ceil(e),o="";for(let i=0;i<t;i++)o+='<span style="color: #ffd700;">\u2605</span>';for(let i=0;i<s;i++)o+='<span style="color: #ddd;">\u2605</span>';return o}salonDetailed(){this.innerHTML=`
        <div class="salonMedium">
            <div class="head">
                <h5>${this.name}</h5>
                <button class="see-more-btn">\u0414\u044D\u043B\u0433\u044D\u0440\u044D\u043D\u0433\u04AF\u0439</button>
                <svg class="close-btn" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="currentColor"/>
                </svg>
            </div>
            <div class="descriptionMain">
                <h5>\u0411\u0430\u0439\u0440\u0448\u0438\u043B</h5>
                <p>${this.location}</p>
                <h5>\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C</h5>
                <p>${this.schedule}</p>
                <h5>\u042F\u0432\u0443\u0443\u043B\u0434\u0430\u0433 \u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D</h5>
                <ul class="salonService">
                    ${this.services.map(s=>`<li>${s}</li>`).join("")}
                </ul>
                <h5>\u0411\u04AF\u0442\u044D\u044D\u043B\u04AF\u04AF\u0434</h5>
                <div class="creative">
                    ${this.creative.map(s=>typeof s=="object"?`<img src="${s.img}" alt="${s.alt||"creative work"}">`:`<img src="${s}" alt="creative work">`).join("")}
                </div>
            </div>
        `;let e=this.querySelector(".close-btn");e&&e.addEventListener("click",s=>{s.stopPropagation();let o=document.querySelector("#detailInfo");o&&o.close()});let t=this.querySelector(".see-more-btn");t&&t.addEventListener("click",s=>{s.stopPropagation(),this.navigateToSalonPage()})}navigateToSalonPage(){let e=this.getAttribute("data"),t=document.querySelector("#detailInfo");t&&t.close(),sessionStorage.setItem("selectedSalonId",e),sessionStorage.setItem("selectedSalonType","salon"),window.location.hash="#/info"}salonMaximum(){this.innerHTML=`
            <div class="information">
                <div class="information-header">
                    <h1>${this.name}</h1>
                </div>
                
                <article>
                    <img src="${this.img}" alt="${this.name}">
                    <address>
                        ${this.branches&&this.branches.length>0?this.branches.map(e=>`
                            <h3>${e.branch_name||"\u0421\u0430\u043B\u0431\u0430\u0440"}</h3>
                            <h4>\u0425\u0430\u044F\u0433</h4>
                            <p>${e.location||this.location||"?"}</p>
                            <p>\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C: ${e.schedule||this.schedule||"?"}</p>
                        `).join(""):`
                            <h3>\u0425\u0430\u044F\u0433</h3>
                            <p>${this.location||"?"}</p>
                            <p>\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C: ${this.schedule||"?"}</p>
                        `}
                    </address>
                </article>
                
                <section class="services-section">
                    <h2>\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D\u043D\u04AF\u04AF\u0434</h2>
                    <div class="services-container" id="servicesContainer">
                    </div>
                </section>
                
                ${this.artists&&this.artists.length>0?`
                    <section>
                        <h2>\u0410\u0440\u0442\u0438\u0441\u0442\u0443\u0443\u0434</h2>
                        <div class="artist">
                            ${this.artists.map(e=>`
                                <div class="artist-card" data-artist-id="${e.id||e.artist_id}">
                                    <img src="${e.img||"https://picsum.photos/80/80?random="}" alt="${e.name}">
                                    <h3>${e.profession||"Artist"}</h3>
                                    <p>${e.name}</p>
                                </div>
                            `).join("")}
                        </div>
                    </section>
                `:""}
            </div>
            <dialog id="artistDetailDialog"></dialog>
        `,setTimeout(()=>{this.loadAndRenderServices(),this.attachArtistEvents()},100)}attachArtistEvents(){this.querySelectorAll(".artist-card").forEach(e=>{e.addEventListener("click",()=>{let t=e.getAttribute("data-artist-id");this.showArtistDialog(t)})})}async showArtistDialog(e){let t=this.artists.find(c=>c.id===e||c.artist_id===e);if(!t){console.error("Artist not found:",e);return}let s=this.querySelector("#artistDetailDialog"),o=t.location||this.location||"\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",i=t.schedule||this.schedule||"\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C \u0431\u0430\u0439\u0445\u0433\u04AF\u0439";if(t.branch_id&&this.branches){let c=this.branches.find(d=>d.branch_id===t.branch_id);c&&(o=c.location,i=c.schedule)}let n=t.experience||"\u0422\u0443\u0440\u0448\u043B\u0430\u0433\u0430 \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",a=t.img||"https://picsum.photos/300/300",r=[];this.creative&&Array.isArray(this.creative)&&(r=this.creative),s.innerHTML=`
            <artist-description 
                type="medium" 
                data="${e}"
                name="${t.name}"
                img="${a}"
                rating="${t.rating}"
                profession="${t.profession}"
                experience="${n}"
                location="${o}"
                schedule="${i}"
                artImg='${JSON.stringify(r)}'>
            </artist-description>
        `,s.showModal(),setTimeout(()=>{let c=s.querySelector(".close-btn");c&&c.addEventListener("click",d=>{d.stopPropagation(),s.close()})},50),s.addEventListener("click",c=>{let d=s.getBoundingClientRect();(c.clientX<d.left||c.clientX>d.right||c.clientY<d.top||c.clientY>d.bottom)&&s.close()})}async loadAndRenderServices(){let e=this.querySelector("#servicesContainer");if(!e)return;let t=this.fullServices;if(!t||t.length===0){e.innerHTML='<div class="loading-message">\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D \u0431\u0430\u0439\u0445\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430.</div>';return}e.innerHTML=t.map((s,o)=>`
            <div class="service-category" data-category-index="${o}">
                <div class="service-category-header">
                    <div>
                        <h3>${s.type}</h3>
                        ${s.description?`<div class="description">${s.description}</div>`:""}
                    </div>
                </div>
                <div class="service-category-content">
                    <ul class="subservice-list">
                        ${(s.subservice||[]).map(i=>`
                            <li class="subservice-item">
                                <div class="subservice-info">
                                    <div class="subservice-name">${i.name}</div>
                                    <div class="subservice-duration">${i.duration}</div>
                                </div>
                                <div class="subservice-price">${this.formatPrice(i.price)}</div>
                                <button class="book-button" data-service-id="${i.id}">
                                    \u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0445
                                </button>
                            </li>
                        `).join("")}
                    </ul>
                </div>
            </div>
        `).join(""),this.attachServiceEvents()}formatPrice(e){return parseInt(e).toLocaleString("mn-MN")+"\u20AE"}attachServiceEvents(){this.querySelectorAll(".service-category-header").forEach(e=>{e.addEventListener("click",t=>{t.currentTarget.closest(".service-category").classList.toggle("expanded")})}),this.querySelectorAll(".book-button").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let s=t.target.dataset.serviceId;this.handleBooking(s)})})}handleBooking(e){let t=null,s=null;if(this.fullServices.forEach(a=>{let r=a.subservice?.find(c=>c.id===e);r&&(t=r,s=a.type)}),!t)return;let o=[],i=[];this.salonData&&(o=this.salonData.date||[],i=this.salonData.time||[]);let n=document.createElement("booking-dialog");n.setAttribute("service-name",t.name),n.setAttribute("service-category",s),n.setAttribute("service-duration",t.duration),n.setAttribute("service-price",this.formatPrice(t.price)),n.setAttribute("salon-name",this.name),n.setAttribute("available-dates",JSON.stringify(o)),n.setAttribute("available-times",JSON.stringify(i)),document.body.appendChild(n),setTimeout(()=>{n.show()},100),n.addEventListener("dialog-closed",()=>{n.remove()})}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-description",I);var q=class extends HTMLElement{constructor(){super()}connectedCallback(){this.type=this.getAttribute("type")||"special",this.name=this.getAttribute("name")||"Unknown Artist",this.img=this.getAttribute("img")||"https://picsum.photos/300/200",this.profession=this.getAttribute("profession")||"",this.rating=this.getAttribute("rating")||"0.0",this.location=this.getAttribute("location")||"\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",this.experience=this.getAttribute("experience")||"4",this.schedule=this.getAttribute("schedule")||"\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C \u0431\u0430\u0439\u0445\u0433\u04AF\u0439";let e=[],t=this.getAttribute("artImg");t&&(e=JSON.parse(t)),this.artImg=Array.isArray(e)?e:[],this.type==="medium"?this.artistMedium():this.artistSpecial()}artistSpecial(){this.innerHTML=`
            <img src="${this.img}" alt="${this.name}">
            <h4>${this.name}</h4>
        `}artistMedium(){this.innerHTML=`
        <div class="artistMedium">
            <div class="head">
                <h5>${this.name}</h5>
                <button class="see-more-btn">\u0414\u044D\u043B\u0433\u044D\u0440\u044D\u043D\u0433\u04AF\u0439</button>
                <svg class="close-btn" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="currentColor"/>
                </svg>
            </div>
            <div class="main">
                <div class="left">
                <img src="${this.img}" alt="${this.name}">
                <p>${this.profession}</p>
                <p>\u2605<span>${this.rating}</span></p>
                </div>
                <div class="right">
                <h5>\u0422\u0443\u0440\u0448\u043B\u0430\u0433\u0430</h5>
                <p>${this.experience}</p>
                <h5>\u0410\u0436\u043B\u044B\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C</h5>
                <p>${this.schedule}</p>
                <h5>\u0421\u0430\u043B\u043E\u043D\u044B \u0431\u0430\u0439\u0440\u0448\u0438\u043B</h5>
                <p>${this.location}</p>
                </div>
                ${this.artImg.length>0?`
                    <h5>\u0411\u04AF\u0442\u044D\u044D\u043B\u04AF\u04AF\u0434</h5>
                    <div class="creative">
                        ${this.artImg.map(s=>typeof s=="object"&&s.img?`<img src="${s.img}" alt="${s.alt||"creative work"}">`:typeof s=="string"?`<img src="${s}" alt="creative work">`:"").join("")}
                    </div>
                `:""}
            </div>
        </div>
        `;let e=this.querySelector(".close-btn");e&&e.addEventListener("click",s=>{s.stopPropagation();let o=document.querySelector("#ArtistDetailInfo");o&&o.close()});let t=this.querySelector(".see-more-btn");t&&t.addEventListener("click",s=>{s.stopPropagation(),this.navigateToSalonPage()})}navigateToSalonPage(){let e=this.getAttribute("data"),t=document.querySelector("#artistDetailDialog");t&&t.close(),sessionStorage.setItem("selectedSalonId",e),sessionStorage.setItem("selectedSalonType","artist"),window.location.hash="#/info"}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("artist-description",q);var B=class extends HTMLElement{constructor(){super(),this.salons=[],this.independentArtists=[],this.specialIndependentArtists=[]}async connectedCallback(){await this.loadArtists(),this.render(),this.attachEvents()}async loadArtists(){try{let t=await(await fetch("http://localhost:3000/api/salons")).json();this.salons=t.salons||[];let s=this.salons.find(o=>o.id==="independent");s&&s.artists&&(this.independentArtists=s.artists,this.independentArtists.forEach(o=>{o.type="independent",o.salon_name="\u0411\u0438\u0435 \u0434\u0430\u0430\u0441\u0430\u043D",o.salon_location=o.location,o.date&&o.date.length>0?o.schedule=`${o.date.join(", ")}`:o.schedule="\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C \u0431\u0430\u0439\u0445\u0433\u04AF\u0439"})),this.specialIndependentArtists=this.independentArtists.filter(o=>o.special==="True"),console.log("Independent Artists:",this.independentArtists),console.log("Special Independent Artists:",this.specialIndependentArtists)}catch(e){console.error("\u0410\u0440\u0442\u0438\u0441\u0442\u044B\u043D \u04E9\u0433\u04E9\u0433\u0434\u04E9\u043B \u0442\u0430\u0442\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430:",e),this.independentArtists=[],this.specialIndependentArtists=[]}}render(){this.innerHTML=`
            <section class="artist-special-list">
                <h2>\u041E\u043D\u0446\u043B\u043E\u0445 \u0411\u0438\u0435 \u0414\u0430\u0430\u0441\u0430\u043D \u0410\u0440\u0442\u0438\u0441\u0442</h2>
                <div class="artistsections">
                    <button class="snav prev" aria-label="\u04E8\u043C\u043D\u04E9\u0445">\u2039</button>
                    <div class="artistsection">
                        ${this.specialIndependentArtists.map(e=>{let t=e.salon_location||e.location||"\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",s=e.schedule||"\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C \u0431\u0430\u0439\u0445\u0433\u04AF\u0439",o=e.experience||"",i=e.img||"https://picsum.photos/300/300";return`
                                <artist-description 
                                    type="special" 
                                    data="${e.artist_id||e.id}"
                                    artistType="independent"
                                    name="${e.name}"
                                    img="${i}"
                                    rating="${e.rating}"
                                    profession="${e.profession}"
                                    location="${t}"
                                    schedule="${s}"
                                    experience="${o}">
                                </artist-description>
                            `}).join("")}
                    </div>
                    <button class="snav next" aria-label="\u0414\u0430\u0440\u0430\u0430\u0445">\u203A</button>
                </div>
            </section>
            <dialog id="ArtistDetailInfo"></dialog>
        `}attachEvents(){this.querySelectorAll('artist-description[type="special"]').forEach(i=>{i.addEventListener("click",()=>{let n=this.querySelector("#ArtistDetailInfo"),a=i.getAttribute("data"),r=this.independentArtists.find(c=>c.artist_id===a||c.id===a);if(r){let c=r.salon_location||r.location||"\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",d=r.schedule||"\u0426\u0430\u0433\u0438\u0439\u043D \u0445\u0443\u0432\u0430\u0430\u0440\u044C \u0431\u0430\u0439\u0445\u0433\u04AF\u0439",g=r.experience||"\u0422\u0443\u0440\u0448\u043B\u0430\u0433\u0430 \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",h=r.img||"https://picsum.photos/300/300",u=[];r.art_pic&&Array.isArray(r.art_pic)&&(u=r.art_pic.map(m=>typeof m=="object"&&m.img?m.img:m)),n.innerHTML=`
                        <artist-description 
                            type="medium" 
                            data="${r.artist_id||r.id}"
                            name="${r.name}"
                            img="${h}"
                            rating="${r.rating}"
                            profession="${r.profession}"
                            experience="${g}"
                            location="${c}"
                            schedule="${d}"
                            artImg='${JSON.stringify(u)}'>
                        </artist-description>
                    `,n.showModal()}})});let e=this.querySelector(".artistsection"),t=this.querySelector(".next"),s=this.querySelector(".prev");t&&s&&e&&(t.addEventListener("click",()=>{e.scrollBy({left:300,behavior:"smooth"})}),s.addEventListener("click",()=>{e.scrollBy({left:-300,behavior:"smooth"})}));let o=this.querySelector("#ArtistDetailInfo");o&&o.addEventListener("click",i=>{let n=o.getBoundingClientRect();(i.clientX<n.left||i.clientX>n.right||i.clientY<n.top||i.clientY>n.bottom)&&o.close()})}disconnectedCallback(){}};customElements.define("artist-special-list",B);var H=class extends HTMLElement{constructor(){super(),this.selectedTime=null,this.availableDates=[],this.availableTimes=[],this.salonId=null}connectedCallback(){this.serviceName=this.getAttribute("service-name")||"",this.serviceCategory=this.getAttribute("service-category")||"",this.serviceDuration=this.getAttribute("service-duration")||"",this.servicePrice=this.getAttribute("service-price")||"",this.salonName=this.getAttribute("salon-name")||"",this.salonId=this.getAttribute("salon-id")||this.salonName;let e=this.getAttribute("available-dates"),t=this.getAttribute("available-times");if(e)try{this.availableDates=JSON.parse(e)}catch{this.availableDates=[]}if(t)try{this.availableTimes=JSON.parse(t)}catch{this.availableTimes=[]}this.render(),this.attachEvents()}render(){let e=JSON.stringify(this.availableDates),t=JSON.stringify(this.availableTimes.length>0?this.availableTimes:this.getDefaultTimes());this.innerHTML=`
            <dialog class="booking-dialog">
                <div class="booking-container">
                    <div class="booking-header">
                        <h2>\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u04AF\u04AF\u0441\u0433\u044D\u0445</h2>
                        <button class="close-booking-btn">\xD7</button>
                    </div>
                    
                    <div class="booking-service-info">
                        <h3>${this.serviceName}</h3>
                        <div class="service-details">
                            <span class="duration">\u23F1 ${this.serviceDuration}</span>
                            <span class="price">${this.servicePrice}</span>
                        </div>
                    </div>
                    
                    <div class="booking-content">
                        <div class="date-picker-section">
                            <calendar-picker 
                                available-dates='${e}'>
                            </calendar-picker>
                        </div>
                        
                        <div class="time-picker-section">
                            <h3>\u0426\u0430\u0433 \u0441\u043E\u043D\u0433\u043E\u0445</h3>
                            <time-picker 
                                id="bookingTimePicker"
                                available-times='${t}'>
                            </time-picker>
                        </div>
                    </div>
                    
                    <div class="booking-footer">
                        <button class="confirm-booking-btn">\u0417\u0430\u0445\u0438\u0430\u043B\u0430\u0445</button>
                    </div>
                </div>
            </dialog>
        `}attachEvents(){let e=this.querySelector(".booking-dialog"),t=this.querySelector("calendar-picker"),s=this.querySelector("#bookingTimePicker");t&&t.addEventListener("date-selected",o=>{this.selectedDate=o.detail.date,this.updateAvailableTimesForDate()}),s&&s.addEventListener("time-selected",o=>{this.selectedTime=o.detail.time}),this.querySelector(".close-booking-btn").addEventListener("click",()=>{this.close()}),this.querySelector(".confirm-booking-btn").addEventListener("click",()=>{this.confirmBooking()}),e.addEventListener("click",o=>{o.target===e&&this.close()})}updateAvailableTimesForDate(){let e=this.querySelector("#bookingTimePicker");if(!e)return;let t=this.getBookedTimesForDate(this.selectedDate);e.setAttribute("booked-times",JSON.stringify(t))}getBookedTimesForDate(e){try{let t=JSON.parse(localStorage.getItem("bookings")||"[]"),s=new Date(e).toISOString().split("T")[0];return t.filter(i=>{let n=new Date(i.date).toISOString().split("T")[0];return(i.salon===this.salonName||i.salonId===this.salonId)&&n===s&&i.status==="upcoming"}).map(i=>i.time)}catch(t){return console.error("Error getting booked times:",t),[]}}getDefaultTimes(){let e=[];for(let t=9;t<=22;t++)e.push(`${t.toString().padStart(2,"0")}:00`);return e}confirmBooking(){let e=this.querySelector("calendar-picker"),t=this.querySelector("#bookingTimePicker"),s=e?e.getSelectedDate():null,o=t?t.getSelectedTime():null;if(!s){p("\u041E\u0433\u043D\u043E\u043E\u0433\u043E\u043E \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");return}if(!o){p("\u0426\u0430\u0433\u0430\u0430 \u0441\u043E\u043D\u0433\u043E\u043D\u043E \u0443\u0443");return}let i={service:this.serviceName,category:this.serviceCategory,duration:this.serviceDuration,price:this.servicePrice,date:s.toISOString(),dateFormatted:s.toLocaleDateString("mn-MN"),time:o,salon:this.salonName,salonId:this.salonId};window.BookingManager?window.BookingManager.saveBooking(i)?(this.close(),setTimeout(()=>{window.BookingManager.navigateToProfile(),setTimeout(()=>{p("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0442\u0430\u043B\u0433\u0430\u0430\u0436\u0441\u0430\u043D")},400)},200)):this.close():p("\u0421\u0438\u0441\u0442\u0435\u043C \u0430\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430")}show(){this.querySelector(".booking-dialog").showModal()}close(){this.querySelector(".booking-dialog").close(),setTimeout(()=>{this.remove()},300)}};customElements.define("booking-dialog",H);var N=class extends HTMLElement{constructor(){super()}connectedCallback(){this.innerHTML=`
        <div class="header">
		<p id="paragraph-one">\u0413\u043E\u043E \u0421\u0430\u0439\u0445\u043D\u044B\u0433 </p>
		<p id="paragraph-two">\u041C\u044D\u0434\u044D\u0440</p>
		<div class="logo">
			<img src="./IMG/logo/woman.webp" class="logo-element" alt="woman">
        	<img src="./IMG/logo/eyelash.webp" class="logo-element" alt="eyelash">
			<img src="./IMG/logo/hair.webp" class="logo-element" alt="hair">
			<img src="./IMG/logo/manicure.webp" class="logo-element" alt="manicure">
			<img src="./IMG/logo/hand.webp" class="logo-element" alt="hand">
			<img src="./IMG/logo/pedicure.webp" class="logo-element" alt="pedicure">
			<img src="./IMG/logo/makeup.webp" class="logo-element" alt="makeup">
		</div>
        </div>
        `}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-header",N);var z=class extends HTMLElement{constructor(){super()}connectedCallback(){this.innerHTML=`
        <footer>
            <p>Created by @WEBAPPLICATIONTEAM</p>
        </footer>
        `}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-footer",z);var O=class extends HTMLElement{constructor(){super()}connectedCallback(){this.innerHTML=`
        <nav>
            <ul>
                <li>
					<a href="#/profile"><img src="./IMG/customer/profilepic.webp" alt="profile picture" width="35px" height="35px"/></a></li>   <!-- Profile -->
                <li>
					<a href="#/home">
						<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                		<path d="M2.36407 12.9579C1.98463 10.3208 1.79491 9.00229 2.33537 7.87495C2.87583 6.7476 4.02619 6.06234 6.32691 4.69181L7.71175 3.86687C9.80104 2.62229 10.8457 2 12 2C13.1543 2 14.199 2.62229 16.2882 3.86687L17.6731 4.69181C19.9738 6.06234 21.1242 6.7476 21.6646 7.87495C22.2051 9.00229 22.0154 10.3208 21.6359 12.9579L21.3572 14.8952C20.8697 18.2827 20.626 19.9764 19.451 20.9882C18.2759 22 16.5526 22 13.1061 22H10.8939C7.44737 22 5.72409 22 4.54903 20.9882C3.37396 19.9764 3.13025 18.2827 2.64284 14.8952L2.36407 12.9579Z" stroke="currentColor" stroke-width="1.5"/>
                		<path d="M12 15L12 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
					</a>
                </li>
                <li>
					<a href="#/info">
						<svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="20px" height="20px" viewBox="0 0 256 253" enable-background="new 0 0 256 253" xml:space="preserve">
<path d="M161.681,125.767V123.4h-16.795c-2.913,0.046-3.004-4.46,0-4.46h16.795v-2.23h-16.795c-2.913,0-3.004-4.46,0-4.506
	l20.3,0.046c4.142,0,6.645,3.823,6.645,6.827v90.866c0,6.554-10.15,6.645-10.104,0V177.29h-16.749c-2.958,0-3.004-4.506,0-4.506
	h16.749v-2.23h-16.749c-3.004,0-3.004-4.46,0-4.46h16.749v-2.23h-16.749c-3.004,0-3.004-4.506,0-4.46h16.749v-2.276h-16.749
	c-3.004,0.046-3.004-4.46,0-4.46h16.749v-2.23h-16.749c-2.958,0-3.004-4.46,0-4.46h16.749v-2.23h-16.749
	c-2.958,0-3.049-4.506,0-4.506h16.749v-0.091v-2.23h-16.749c-2.958,0-3.049-4.46,0-4.46h16.704v-2.23h-16.795
	c-2.913,0-3.004-4.506,0-4.46h16.84H161.681z M116.758,192.173v-29.63l-5.598-48.746c-0.182-1.32-0.956-1.639-1.73-1.639
	c-0.728,0-1.548,0.273-1.684,1.639l-5.462,48.746v29.63c-10.332-5.371-18.069,3.004-18.115,10.605
	c0.046,6.782,5.052,12.38,12.198,12.38c7.146-0.046,12.016-6.281,12.016-12.38v-29.767h2.276v29.767
	c0,7.055,5.735,12.289,11.834,12.289c7.692,0,12.562-5.416,12.562-12.243C135.1,195.131,127.09,186.802,116.758,192.173z
	 M96.231,208.968c-3.368,0-6.053-2.731-6.099-6.099c0.046-3.323,2.731-6.053,6.099-6.053s6.099,2.685,6.099,6.053
	C102.33,206.237,99.599,208.968,96.231,208.968z M122.993,208.968c-3.323,0-6.053-2.731-6.053-6.099
	c0-3.323,2.685-6.053,6.053-6.053s6.099,2.685,6.099,6.053C129.092,206.237,126.407,208.968,122.993,208.968z M2,69
	c0,13.678,9.625,25.302,22,29.576V233H2v18h252v-18h-22V98.554c12.89-3.945,21.699-15.396,22-29.554v-8H2V69z M65.29,68.346
	c0,6.477,6.755,31.47,31.727,31.47c21.689,0,31.202-19.615,31.202-31.47c0,11.052,7.41,31.447,31.464,31.447
	c21.733,0,31.363-20.999,31.363-31.447c0,14.425,9.726,26.416,22.954,30.154V233H42V98.594C55.402,94.966,65.29,82.895,65.29,68.346
	z M222.832,22H223V2H34v20L2,54h252L222.832,22z"/>
						</svg>
					</a>
                </li>   
                  
            </ul>
			<div class="logout" id="logoutBtn" style="cursor: pointer">
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
        </nav>
        `,this.attachEventListeners()}attachEventListeners(){let e=this.querySelector("#logoutBtn");e?e.addEventListener("click",t=>{this.handleLogout()}):console.error("\u274C Logout \u0442\u043E\u0432\u0447 \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439!")}async handleLogout(){if(console.log("\u{1F6AA} handleLogout \u0444\u0443\u043D\u043A\u0446 \u0434\u0443\u0443\u0434\u0430\u0433\u0434\u043B\u0430\u0430"),!confirm("\u0422\u0430 \u0433\u0430\u0440\u0430\u0445\u0434\u0430\u0430 \u0438\u0442\u0433\u044D\u043B\u0442\u044D\u0439 \u0431\u0430\u0439\u043D\u0430 \u0443\u0443?")){console.log("\u274C Logout \u0446\u0443\u0446\u043B\u0430\u0433\u0434\u043B\u0430\u0430");return}try{console.log("\u{1F4E1} Logout API \u0434\u0443\u0443\u0434\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...");let t=await fetch("http://localhost:3000/api/auth/logout",{method:"POST",credentials:"include"});console.log("\u{1F4E5} Response:",t),localStorage.removeItem("user"),localStorage.removeItem("token"),console.log("\u2705 localStorage \u0446\u044D\u0432\u044D\u0440\u043B\u044D\u0433\u0434\u043B\u044D\u044D"),console.log("\u{1F504} Login page \u0440\u0443\u0443 \u0448\u0438\u043B\u0436\u0438\u0436 \u0431\u0430\u0439\u043D\u0430..."),window.location.hash="#/login"}catch(t){console.error("\u274C Logout error:",t),alert("\u274C \u0413\u0430\u0440\u0430\u0445\u0430\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430")}}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("aside-nav",O);var P=class extends HTMLElement{constructor(){super()}connectedCallback(){this.innerHTML=`
            <salon-header></salon-header>
		    <order-outer></order-outer>
		    <salon-special-list></salon-special-list>
		    <artist-special-list></artist-special-list>
        `}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-home",P);var J=class extends HTMLElement{constructor(){super()}connectedCallback(){this.innerHTML=`
        <div class="info-main">
        <div class="main-top">
            <div class="tabs" id="salonTabs"></div>
            <div class="searchbar">
                <input type="text" placeholder="\u0425\u0430\u0439\u0445" oninput="handleSearch(this.value)">
                <button>
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>  
                </button>      
            </div>
        </div>
       
        <salon-all-list></salon-all-list>
        </div>
        `}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-info",J);var V=class extends HTMLElement{constructor(){super()}connectedCallback(){this.checkAndRender(),window.addEventListener("user-logged-in",()=>{this.checkAndRender()}),window.addEventListener("user-logged-out",()=>{this.checkAndRender()})}checkAndRender(){localStorage.getItem("user")?this.renderProfile():this.innerHTML="<salon-login></salon-login>"}renderProfile(){let e=JSON.parse(localStorage.getItem("user")||"{}");this.innerHTML=`
            <div class="profile-page">
                <div class="profile-grid">
                    <div class="bookings-section">
                        <booking-list></booking-list>
                    </div>
                    <div class="profile-card">
                        <img 
                            src="${e.avatar||"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"}" 
                            alt="Profile" 
                            class="profile-image">
                        
                        <div class="profile-name">${e.name||"\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447"}</div>
                        <ul class="profile-info">
                            <li>
                                <span class="label">\u0423\u0442\u0430\u0441</span>
                                <span class="value">${e.phone||"-"}</span>
                            </li>
                            <li>
                                <span class="label">Email</span>
                                <span class="value">${e.email||"-"}</span>
                            </li>
                        </ul>
                        <button class="edit-profile-btn" id="editProfileBtn">
                            \u0417\u0430\u0441\u0430\u0445
                        </button>
                        <button class="logout-btn" id="logoutBtn">
                            \u0413\u0430\u0440\u0430\u0445
                        </button>
                    </div>
                </div>
            </div>

            <dialog class="edit-dialog" id="editDialog">
                <div class="dialog-content">
                    <div class="dialog-header">
                        <h2>\u041F\u0440\u043E\u0444\u0430\u0439\u043B \u0437\u0430\u0441\u0430\u0445</h2>
                        <button class="close-dialog-btn" id="closeDialogBtn">\xD7</button>
                    </div>
                    
                    <form id="editForm">
                        <div class="form-group">
                            <label for="editName">\u041D\u044D\u0440</label>
                            <input type="text" id="editName" value="${e.name||""}" required>
                        </div>

                        <div class="form-group">
                            <label for="editPhone">\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440</label>
                            <div class="phone-group">
                                <select id="countryCode">
                                    <option value="+976" selected>+976</option>
                                    <option value="+1">+1</option>
                                    <option value="+86">+86</option>
                                    <option value="+82">+82</option>
                                </select>
                                <input type="tel" id="editPhone" value="${e.phone||""}" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="editEmail">Email</label>
                            <input type="email" id="editEmail" value="${e.email||""}" disabled>
                        </div>

                        <button type="submit" class="save-profile-btn">\u{1F4BE} \u0425\u0430\u0434\u0433\u0430\u043B\u0430\u0445</button>
                    </form>
                </div>
            </dialog>
        `,this.attachProfileEvents()}attachProfileEvents(){let e=this.querySelector("#editDialog"),t=this.querySelector("#editForm"),s=this.querySelector("#editProfileBtn"),o=this.querySelector("#closeDialogBtn"),i=this.querySelector("#logoutBtn");s?.addEventListener("click",()=>{e.showModal()}),o?.addEventListener("click",()=>{e.close()}),e?.addEventListener("click",n=>{n.target===e&&e.close()}),t?.addEventListener("submit",async n=>{n.preventDefault();let a=this.querySelector("#editName").value,r=this.querySelector("#editPhone").value,c=JSON.parse(localStorage.getItem("user")||"{}");try{let d=await fetch("http://localhost:3000/api/auth/update",{method:"PUT",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({name:a,phone:r,userId:c.id})}),g=await d.json();d.ok?(localStorage.setItem("user",JSON.stringify(g.user)),p("\u04E8\u04E9\u0440\u0447\u043B\u04E9\u043B\u0442 \u0430\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0445\u0430\u0434\u0433\u0430\u043B\u0430\u0433\u0434\u043B\u0430\u0430!"),e.close(),this.renderProfile()):p("\u0410\u043B\u0434\u0430\u0430: "+g.error)}catch(d){p("\u0421\u0435\u0440\u0432\u0435\u0440\u0442 \u0445\u043E\u043B\u0431\u043E\u0433\u0434\u043E\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439"),console.error("Update error:",d)}}),i?.addEventListener("click",()=>{confirm("\u0422\u0430 \u0441\u0438\u0441\u0442\u0435\u043C\u044D\u044D\u0441 \u0433\u0430\u0440\u0430\u0445\u0434\u0430\u0430 \u0438\u0442\u0433\u044D\u043B\u0442\u044D\u0439 \u0431\u0430\u0439\u043D\u0430 \u0443\u0443?")&&(localStorage.removeItem("user"),localStorage.removeItem("token"),window.dispatchEvent(new Event("user-logged-out")),p("\u0410\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0433\u0430\u0440\u043B\u0430\u0430"),setTimeout(()=>{window.location.hash="#/"},500))})}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-profile",V);var j=class extends HTMLElement{constructor(){super()}connectedCallback(){}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-route",j);var F=class extends HTMLElement{constructor(){super(),this.routes=new Map,this.protectedRoutes=new Set}urlBurtguul(e){this.routes.set(e.path,e.page),e.protected&&this.protectedRoutes.add(e.path),console.log("Routes:",this.routes),console.log("Protected:",this.protectedRoutes)}async navigate(e){let t=document.getElementById("content");t.innerHTML="",setTimeout(()=>{switch(e){case"#/":case"#/home":t.innerHTML="<salon-home></salon-home>";break;case"#/login":t.innerHTML="<salon-login></salon-login>";break;case"#/info":t.innerHTML="<salon-info></salon-info>";break;case"#/profile":t.innerHTML="<salon-profile></salon-profile>";break;default:t.innerHTML="<h1>404 - \u0425\u0443\u0443\u0434\u0430\u0441 \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439</h1>"}},10)}connectedCallback(){window.addEventListener("hashchange",async()=>{let t=window.location.hash;await this.navigate(t)});let e=window.location.hash||"#/";this.navigate(e)}async logout(){try{await fetch("http://localhost:3000/api/auth/logout",{method:"POST",credentials:"include"}),localStorage.removeItem("user"),localStorage.removeItem("token"),window.location.hash="#/login"}catch(e){console.error("Logout error:",e)}}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-router",F);var _=class extends HTMLElement{constructor(){super(),this.routes=new Map}urlBurtguul(e){this.routes.set(e.path,e.page),console.warn(this.routes)}connectedCallback(){console.log("ROUTES connected"),this.querySelectorAll("salon-route").forEach(e=>{let t=e.getAttribute("zam")??"/",s=e.getAttribute("com")??"salon-app",o=e.hasAttribute("protected");this.parentElement.urlBurtguul({path:t,page:s,protected:o})})}disconnectedCallback(){}attributeChangedCallback(e,t,s){}adoptedCallback(){}};window.customElements.define("salon-routes",_);var R=class extends HTMLElement{constructor(){super(),this.mode=this.getAttribute("mode")||"standalone"}connectedCallback(){this.render(),this.attachEvents()}render(){let e=this.mode==="modal";this.innerHTML=`
            <div class="auth-container ${e?"modal-style":"page-style"}">
                ${e?'<button class="close-modal-btn" id="closeModalBtn">\xD7</button>':""}
                
                <div class="logo">
                    <p>${e?"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0445\u0438\u0439\u0445\u0438\u0439\u043D \u0442\u0443\u043B\u0434 \u043D\u044D\u0432\u0442\u044D\u0440\u043D\u044D \u04AF\u04AF":""}</p>
                </div>
                
                <div class="tabs">
                    <div class="tab active" data-tab="login">\u041D\u044D\u0432\u0442\u0440\u044D\u0445</div>
                    <div class="tab" data-tab="register">\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445</div>
                </div>
                
                <div id="login-form" class="form-content active">
                    <form id="loginForm">
                        <div class="form-group">
                            <label>\u0418-\u043C\u044D\u0439\u043B \u0445\u0430\u044F\u0433</label>
                            <input type="email" id="login-email" placeholder="@gmail.com" required>
                        </div>
                        <div class="form-group">
                            <label>\u041D\u0443\u0443\u0446 \u04AF\u0433</label>
                            <input type="password" id="login-password"  required>
                        </div>
                        <button type="submit" class="btn">\u041D\u044D\u0432\u0442\u0440\u044D\u0445</button>
                        <div id="login-message" class="message"></div>
                    </form>
                </div>
                
                <div id="register-form" class="form-content">
                    <form id="registerForm">
                        <div class="form-group">
                            <label>\u041D\u044D\u0440</label>
                            <input type="text" id="register-name" required>
                        </div>
                        <div class="form-group">
                            <label>\u0418-\u043C\u044D\u0439\u043B \u0445\u0430\u044F\u0433</label>
                            <input type="email" id="register-email" placeholder="@gmail.com" required>
                        </div>
                        <div class="form-group">
                            <label>\u0423\u0442\u0430\u0441\u043D\u044B \u0434\u0443\u0433\u0430\u0430\u0440</label>
                            <input type="tel" id="register-phone">
                        </div>
                        <div class="form-group">
                            <label>\u041D\u0443\u0443\u0446 \u04AF\u0433</label>
                            <input type="password" id="register-password" placeholder="6-\u0430\u0430\u0441 \u0434\u044D\u044D\u0448 \u0442\u044D\u043C\u0434\u044D\u0433\u0442 \u043E\u0440\u0443\u0443\u043B\u043D\u0430 \u0443\u0443." required>
                        </div>
                        <div class="form-group">
                            <label>\u041D\u0443\u0443\u0446 \u04AF\u0433 \u0434\u0430\u0432\u0442\u0430\u0445</label>
                            <input type="password" id="register-confirm" required>
                        </div>
                        <button type="submit" class="btn">\u0411\u04AF\u0440\u0442\u0433\u04AF\u04AF\u043B\u044D\u0445</button>
                        <div id="register-message" class="message"></div>
                    </form>
                </div>
            </div>`}attachEvents(){let e="http://localhost:3000",t=this.querySelector("#closeModalBtn");t&&t.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("close-modal",{bubbles:!0,composed:!0}))}),this.querySelectorAll(".tab").forEach(s=>{s.addEventListener("click",()=>{this.querySelectorAll(".tab").forEach(i=>i.classList.remove("active")),this.querySelectorAll(".form-content").forEach(i=>i.classList.remove("active")),s.classList.add("active");let o=s.dataset.tab+"-form";this.querySelector(`#${o}`).classList.add("active")})}),this.querySelector("#loginForm").addEventListener("submit",async s=>{s.preventDefault(),await this.handleLogin(e)}),this.querySelector("#registerForm").addEventListener("submit",async s=>{s.preventDefault(),await this.handleRegister(e)})}async handleLogin(e){let t=this.querySelector("#login-email").value,s=this.querySelector("#login-password").value,o=this.querySelector("#login-message");try{let i=await fetch(`${e}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({email:t,password:s})}),n=await i.json();i.ok?(o.className="message success show",o.textContent=n.message,localStorage.setItem("user",JSON.stringify(n.user)),localStorage.setItem("token",n.token),window.dispatchEvent(new Event("user-logged-in")),this.dispatchEvent(new CustomEvent("auth-success",{detail:{user:n.user},bubbles:!0,composed:!0})),this.mode==="standalone"&&setTimeout(()=>{window.location.hash="#/profile"},1e3)):(o.className="message error show",o.textContent=n.error)}catch(i){o.className="message error show",o.textContent="\u0421\u0435\u0440\u0432\u0435\u0440\u0442 \u0445\u043E\u043B\u0431\u043E\u0433\u0434\u043E\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439",console.error("Login error:",i)}}async handleRegister(e){let t=this.querySelector("#register-name").value,s=this.querySelector("#register-email").value,o=this.querySelector("#register-phone").value,i=this.querySelector("#register-password").value,n=this.querySelector("#register-confirm").value,a=this.querySelector("#register-message");if(i!==n){a.className="message error show",a.textContent="\u041D\u0443\u0443\u0446 \u04AF\u0433 \u0442\u0430\u0430\u0440\u0430\u0445\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430";return}if(i.length<6){a.className="message error show",a.textContent="\u041D\u0443\u0443\u0446 \u04AF\u0433 6-\u0430\u0430\u0441 \u0434\u044D\u044D\u0448 \u0442\u044D\u043C\u0434\u044D\u0433\u0442 \u0431\u0430\u0439\u0445 \u0451\u0441\u0442\u043E\u0439";return}try{let r=await fetch(`${e}/api/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({name:t,email:s,password:i,phone:o})}),c=await r.json();r.ok?(a.className="message success show",a.textContent=c.message,localStorage.setItem("user",JSON.stringify(c.user)),localStorage.setItem("token",c.token),window.dispatchEvent(new Event("user-logged-in")),this.dispatchEvent(new CustomEvent("auth-success",{detail:{user:c.user},bubbles:!0,composed:!0})),this.mode==="standalone"&&setTimeout(()=>{window.location.hash="#/profile"},1e3)):(a.className="message error show",a.textContent=c.error||c.errors[0].msg)}catch(r){a.className="message error show",a.textContent="\u0421\u0435\u0440\u0432\u0435\u0440\u0442 \u0445\u043E\u043B\u0431\u043E\u0433\u0434\u043E\u0436 \u0447\u0430\u0434\u0441\u0430\u043D\u0433\u04AF\u0439",console.error("Register error:",r)}}};customElements.define("auth-form",R);var Z=class extends HTMLElement{constructor(){super()}connectedCallback(){this.render(),this.attachEvents(),this.show()}render(){this.innerHTML=`
            <dialog class="login-modal-dialog" id="loginModalDialog">
                <auth-form mode="modal"></auth-form>
            </dialog>`}attachEvents(){let e=this.querySelector("#loginModalDialog"),t=this.querySelector("auth-form");e.addEventListener("click",s=>{s.target===e&&this.close()}),t.addEventListener("close-modal",()=>{this.close()}),t.addEventListener("auth-success",()=>{this.close(),setTimeout(()=>{window.BookingManager&&window.BookingManager.showNotification("\u0410\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u043D\u044D\u0432\u0442\u044D\u0440\u043B\u044D\u044D!","success")},300)})}show(){let e=this.querySelector("#loginModalDialog");setTimeout(()=>e.showModal(),100)}close(){this.querySelector("#loginModalDialog").close(),setTimeout(()=>this.remove(),300)}};customElements.define("login-modal",Z);var U=class extends HTMLElement{constructor(){super()}connectedCallback(){this.render()}render(){this.innerHTML='<auth-form mode="standalone"></auth-form>'}};customElements.define("salon-login",U);var Y=class extends HTMLElement{constructor(){super(),this.bookings=[],this.filter="all"}connectedCallback(){this.loadBookings(),this.render(),this.attachEvents(),window.addEventListener("booking-added",()=>{this.loadBookings(),this.render(),this.attachEvents()}),this.addEventListener("booking-action",e=>{let{action:t,bookingId:s}=e.detail;t==="delete"?this.deleteBooking(s):t==="complete"&&this.completeBooking(s)})}static get observedAttributes(){return["filter"]}attributeChangedCallback(e,t,s){e==="filter"&&t!==s&&(this.filter=s,this.render(),this.attachEvents())}loadBookings(){try{let e=JSON.parse(localStorage.getItem("user")||"{}"),t=e.id||e.email||"anonymous",s=JSON.parse(localStorage.getItem("bookings")||"[]");this.bookings=s.filter(o=>o.userId===t),this.bookings.sort((o,i)=>new Date(i.timestamp)-new Date(o.timestamp))}catch{this.bookings=[]}}isBookingPast(e){let t=new Date,s=new Date(e.date);if(e.time){let[o,i]=e.time.split(":").map(Number);s.setHours(o,i,0,0)}return s<t}autoCompleteExpiredBookings(){try{let e=JSON.parse(localStorage.getItem("bookings")||"[]"),t=!1;e=e.map(s=>(s.status==="upcoming"||!s.status)&&this.isBookingPast(s)?(t=!0,{...s,status:"completed",autoCompletedAt:new Date().toISOString()}):s),t&&localStorage.setItem("bookings",JSON.stringify(e))}catch(e){console.error("Error auto-completing bookings:",e)}}getFilteredBookings(){switch(this.autoCompleteExpiredBookings(),this.loadBookings(),this.filter){case"all":return this.bookings.filter(e=>(e.status==="upcoming"||!e.status)&&!this.isBookingPast(e));case"history":return this.bookings.filter(e=>e.status==="completed"||e.status==="cancelled"||this.isBookingPast(e));default:return this.bookings}}render(){let e=this.getFilteredBookings();this.innerHTML=`
            <div class="booking-list-container">
                <div class="booking-list-header">
                    <h2 class="booking-list-title">\u041C\u0438\u043D\u0438\u0439 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0443\u0443\u0434</h2>
                </div>

                <div id="bookingTabs" class="filter-tabs">
                    <button class="tab ${this.filter==="all"?"active":""}" data-tab="all">
                        \u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 
                    </button>
                    <button class="tab ${this.filter==="history"?"active":""}" data-tab="history">
                        \u0417\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u043D \u0442\u04AF\u04AF\u0445 
                    </button>
                </div>

                <div class="bookings-grid">
                    ${e.length>0?e.map(t=>this.renderBookingCard(t)).join(""):this.renderEmptyState()}
                </div>
            </div>
        `}renderBookingCard(e){return`<booking-card booking-data='${JSON.stringify(e)}'></booking-card>`}renderEmptyState(){let e={all:"\u0422\u0430\u043D\u0434 \u043E\u0434\u043E\u043E\u0433\u043E\u043E\u0440 \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430",history:"\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u043D \u0442\u04AF\u04AF\u0445 \u0431\u0430\u0439\u0445\u0433\u04AF\u0439 \u0431\u0430\u0439\u043D\u0430"};return`
            <div class="empty-state">
                <div class="empty-icon">${{all:"",history:""}[this.filter]}</div>
                <div class="empty-title">\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u043E\u043B\u0434\u0441\u043E\u043D\u0433\u04AF\u0439</div>
                <div class="empty-message">${e[this.filter]}</div>
            </div>
        `}attachEvents(){this.querySelectorAll(".tab").forEach(e=>{e.addEventListener("click",t=>{this.querySelectorAll(".tab").forEach(o=>o.classList.remove("active")),t.currentTarget.classList.add("active");let s=t.currentTarget.dataset.tab;this.filter=s,this.render(),this.attachEvents()})})}deleteBooking(e){if(confirm("\u0422\u0430 \u044D\u043D\u044D \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u044B\u0433 \u0443\u0441\u0442\u0433\u0430\u0445\u0434\u0430\u0430 \u0438\u0442\u0433\u044D\u043B\u0442\u044D\u0439 \u0431\u0430\u0439\u043D\u0430 \u0443\u0443?"))try{let t=JSON.parse(localStorage.getItem("bookings")||"[]");t=t.filter(s=>s.id!==e),localStorage.setItem("bookings",JSON.stringify(t)),this.loadBookings(),this.render(),this.attachEvents(),p("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0443\u0441\u0442\u0433\u0430\u0433\u0434\u043B\u0430\u0430"),window.dispatchEvent(new CustomEvent("booking-deleted",{detail:{bookingId:e}}))}catch{p("\u0410\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430")}}completeBooking(e){try{let t=JSON.parse(localStorage.getItem("bookings")||"[]"),s=t.findIndex(o=>o.id===e);s!==-1&&(t[s].status="completed",t[s].completedAt=new Date().toISOString(),localStorage.setItem("bookings",JSON.stringify(t)),this.loadBookings(),this.render(),this.attachEvents(),window.dispatchEvent(new CustomEvent("booking-completed",{detail:{bookingId:e}})))}catch{p("\u0410\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430")}}};customElements.define("booking-list",Y);var X=class extends HTMLElement{constructor(){super(),this.booking=null}connectedCallback(){let e=this.getAttribute("booking-data");if(e)try{this.booking=JSON.parse(e),this.render(),this.attachEvents()}catch(t){console.error("Error parsing booking data:",t),this.innerHTML='<div class="error">\u0410\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430</div>'}}formatPrice(e){if(!e)return"";if(e.toString().includes("\u20AE"))return e;let t=typeof e=="number"?e:parseFloat(e.replace(/[^\d]/g,""));return isNaN(t)?e:`${t.toLocaleString("en-US")}\u20AE`}render(){if(!this.booking)return;let t=(this.booking.status||"upcoming")==="upcoming",s=this.booking.location||this.booking.salon||"\u0411\u0430\u0439\u0440\u0448\u0438\u043B \u0442\u043E\u0434\u043E\u0440\u0445\u043E\u0439\u0433\u04AF\u0439",o=this.booking.service||"\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D";this.booking.subService&&this.booking.subService!==this.booking.service&&(o=`${this.booking.service} - ${this.booking.subService}`);let i=this.booking.time||"-",n=this.formatPrice(this.booking.price);this.innerHTML=`
            <div class="booking-card-compact" data-booking-id="${this.booking.id}">
                <div class="card-left">
                    <div class="salon-name">${this.booking.salon||"Beauty Salon"}</div>
                </div>
                
                <div class="card-right">
                    <div class="booking-info">
                        <div class="info-row">
                            <span class="label">\u0411\u0430\u0439\u0440\u0448\u0438\u043B:</span>
                            <span class="value">${s}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D:</span>
                            <span class="value">${o}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">\u041E\u043D \u0441\u0430\u0440, \u0446\u0430\u0433:</span>
                            <span class="value">${this.booking.dateFormatted||""} ${i}</span>
                        </div>
                        ${n?`
                        <div class="info-row price-row">
                            <span class="label">\u04AE\u043D\u044D:</span>
                            <span class="value price-value">${n}</span>
                        </div>
                        `:""}
                    </div>
                    
                    ${t?`
                        <div class="card-actions">
                            <button class="action-icon" data-action="complete" data-id="${this.booking.id}" title="\u0414\u0443\u0443\u0441\u0441\u0430\u043D">
                                \u2713
                            </button>
                            <button class="action-icon" data-action="delete" data-id="${this.booking.id}" title="\u0423\u0441\u0442\u0433\u0430\u0445">
                                \u{1F5D1}
                            </button>
                        </div>
                    `:`
                        <div class="card-actions">
                            <button class="action-btn btn-reorder" data-action="reorder" data-id="${this.booking.id}">
                                \u0414\u0430\u0445\u0438\u043D \u0437\u0430\u0445\u0438\u0430\u043B\u0430\u0445
                            </button>
                            <button class="action-icon" data-action="delete" data-id="${this.booking.id}" title="\u0423\u0441\u0442\u0433\u0430\u0445">
                                \u{1F5D1}
                            </button>
                        </div>
                    `}
                </div>
            </div>

            <style>
                booking-card {
                    display: block;
                    width: 100%;
                }

                .booking-card-compact {
                    background: #fce4ec;
                    border-radius: 25px;
                    padding: 16px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(236, 64, 122, 0.15);
                    margin-bottom: 12px;
                }

                .booking-card-compact:hover {
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(236, 64, 122, 0.25);
                }

                .card-left {
                    flex-shrink: 0;
                    min-width: 120px;
                }

                .salon-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                    font-style: italic;
                }

                .card-right {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                }

                .booking-info {
                    flex: 1;
                }

                .info-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 4px;
                    font-size: 14px;
                }

                .info-row:last-child {
                    margin-bottom: 0;
                }

                .label {
                    font-weight: 600;
                    color: #2c3e50;
                    font-style: italic;
                    min-width: 90px;
                }

                .value {
                    color: #555;
                    flex: 1;
                }

                .price-row {
                    margin-top: 6px;
                    padding-top: 6px;
                    border-top: 1px solid rgba(236, 64, 122, 0.2);
                }

                .price-value {
                    font-weight: 700;
                    color: #fc8eac;
                    font-size: 15px;
                }

                .card-actions {
                    display: flex;
                    gap: 8px;
                    flex-shrink: 0;
                    align-items: center;
                }

                .action-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                }

                .btn-reorder {
                    background: linear-gradient(135deg, #fc8eac 0%, #f594b6 100%);
                    color: white;
                    box-shadow: 0 2px 8px rgba(252, 142, 172, 0.3);
                }

                .btn-reorder:hover {
                    background: linear-gradient(135deg, #f594b6 0%, #fc8eac 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(252, 142, 172, 0.4);
                }

                .btn-reorder:active {
                    transform: translateY(0);
                }

                .action-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    transition: all 0.3s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .action-icon:hover {
                    background: white;
                    transform: scale(1.1);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                .action-icon:active {
                    transform: scale(0.95);
                }

                /* Mobile responsive */
                @media (max-width: 768px) {
                    .booking-card-compact {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 16px;
                    }

                    .card-left {
                        width: 100%;
                        margin-bottom: 8px;
                    }

                    .card-right {
                        width: 100%;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .booking-info {
                        width: 100%;
                    }

                    .card-actions {
                        width: 100%;
                        justify-content: flex-end;
                    }

                    .salon-name {
                        font-size: 16px;
                    }

                    .info-row {
                        font-size: 13px;
                    }

                    .label {
                        min-width: 80px;
                    }
                }

                @media (max-width: 480px) {
                    .info-row {
                        flex-direction: column;
                        gap: 2px;
                    }
                    
                    .label {
                        min-width: auto;
                    }
                }
            </style>
        `}attachEvents(){this.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let s=t.currentTarget.dataset.action,o=t.currentTarget.dataset.id;s==="reorder"?this.handleReorder(o):this.dispatchEvent(new CustomEvent("booking-action",{detail:{action:s,bookingId:o},bubbles:!0,composed:!0}))})}),this.querySelector(".booking-card-compact")?.addEventListener("click",()=>{console.log("Card clicked:",this.booking)})}handleReorder(e){let t=this.booking;if(confirm(`"${t.salon}" \u0441\u0430\u043B\u043E\u043D\u0434 "${t.service}" \u04AF\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D\u0433 \u0434\u0430\u0445\u0438\u043D \u0437\u0430\u0445\u0438\u0430\u043B\u0430\u0445 \u0443\u0443?`)){let s=document.createElement("booking-dialog");s.setAttribute("service-name",t.service||""),s.setAttribute("service-category",t.category||""),s.setAttribute("service-duration",t.duration||"");let o=this.formatPrice(t.price);s.setAttribute("service-price",o),s.setAttribute("salon-name",t.salon||""),s.setAttribute("salon-id",t.salonId||t.salon||"");let i=this.getSalonWorkingDays(t.salonId);s.setAttribute("available-days",JSON.stringify(i)),s.setAttribute("min-date",new Date().toISOString());let n=this.generateAvailableTimes();s.setAttribute("available-times",JSON.stringify(n)),document.body.appendChild(s),setTimeout(()=>{s.show(),console.log("\u2705 Dialog shown")},100),this.showNotification("\u{1F504} \u0414\u0430\u0445\u0438\u043D \u0437\u0430\u0445\u0438\u0430\u043B\u0430\u0445 \u0446\u043E\u043D\u0445 \u043D\u044D\u044D\u0433\u0434\u044D\u0436 \u0431\u0430\u0439\u043D\u0430...","success"),this.dispatchEvent(new CustomEvent("booking-reorder",{detail:{originalBooking:t},bubbles:!0,composed:!0}))}}getSalonWorkingDays(e){return["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]}generateAvailableTimes(){let e=[];for(let t=9;t<=22;t++)e.push(`${t.toString().padStart(2,"0")}:00`);return e}showNotification(e,t="success"){let s=document.querySelector(".booking-card-notification");s&&s.remove();let o=document.createElement("div");o.className=`booking-card-notification notification-${t}`,o.textContent=e,o.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${t==="success"?"#fc8eac":"#ff5252"};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(252, 142, 172, 0.4);
            z-index: 10001;
            font-family: system-ui;
            font-size: 14px;
            font-weight: 600;
        `,document.body.appendChild(o),setTimeout(()=>o.remove(),3e3)}updateCard(e){this.booking=e,this.render(),this.attachEvents()}};customElements.define("booking-card",X);var W=class l{static checkAuth(){return!!localStorage.getItem("user")}static showAuthPrompt(){let e=document.createElement("login-modal");document.body.appendChild(e)}static openBookingDialog(e){if(console.log("\u{1F3AB} Opening booking dialog:",e),!l.checkAuth()){l.showAuthPrompt();return}if(!e.serviceName||!e.salonName){p("\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D\u043D\u0438\u0439 \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B \u0434\u0443\u0442\u0443\u0443 \u0431\u0430\u0439\u043D\u0430");return}let t=document.createElement("booking-dialog");t.setAttribute("service-name",e.serviceName),t.setAttribute("service-category",e.serviceCategory||"\u04AE\u0439\u043B\u0447\u0438\u043B\u0433\u044D\u044D"),t.setAttribute("service-duration",e.serviceDuration||""),t.setAttribute("service-price",e.servicePrice||""),t.setAttribute("salon-name",e.salonName),t.setAttribute("salon-id",e.salonId||e.salonName),t.setAttribute("available-dates",JSON.stringify(e.availableDates||[])),t.setAttribute("available-times",JSON.stringify(e.availableTimes||[])),document.body.appendChild(t)}static getBookings(){try{return JSON.parse(localStorage.getItem("bookings")||"[]")}catch{return[]}}static getUserBookings(){try{let e=JSON.parse(localStorage.getItem("user")||"{}"),t=e.id||e.email||"anonymous";return JSON.parse(localStorage.getItem("bookings")||"[]").filter(o=>o.userId===t)}catch{return[]}}static getBookedTimesForDate(e,t){try{let s=l.getBookings(),o=new Date(e).toISOString().split("T")[0];return s.filter(i=>{let n=new Date(i.date).toISOString().split("T")[0];return(i.salonId===t||i.salon===t)&&n===o&&i.status==="upcoming"}).map(i=>i.time)}catch{return[]}}static isPastDate(e){let t=new Date;t.setHours(0,0,0,0);let s=new Date(e);return s.setHours(0,0,0,0),s<t}static getPastTimesForDate(e,t){let s=new Date;s.setHours(0,0,0,0);let o=new Date(e);if(o.setHours(0,0,0,0),o.getTime()!==s.getTime())return[];let i=new Date,n=i.getHours(),a=i.getMinutes();return t.filter(r=>{let[c,d]=r.split(":").map(Number);return c<n||c===n&&d<=a})}static navigateToProfile(){window.location.hash="#/profile",setTimeout(()=>{window.scrollTo({top:0,behavior:"smooth"})},100)}static showNotification(e,t=3e3,s="top-right"){p(e,t,s)}static saveBooking(e){try{let t=JSON.parse(localStorage.getItem("user")||"{}");if(!t.id&&!t.email)return document.querySelectorAll("booking-dialog").forEach(a=>{a.remove()}),l.showAuthPrompt(),null;let s=t.id||t.email,o=JSON.parse(localStorage.getItem("bookings")||"[]");if(o.some(a=>a.userId===s&&a.date===e.date&&a.time===e.time&&a.salonId===e.salonId&&a.service===e.service&&a.status==="upcoming"))return console.warn("Duplicate booking"),p("\u042D\u043D\u044D \u0446\u0430\u0433\u0442 \u0430\u043B\u044C \u0445\u044D\u0434\u0438\u0439\u043D \u0437\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0445\u0438\u0439\u0441\u044D\u043D \u0431\u0430\u0439\u043D\u0430"),null;let n={id:Date.now().toString()+"-"+Math.random().toString(36).substr(2,9),userId:s,userName:t.name||"\u0425\u044D\u0440\u044D\u0433\u043B\u044D\u0433\u0447",...e,timestamp:new Date().toISOString(),status:"upcoming"};return o.push(n),localStorage.setItem("bookings",JSON.stringify(o)),p("\u0417\u0430\u0445\u0438\u0430\u043B\u0433\u0430 \u0430\u043C\u0436\u0438\u043B\u0442\u0442\u0430\u0439 \u0445\u0430\u0434\u0433\u0430\u043B\u0430\u0433\u0434\u043B\u0430\u0430"),window.dispatchEvent(new CustomEvent("booking-added",{detail:n})),n}catch{return p("\u0421\u0438\u0441\u0442\u0435\u043C\u0434 \u0430\u043B\u0434\u0430\u0430 \u0433\u0430\u0440\u043B\u0430\u0430"),null}}};window.BookingManager=W;})();
