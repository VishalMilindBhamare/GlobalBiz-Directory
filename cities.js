// Initialize Mapbox
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your actual token
const map = new mapboxgl.Map({
    container: 'world-map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0, 20], // Default center
    zoom: 1
});

// Add navigation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Sample data for cities
const citiesData = [
    {
        id: 1,
        name: 'New York',
        country: 'United States',
        countryCode: 'US',
        businessCount: 5423,
        popular: true,
        description: 'The business capital of the world',
        coordinates: [-74.006, 40.7128],
        image: 'new-york.jpg'
    },
    {
        id: 2,
        name: 'London',
        country: 'United Kingdom',
        countryCode: 'GB',
        businessCount: 4872,
        popular: true,
        description: 'Europe leading business hub',
        coordinates: [-0.1276, 51.5072],
        image: 'london.jpg'
    },
    {
        id: 3,
        name: 'Tokyo',
        country: 'Japan',
        countryCode: 'JP',
        businessCount: 3987,
        popular: true,
        description: 'Asia economic powerhouse',
        coordinates: [139.6917, 35.6895],
        image: 'tokyo.jpg'
    },
    {
        id: 4,
        name: 'Dubai',
        country: 'United Arab Emirates',
        countryCode: 'AE',
        businessCount: 2876,
        popular: true,
        description: 'Middle East business center',
        coordinates: [55.2708, 25.2048],
        image: 'dubai.jpg'
    },
    {
        id: 5,
        name: 'Paris',
        country: 'France',
        countryCode: 'FR',
        businessCount: 3542,
        popular: true,
        description: 'European business and fashion capital',
        coordinates: [2.3522, 48.8566],
        image: 'paris.jpg'
    },
    {
        id: 6,
        name: 'Singapore',
        country: 'Singapore',
        countryCode: 'SG',
        businessCount: 3210,
        popular: true,
        description: 'Asia business gateway',
        coordinates: [103.8198, 1.3521],
        image: 'singapore.jpg'
    },
    {
        id: 7,
        name: 'Sydney',
        country: 'Australia',
        countryCode: 'AU',
        businessCount: 2456,
        popular: false,
        description: 'Oceania business hub',
        coordinates: [151.2093, -33.8688],
        image: 'sydney.jpg'
    },
    {
        id: 8,
        name: 'Toronto',
        country: 'Canada',
        countryCode: 'CA',
        businessCount: 2873,
        popular: false,
        description: 'Canada business capital',
        coordinates: [-79.3832, 43.6532],
        image: 'toronto.jpg'
    },
    {
        id: 9,
        name: 'Berlin',
        country: 'Germany',
        countryCode: 'DE',
        businessCount: 2765,
        popular: false,
        description: 'Central European business center',
        coordinates: [13.405, 52.52],
        image: 'berlin.jpg'
    },
    {
        id: 10,
        name: 'Mumbai',
        country: 'India',
        countryCode: 'IN',
        businessCount: 3542,
        popular: false,
        description: 'India financial capital',
        coordinates: [72.8777, 19.076],
        image: 'mumbai.jpg'
    },
    {
        id: 11,
        name: 'São Paulo',
        country: 'Brazil',
        countryCode: 'BR',
        businessCount: 2987,
        popular: false,
        description: 'South America business hub',
        coordinates: [-46.6333, -23.5505],
        image: 'sao-paulo.jpg'
    },
    {
        id: 12,
        name: 'Johannesburg',
        country: 'South Africa',
        countryCode: 'ZA',
        businessCount: 1876,
        popular: false,
        description: 'Africa business center',
        coordinates: [28.0473, -26.2041],
        image: 'johannesburg.jpg'
    }
];

// Get unique countries for filter
const countries = [...new Set(citiesData.map(city => city.country))];

// DOM Elements
const citiesContainer = document.getElementById('cities-container');
const popularCities = document.getElementById('popular-cities');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-cities');
const countrySelector = document.getElementById('country-selector');
const countryFilter = document.getElementById('country-filter');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

