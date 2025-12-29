export class SalonRouter extends HTMLElement {
    constructor() {
        super();
        this.routes = new Map();
        this.protectedRoutes = new Set();
    }
    
    urlBurtguul(route) {
        this.routes.set(route.path, route.page);
        
        if (route.protected) {
            this.protectedRoutes.add(route.path);
        }
        
        console.log('Routes:', this.routes);
        console.log('Protected:', this.protectedRoutes);
    }

    async navigate(hash) {
        const target = document.getElementById('content');
        
        // ✅ Өмнөх content-ийг БҮРЭН устгах
        target.innerHTML = '';
        
        // ✅ 10ms delay өгөөд шинэ component үүсгэх (browser-д render хийх цаг өгнө)
        setTimeout(() => {
            switch(hash) {
                case '#/':
                case '#/home':
                    target.innerHTML = `<salon-home></salon-home>`;
                    break;
                case '#/login':
                    target.innerHTML = `<salon-login></salon-login>`;
                    break;
                case '#/info':
                    target.innerHTML = `<salon-info></salon-info>`;
                    break;
                case '#/profile':
                    target.innerHTML = `<salon-profile></salon-profile>`;
                    break;
                default:
                    target.innerHTML = `<h1>404 - Хуудас олдсонгүй</h1>`;
            }
        }, 10);
    }
    
    connectedCallback() {
        // ✅ Hash өөрчлөгдөхөд
        window.addEventListener('hashchange', async () => {
            const hash = window.location.hash;
            await this.navigate(hash);
        });
        
        const initialHash = window.location.hash || '#/';
        this.navigate(initialHash);
    }
    
    async logout() {
    try {
        await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        // ✅ User болон Token устгах
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        window.location.hash = '#/login';
    } catch (error) {
        console.error('Logout error:', error);
    }
}
    
    disconnectedCallback() {
    }
    
    attributeChangedCallback(name, oldVal, newVal) {
    }
    
    adoptedCallback() {
    }
}

window.customElements.define('salon-router', SalonRouter);