// utils/salonFilter.js
import { DistanceCalculator } from './calculateDistance.js';
export class SalonFilter {
    constructor(salonsData) {
        this.allData = salonsData.salons;
        console.log('📊 Салоны тоо:', this.allData.length);
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
                console.log(`  👤 ${artist.name}: ${distance.toFixed(2)}км`);
                
                return distance <= maxDistance;
            });
            return { ...salon, artists: filteredArtists };
        } else {
            if (!salon.coordinates) {
                console.log(`  ⚠️ ${salon.name}: Координат байхгүй`);
                return null;
            }
            
            // ✅ ЗАСВАРЛАСАН: window.DistanceCalculator
            const distance = window.DistanceCalculator.calculateDistance(
                userCoords.lat, 
                userCoords.lng,
                salon.coordinates.lat, 
                salon.coordinates.lng
            );
            
            console.log(`  🏢 ${salon.name}: ${distance.toFixed(2)}км`);
            
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

filterByService(salons, serviceType) {
        if (!serviceType || serviceType === 'Үйлчилгээ') {
            console.log('⚠️ Үйлчилгээ сонгоогүй');
            return salons;
        }

        console.log('📋 Үйлчилгээгээр шүүж байна:', serviceType);

        // Subservice type-ийг шууд ашиглах (жишээ: "Hair Style", "Manicure")
        return salons.map(salon => {
            if (salon.id === 'independent') {
                const filteredArtists = salon.artists.filter(artist => {
                    if (!artist.service) {
                        return false;
                    }
                    
                    const hasService = artist.service.some(s => {
                        // Subservice type-тэй шууд харьцуулах
                        const match = s.type === serviceType;
                        if (match) {
                            console.log(`  ✅ ${artist.name}: ${s.type} тохирлоо`);
                        }
                        return match;
                    });
                    
                    return hasService;
                });
                
                console.log(`  📊 Бие даасан артист: ${filteredArtists.length} олдлоо`);
                return { ...salon, artists: filteredArtists };
            } 
            
            // ========== САЛОНУУД ==========
            else {
                if (!salon.service) {
                    console.log(`  ⚠️ ${salon.name}: service байхгүй`);
                    return null;
                }
                
                const hasService = salon.service.some(s => {
                    // Subservice type-тэй шууд харьцуулах
                    const match = s.type === serviceType;
                    if (match) {
                        console.log(`  ✅ ${salon.name}: ${s.type} тохирлоо`);
                    }
                    return match;
                });
                
                if (hasService) {
                    console.log(`  🏢 ${salon.name} - Үйлчилгээ ОЛДЛОО`);
                    return salon;
                } else {
                    console.log(`  ❌ ${salon.name} - Үйлчилгээ олдсонгүй`);
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
        
        console.log('📅 Огноо:', dayName);

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
        if (!selectedTime) return salons;
        
        console.log('⏰ Цаг:', selectedTime);

        return salons.map(salon => {
            if (salon.id === 'independent') {
                const filteredArtists = salon.artists.filter(artist => 
                    artist.hours && artist.hours.includes(selectedTime)
                );
                return { ...salon, artists: filteredArtists };
            } else {
                return salon.time && salon.time.includes(selectedTime) ? salon : null;
            }
        }).filter(salon => {
            if (!salon) return false;
            if (salon.id === 'independent') return salon.artists.length > 0;
            return true;
        });
    }

    applyFilters(filters) {
        let results = JSON.parse(JSON.stringify(this.allData));

        console.log('🔧 Эхлэх өгөгдөл:', results.length);

        // 1. Үйлчилгээгээр
        if (filters.service) {
            results = this.filterByService(results, filters.service);
            console.log('📋 Үйлчилгээгээр шүүлсний дараа:', results.length);
        }

        // 2. Огноогоор
        if (filters.date) {
            results = this.filterByDate(results, filters.date);
            console.log('📅 Огноогоор шүүлсний дараа:', results.length);
        }

        // 3. Цагаар
        if (filters.time) {
            results = this.filterByTime(results, filters.time);
            console.log('⏰ Цагаар шүүлсний дараа:', results.length);
        }

        // 4. Байршлаар (хамгийн сүүлд)
        if (filters.location) {
            results = this.filterByLocation(results, filters.location, filters.maxDistance);
            console.log('📍 Байршлаар шүүлсний дараа:', results.length);
        }

        // Зайгаар эрэмбэлэх
        if (filters.location && filters.location.coordinates) {
            results.sort((a, b) => {
                const distA = a.distance || (a.id === 'independent' ? 999 : 0);
                const distB = b.distance || (b.id === 'independent' ? 999 : 0);
                return distA - distB;
            });
            console.log('📊 Зайгаар эрэмбэлэгдлээ');
        }

        return results;
    }
}

window.SalonFilter = SalonFilter;