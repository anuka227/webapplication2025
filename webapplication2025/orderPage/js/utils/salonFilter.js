import { DistanceCalculator } from './calculateDistance.js';
export class SalonFilter {
    constructor(salonsData) {
        this.allData = salonsData.salons;
    }

    filterByLocation(salons, userLocation, maxDistance = 2) {

    const userCoords = userLocation.coordinates;
    return salons.map(salon => {
        if (salon.id === 'independent') {
            const filteredArtists = salon.artists.filter(artist => {
                if (!artist.coordinates) return false;
                
                const distance = window.DistanceCalculator.calculateDistance(
                    userCoords.lat, 
                    userCoords.lng,
                    artist.coordinates.lat, 
                    artist.coordinates.lng
                );
                artist.distance = distance;                
                return distance <= maxDistance;
            });
            return { ...salon, artists: filteredArtists };
        } else {
            if (!salon.coordinates) {
                return null;
            }
            
            const distance = window.DistanceCalculator.calculateDistance(
                userCoords.lat, 
                userCoords.lng,
                salon.coordinates.lat, 
                salon.coordinates.lng
            );
            if (distance <= maxDistance) {
                return { ...salon, distance };
            }
            return null;
        }
    }).filter(salon => {
        if (!salon) return false;
        if (salon.id === 'independent') return salon.artists.length > 0;
        return true;
    });
}

filterByService(salons, serviceId) {
    if (!serviceId || serviceId === 'Үйлчилгээ') {
        return salons;
    }
    return salons.map(salon => {
        if (salon.id === 'independent') {
            const filteredArtists = salon.artists.filter(artist => {
                if (!artist.service) {
                    return false;
                }
                const hasService = artist.service.some(serviceGroup => {
                    if (!serviceGroup.subservice) return false;
                    
                    return serviceGroup.subservice.some(sub => {
                        const match = sub.id === serviceId;
                        if (match) {
                        }
                        return match;
                    });
                });
                
                return hasService;
            });
            
            return { ...salon, artists: filteredArtists };
        } 
        
        else {
            if (!salon.service) {
                return null;
            }
            
            const hasService = salon.service.some(serviceGroup => {
                if (!serviceGroup.subservice) return false;
                
                return serviceGroup.subservice.some(sub => {
                    const match = sub.id === serviceId;
                    return match;
                });
            });
            
            if (hasService) {
                return salon;
            } else {
                return null;
            }
        }
    }).filter(salon => {
        if (!salon) return false;
        if (salon.id === 'independent') return salon.artists.length > 0;
        return true;
    });
}


    filterByDate(salons, selectedDate) {
        if (!selectedDate) return salons;
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = dayNames[selectedDate.getDay()];
        return salons.map(salon => {
            if (salon.id === 'independent') {
                const filteredArtists = salon.artists.filter(artist => 
                    artist.date && artist.date.includes(dayName)
                );
                return { ...salon, artists: filteredArtists };
            } else {
                return salon.date && salon.date.includes(dayName) ? salon : null;
            }
        }).filter(salon => {
            if (!salon) return false;
            if (salon.id === 'independent') return salon.artists.length > 0;
            return true;
        });
    }

filterByTime(salons, selectedTime) {
    return salons.map(salon => {
        if (salon.id === 'independent') {
            const filteredArtists = salon.artists.filter(artist => {
                const hasTime = artist.hours && artist.hours.includes(selectedTime);
                if (artist.hours) {
                    console.log(`${artist.name}: ${artist.hours} → includes "${selectedTime}"? ${hasTime}`);
                }
                return hasTime;
            });
            return { ...salon, artists: filteredArtists };
        } else {
            const hasTime = salon.time && salon.time.includes(selectedTime);
            return hasTime ? salon : null;
        }
    }).filter(salon => {
        if (!salon) return false;
        if (salon.id === 'independent') return salon.artists.length > 0;
        return true;
    });
}

    applyFilters(filters) {
        let results = JSON.parse(JSON.stringify(this.allData));
        if (filters.service) {
            results = this.filterByService(results, filters.service);
        }
        if (filters.date) {
            results = this.filterByDate(results, filters.date);
        }
        if (filters.time) {
            results = this.filterByTime(results, filters.time);
        }
        if (filters.location) {
            results = this.filterByLocation(results, filters.location, filters.maxDistance);
        }
        if (filters.location && filters.location.coordinates) {
            results.sort((a, b) => {
                const distA = a.distance || (a.id === 'independent' ? 999 : 0);
                const distB = b.distance || (b.id === 'independent' ? 999 : 0);
                return distA - distB;
            });
        }
        return results;
    }
}
window.SalonFilter = SalonFilter;