export class DistanceCalculator {
    static calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return distance; 
    }
    
    static toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}