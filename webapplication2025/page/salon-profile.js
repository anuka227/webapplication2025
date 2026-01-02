import { showNotification } from '../salon-notification.js';

class SalonProfile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.checkAndRender();
        
        window.addEventListener('user-logged-in', () => {
            this.checkAndRender();
        });
        
        window.addEventListener('user-logged-out', () => {
            this.checkAndRender();
        });
    }
    
    checkAndRender() {
        const user = localStorage.getItem('user');
        
        if (!user) {
            this.innerHTML = '<salon-login></salon-login>';
        } else {
            this.renderProfile();
        }
    }

    renderProfile() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const safeName = sanitizeText(user.name || 'Хэрэглэгч', 100);

        this.innerHTML = /*html*/`
            <div class="profile-page">
                <div class="profile-grid">
                    <div class="bookings-section">
                        <booking-list></booking-list>
                    </div>
                    <div class="profile-card">
                        <img 
                            src="${user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'}" 
                            alt="Profile" 
                            class="profile-image">
                        
                        <div class="profile-name">${safeName}</div>
                        <ul class="profile-info">
                            <li>
                                <span class="label">Утас</span>
                                <span class="value">${user.phone || '-'}</span>
                            </li>
                            <li>
                                <span class="label">Email</span>
                                <span class="value">${user.email || '-'}</span>
                            </li>
                        </ul>
                        <button class="edit-profile-btn" id="editProfileBtn">
                            Засах
                        </button>
                        <button class="logout-btn" id="logoutBtn">
                            Гарах
                        </button>
                    </div>
                </div>
            </div>

            <dialog class="edit-dialog" id="editDialog">
                <div class="dialog-content">
                    <div class="dialog-header">
                        <h2>Профайл засах</h2>
                        <button class="close-dialog-btn" id="closeDialogBtn">×</button>
                    </div>
                    
                    <form id="editForm">
                        <div class="form-group">
                            <label for="editName">Нэр</label>
                            <input type="text" id="editName" value="${user.name || ''}" required>
                        </div>

                        <div class="form-group">
                            <label for="editPhone">Утасны дугаар</label>
                            <div class="phone-group">
                                <select id="countryCode">
                                    <option value="+976" selected>+976</option>
                                    <option value="+1">+1</option>
                                    <option value="+86">+86</option>
                                    <option value="+82">+82</option>
                                </select>
                                <input type="tel" id="editPhone" value="${user.phone || ''}" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="editEmail">Email</label>
                            <input type="email" id="editEmail" value="${user.email || ''}" disabled>
                        </div>

                        <button type="submit" class="save-profile-btn">💾 Хадгалах</button>
                    </form>
                </div>
            </dialog>
        `;

        this.attachProfileEvents();
    }

    attachProfileEvents() {
        const editDialog = this.querySelector('#editDialog');
        const editForm = this.querySelector('#editForm');
        const editProfileBtn = this.querySelector('#editProfileBtn');
        const closeDialogBtn = this.querySelector('#closeDialogBtn');
        const logoutBtn = this.querySelector('#logoutBtn');

        editProfileBtn?.addEventListener('click', () => {
            editDialog.showModal();
        });

        closeDialogBtn?.addEventListener('click', () => {
            editDialog.close();
        });

        editDialog?.addEventListener('click', (e) => {
            if (e.target === editDialog) {
                editDialog.close();
            }
        });

        editForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = this.querySelector('#editName').value;
            const phone = this.querySelector('#editPhone').value;
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            try {
                const response = await fetch('http://localhost:3000/api/auth/update', {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        name, 
                        phone,
                        userId: user.id  
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showNotification('Өөрчлөлт амжилттай хадгалагдлаа!');
                    
                    editDialog.close();
                    this.renderProfile();
                } else {
                    showNotification('Алдаа: ' + data.error);
                }
            } catch (error) {
                showNotification('Серверт холбогдож чадсангүй');
                console.error('Update error:', error);
            }
        });

        logoutBtn?.addEventListener('click', () => {
            if (confirm('Та системээс гарахдаа итгэлтэй байна уу?')) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                
                window.dispatchEvent(new Event('user-logged-out'));
                
                showNotification('Амжилттай гарлаа');
                
                setTimeout(() => {
                    window.location.hash = '#/';
                }, 500);
            }
        });
    }
    disconnectedCallback() {}
    attributeChangedCallback(name, oldVal, newVal) {}
    adoptedCallback() {}
}

window.customElements.define('salon-profile', SalonProfile);