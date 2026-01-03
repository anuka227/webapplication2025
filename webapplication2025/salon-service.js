class SalonService {
    constructor() {
        if (SalonService.instance) {
            return SalonService.instance;
        }
        
        this.cache = {
            salons: null,
            independentArtists: null,
            allData: null
        };
        
        this.loading = false;
        this.listeners = new Set();
        
        SalonService.instance = this;
    }
    
    async fetchData(force = false) {
        if (this.cache.allData && !force) {
            return this.cache.allData;
        }
        
        if (this.loading) {
            return this.waitForData();
        }
        
        this.loading = true;
        
        try {
            const response = await fetch('http://localhost:3000/api/salons');
            const data = await response.json();
            
            this.cache.allData = data;
            this.cache.salons = data.salons.filter(s => s.id !== 'independent');
            
            const independentData = data.salons.find(s => s.id === 'independent');
            this.cache.independentArtists = independentData?.artists || [];
            
            this.loading = false;
            
            this.notifyListeners();
            
            return data;
            
        } catch (error) {
            this.loading = false;
            throw error;
        }
    }
    
    async waitForData() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (!this.loading && this.cache.allData) {
                    clearInterval(checkInterval);
                    resolve(this.cache.allData);
                }
            }, 50);
            
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve(null);
            }, 10000);
        });
    }
    
    getSalons() {
        return this.cache.salons || [];
    }
    
    getSpecialSalons() {
        return this.getSalons().filter(s => s.special === "True");
    }
    
    getSalonById(id) {
        return this.getSalons().find(s => s.id === id);
    }
    
    getIndependentArtists() {
        return this.cache.independentArtists || [];
    }
    
    getSpecialIndependentArtists() {
        return this.getIndependentArtists().filter(a => a.special === "True");
    }
    
    getArtistById(id) {
        return this.getIndependentArtists().find(a => 
            a.artist_id === id || a.id === id
        );
    }
    
    addListener(callback) {
        this.listeners.add(callback);
    }
    
    removeListener(callback) {
        this.listeners.delete(callback);
    }
    
    notifyListeners() {
        this.listeners.forEach(callback => {
            callback(this.cache);
        });
    }
    
    clearCache() {
        this.cache = {
            salons: null,
            independentArtists: null,
            allData: null
        };
        console.log('🗑️ Cache cleared');
    }
    
    async refresh() {
        return this.fetchData(true);
    }
}

export const salonService = new SalonService();