// Load all cities
function loadCities(filter = 'all', sortBy = 'name-asc', country = '') {
    citiesContainer.innerHTML = '';
    
    let filteredCities = [...citiesData];
    
    // Apply filter
    if (filter === 'popular') {
        filteredCities = filteredCities.filter(city => city.popular);
    } else if (filter === 'country' && country) {
        filteredCities = filteredCities.filter(city => city.country === country);
    }
    
    // Apply sorting
    filteredCities.sort((a, b) => {
        switch(sortBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'business-asc':
                return a.businessCount - b.businessCount;
            case 'business-desc':
                return b.businessCount - a.businessCount;
            default:
                return 0;
        }
    });
    
    // Display cities
    if (filteredCities.length === 0) {
        citiesContainer.innerHTML = '<p class="no-results">No cities found matching your criteria.</p>';
        return;
    }
    
    filteredCities.forEach(city => {
        const cityCard = document.createElement('div');
        cityCard.className = 'city-card';
        cityCard.innerHTML = `
            <div class="city-image" style="background-image: url('assets/cities/${city.image}')">
                <div class="city-overlay">
                    <h3>${city.name}</h3>
                    <div class="country">${city.country}</div>
                </div>
            </div>
            <div class="city-info">
                <p>${city.description}</p>
                <div class="city-stats">
                    <div class="city-stat">
                        <i class="fas fa-building"></i>
                        <span>${city.businessCount} businesses</span>
                    </div>
                    <div class="city-stat">
                        <i class="fas fa-map-marker-alt"></i>
                        <a href="#" class="view-on-map" data-lng="${city.coordinates[0]}" data-lat="${city.coordinates[1]}">View on map</a>
                    </div>
                </div>
            </div>
        `;
        citiesContainer.appendChild(cityCard);
    });
    
    // Add event listeners to "View on map" buttons
    document.querySelectorAll('.view-on-map').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const lng = parseFloat(this.dataset.lng);
            const lat = parseFloat(this.dataset.lat);
            map.flyTo({
                center: [lng, lat],
                zoom: 10
            });
            
            // Add a marker at the city location
            new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${this.parentElement.parentElement.parentElement.querySelector('h3').textContent}</h3>`))
                .addTo(map);
        });
    });
}

// Load popular cities
function loadPopularCities() {
    const popular = citiesData.filter(city => city.popular)
                             .sort((a, b) => b.businessCount - a.businessCount)
                             .slice(0, 6);
    
    popular.forEach(city => {
        const cityCard = document.createElement('div');
        cityCard.className = 'popular-city';
        cityCard.innerHTML = `
            <div class="popular-city-image" style="background-image: url('assets/cities/${city.image}')"></div>
            <div class="popular-city-info">
                <h3>${city.name}</h3>
                <div class="business-count">${city.businessCount} businesses</div>
            </div>
        `;
        cityCard.addEventListener('click', () => {
            // In a real app, this would navigate to a city page
            alert(`Viewing ${city.name} businesses`);
        });
        popularCities.appendChild(cityCard);
    });
}

// Load countries into select dropdown
function loadCountries() {
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

// Filter button event listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (button.dataset.filter === 'country') {
            countrySelector.style.display = 'block';
            loadCities('country', sortSelect.value, countryFilter.value);
        } else {
            countrySelector.style.display = 'none';
            loadCities(button.dataset.filter, sortSelect.value);
        }
    });
});

// Country filter event listener
countryFilter.addEventListener('change', () => {
    loadCities('country', sortSelect.value, countryFilter.value);
});

// Sort select event listener
sortSelect.addEventListener('change', (e) => {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const country = activeFilter === 'country' ? countryFilter.value : '';
    loadCities(activeFilter, e.target.value, country);
});

// Search functionality
searchBtn.addEventListener('click', searchCities);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchCities();
});

function searchCities() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.trim() !== '') {
        const filtered = citiesData.filter(city => 
            city.name.toLowerCase().includes(searchTerm) || 
            city.country.toLowerCase().includes(searchTerm) ||
            city.description.toLowerCase().includes(searchTerm)
        );
        
        citiesContainer.innerHTML = '';
        
        if (filtered.length === 0) {
            citiesContainer.innerHTML = '<p class="no-results">No cities found matching your search.</p>';
            return;
        }
        
        filtered.forEach(city => {
            const cityCard = document.createElement('div');
            cityCard.className = 'city-card';
            cityCard.innerHTML = `
                <div class="city-image" style="background-image: url('assets/cities/${city.image}')">
                    <div class="city-overlay">
                        <h3>${city.name}</h3>
                        <div class="country">${city.country}</div>
                    </div>
                </div>
                <div class="city-info">
                    <p>${city.description}</p>
                    <div class="city-stats">
                        <div class="city-stat">
                            <i class="fas fa-building"></i>
                            <span>${city.businessCount} businesses</span>
                        </div>
                        <div class="city-stat">
                            <i class="fas fa-map-marker-alt"></i>
                            <a href="#" class="view-on-map" data-lng="${city.coordinates[0]}" data-lat="${city.coordinates[1]}">View on map</a>
                        </div>
                    </div>
                </div>
            `;
            citiesContainer.appendChild(cityCard);
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCities();
    loadPopularCities();
    loadCountries();
    
    // Add markers for all cities to the map
    citiesData.forEach(city => {
        new mapboxgl.Marker()
            .setLngLat(city.coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${city.name}</h3><p>${city.businessCount} businesses</p>`))
            .addTo(map);
    });
    
    // Mobile menu toggle
    document.querySelector('.hamburger').addEventListener('click', function() {
        // This would toggle a mobile menu in a more complete implementation
        alert('Mobile menu would open here');
    });
});