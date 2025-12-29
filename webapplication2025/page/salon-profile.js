class SalonProfile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log('🔍 salon-profile ачаалагдлаа');
        this.checkAndRender();
    }
    
    checkAndRender() {
        const user = localStorage.getItem('user');
        
        console.log('👤 localStorage user:', user);
        
        if (!user) {
            console.log('❌ Нэвтрээгүй → salon-login');
            this.innerHTML = '<salon-login></salon-login>';
        } else {
            console.log('✅ Нэвтэрсэн → profile-info');
            this.innerHTML = '<profile-info></profile-info>';
        }
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }
}

window.customElements.define('salon-profile', SalonProfile);