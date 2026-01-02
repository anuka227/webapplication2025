import { showNotification } from '../salon-notification.js';
import { sanitizeText, sanitizeEmail, sanitizePhone, sanitizeURL, escapeAttr } from '../sanitize.js';
class SalonProfile extends HTMLElement {
    constructor() {
        super();
    }

renderProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Extract phone without country code for display in edit form
    let phoneForEdit = user.phone || '';
    if (phoneForEdit.startsWith('+976')) {
        phoneForEdit = phoneForEdit.substring(4); // Remove +976
    } else if (phoneForEdit.startsWith('+')) {
        // Find where digits start after country code
        const match = phoneForEdit.match(/^\+\d+/);
        if (match) {
            phoneForEdit = phoneForEdit.substring(match[0].length);
        }
    }
    
    const safeName = window.sanitize.escapeHTML(user.name || 'Хэрэглэгч');
    const safeEmail = window.sanitize.sanitizeEmail(user.email || '');
    const safePhone = window.sanitize.sanitizePhone(user.phone || '');
    
    this.innerHTML = /*html*/`
        <div class="profile-page">
            <div class="profile-grid">
                <div class="bookings-section">
                    <booking-list></booking-list>
                </div>
                <div class="profile-card">
                    <img 
                        src="${window.sanitize.sanitizeURL(user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop')}" 
                        alt="Profile" 
                        class="profile-image">
                    
                    <div class="profile-name">${safeName}</div>
                    <ul class="profile-info">
                        <li>
                            <span class="label">Утас</span>
                            <span class="value">${safePhone || '-'}</span>
                        </li>
                        <li>
                            <span class="label">Email</span>
                            <span class="value">${safeEmail || '-'}</span>
                        </li>
                    </ul>
                    <button class="edit-profile-btn" id="editProfileBtn">Засах</button>
                    <button class="logout-btn" id="logoutBtn">Гарах</button>
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
                        <input type="text" id="editName" value="${window.sanitize.escapeAttr(user.name || '')}" required>
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
                            <input type="tel" id="editPhone" value="${window.sanitize.escapeAttr(phoneForEdit)}" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="editEmail">Email</label>
                        <input type="email" id="editEmail" value="${window.sanitize.escapeAttr(user.email || '')}" disabled>
                    </div>

                    <button type="submit" class="save-profile-btn">Хадгалах</button>
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
    const name = window.sanitize.sanitizeText(this.querySelector('#editName').value);
    let phoneInput = window.sanitize.sanitizePhone(this.querySelector('#editPhone').value);
    const countryCode = this.querySelector('#countryCode').value;
    
    if (phoneInput.startsWith('+')) {
        phoneInput = phoneInput.replace(/^\+\d+/, '');
    }
    
    const fullPhone = countryCode + phoneInput;
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        showNotification('Та дахин нэвтэрнэ үү');
        setTimeout(() => window.location.hash = '#/', 1000);
        return;
    }

    if (!name) {
        showNotification('Нэр оруулна уу');
        return;
    }

    if (!phoneInput) {
        showNotification('Утасны дугаар оруулна уу');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/update', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({ name, phone: fullPhone })
        });
        const data = await response.json();
        if (response.ok) {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
                ...currentUser,
                id: data.user.id,
                name: data.user.name,
                phone: data.user.phone,
                email: data.user.email
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            showNotification('Амжилттай шинэчлэгдлээ!');
            editDialog.close();
            this.renderProfile();
        } else {
            console.error('Update failed:', data);
            showNotification('Алдаа: ' + (data.error || 'Шинэчлэх боломжгүй'));
        }
    } catch (error) {
        showNotification('Серверт холбогдох алдаа');
    }
});

        logoutBtn?.addEventListener('click', () => {
            if (confirm('Та системээс гарахдаа итгэлтэй байна уу?')) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('user-logged-out'));
                showNotification('Амжилттай гарлаа');
                setTimeout(() => window.location.hash = '#/', 500);
            }
        });
    }

    connectedCallback() {
        this.checkAndRender();
        window.addEventListener('user-logged-in', () => this.checkAndRender());
        window.addEventListener('user-logged-out', () => this.checkAndRender());
    }
    
    checkAndRender() {
        const user = localStorage.getItem('user');
        if (!user) {
            this.innerHTML = '<salon-login></salon-login>';
        } else {
            this.renderProfile();
        }
    }

    disconnectedCallback() {}
    attributeChangedCallback(name, oldVal, newVal) {}
    adoptedCallback() {}
}

window.customElements.define('salon-profile', SalonProfile);