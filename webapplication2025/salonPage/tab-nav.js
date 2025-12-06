class TabNav extends HTMLElement {
    constructor() {
        super();
        this.currentTab = 'salon';
    }

    connectedCallback() {
        this.render();
        this.setupGlobalFunction();
    }

    render() {
        this.innerHTML = `
            <div class="tab-navigation">
                <div class="tabs">
                    <button class="tab active" onclick="switchTab('salon')">
                        Салон
                    </button>
                    <button class="tab" onclick="switchTab('artist')">
                        Артист
                    </button>
                </div>

                <div class="tab-content">
                    <div id="salon-panel" class="tab-panel active">
                        <salon-all-list></salon-all-list>
                    </div>

                    <div id="artist-panel" class="tab-panel">
                        <artist-special-list></artist-special-list>
                        <artist-all-list></artist-all-list>
                    </div>
                </div>
            </div>
        `;
    }

    setupGlobalFunction() {
       
        window.switchTab = (tabName) => {
            this.switchToTab(tabName);
        };
    }

    switchToTab(tabName) {
       
        if (this.currentTab === tabName) return;
        this.currentTab = tabName;
        const tabs = this.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        const activeTab = Array.from(tabs).find(tab => 
            tab.getAttribute('onclick')?.includes(tabName)
        );
        if (activeTab) {
            activeTab.classList.add('active');
        }

        const panels = this.querySelectorAll('.tab-panel');
        panels.forEach(panel => {
            panel.classList.remove('active');
        });

        const activePanel = this.querySelector(`#${tabName}-panel`);
        if (activePanel) {
            activePanel.classList.add('active');
        }

        this.dispatchEvent(new CustomEvent('tab-changed', {
            detail: { tab: tabName, previousTab: this.currentTab },
            bubbles: true,
            composed: true
        }));

        console.log(`Tab switched: ${tabName}`);
    }

    disconnectedCallback() {
        if (window.switchTab) {
            delete window.switchTab;
        }
        console.log('TabNav component removed');
    }
    static get observedAttributes() {
        return ['default-tab'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'default-tab' && newVal && oldVal !== newVal) {
            this.currentTab = newVal;
            if (this.isConnected) {
                this.switchToTab(newVal);
            }
        }
    }

    adoptedCallback() {
        console.log('TabNav component adopted to new document');
    }
}

window.customElements.define('tab-nav', TabNav);