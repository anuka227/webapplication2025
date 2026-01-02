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
    
    // API-аас өгөгдөл татах (нэг удаа)
    async fetchData(force = false) {
        // Cache шалгах
        if (this.cache.allData && !force) {
            console.log('📦 Using cached data');
            return this.cache.allData;
        }
        
        // Татаж байвал хүлээх
        if (this.loading) {
            console.log('⏳ Waiting for ongoing request...');
            return this.waitForData();
        }
        
        this.loading = true;
        
        try {
            console.log('🌐 Fetching data from API...');
            const response = await fetch('http://localhost:3000/api/salons');
            const data = await response.json();
            
            // Parse хийх
            this.cache.allData = data;
            this.cache.salons = data.salons.filter(s => s.id !== 'independent');
            
            const independentData = data.salons.find(s => s.id === 'independent');
            this.cache.independentArtists = independentData?.artists || [];
            
            this.loading = false;
            
            // Listeners-д мэдэгдэх
            this.notifyListeners();
            
            console.log('✅ Data loaded successfully');
            return data;
            
        } catch (error) {
            this.loading = false;
            console.error('❌ Failed to fetch data:', error);
            throw error;
        }
    }
    
    // Хүлээх function
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
    
    // Салонууд авах
    getSalons() {
        return this.cache.salons || [];
    }
    
    // Онцлох салонууд
    getSpecialSalons() {
        return this.getSalons().filter(s => s.special === "True");
    }
    
    // Нэг салон авах
    getSalonById(id) {
        return this.getSalons().find(s => s.id === id);
    }
    
    // Independent артистууд авах
    getIndependentArtists() {
        return this.cache.independentArtists || [];
    }
    
    // Онцлох independent артистууд
    getSpecialIndependentArtists() {
        return this.getIndependentArtists().filter(a => a.special === "True");
    }
    
    // Нэг артист авах
    getArtistById(id) {
        return this.getIndependentArtists().find(a => 
            a.artist_id === id || a.id === id
        );
    }
    
    // Listener нэмэх
    addListener(callback) {
        this.listeners.add(callback);
    }
    
    // Listener хасах
    removeListener(callback) {
        this.listeners.delete(callback);
    }
    
    // Listeners-д мэдэгдэх
    notifyListeners() {
        this.listeners.forEach(callback => {
            callback(this.cache);
        });
    }
    
    // Cache устгах
    clearCache() {
        this.cache = {
            salons: null,
            independentArtists: null,
            allData: null
        };
        console.log('🗑️ Cache cleared');
    }
    
    // Refresh
    async refresh() {
        return this.fetchData(true);
    }
}

// Singleton instance export
export const salonService = new SalonService();