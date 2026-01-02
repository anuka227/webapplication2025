export class OrderManager {
    constructor() {
        this.orderData = {
            service: null,
            location: null,
            date: null,
            time: null
        };
    }
    
    updateService(service) {
        this.orderData.service = service;
    }
    
    updateLocation(location) {
        this.orderData.location = location;
    }
    
    updateDate(date) {
        this.orderData.date = date;
    }
    
    updateTime(time) {
        this.orderData.time = time;
        if (typeof time === 'string' && time.length > 0) {
        this.filters.time = time;
        this.applyFilters();
    } else {
        console.error('Invalid time:', time);
    }
    }
    
    isComplete() {
        return this.orderData.service && 
               this.orderData.location && 
               this.orderData.date && 
               this.orderData.time;
    }
    
    getData() {
        return this.orderData;
    }

    reset() {
        this.orderData = {
            service: null,
            location: null,
            date: null,
            time: null
        };
    }
}

if (!window.orderManager) {
    window.orderManager = new OrderManager();
}