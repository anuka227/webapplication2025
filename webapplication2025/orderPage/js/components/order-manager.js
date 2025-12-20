// orderManager.js
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
        console.log('📋 Service updated:', service);
    }
    
    updateLocation(location) {
        this.orderData.location = location;
        console.log('📍 Location updated:', location);
    }
    
    updateDate(date) {
        this.orderData.date = date;
        console.log('📅 Date updated:', date);
    }
    
    updateTime(time) {
        this.orderData.time = time;
        console.log('⏰ Time updated:', time);
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