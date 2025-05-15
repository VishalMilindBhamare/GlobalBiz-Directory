// Initialize Mapbox
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your actual token
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [0, 0], // Default center
    zoom: 1
});

// Add navigation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Sample data for categories
const categories = [
    { id: 1, name: 'Restaurants', icon: 'utensils' },
    { id: 2, name: 'Hotels', icon: 'hotel' },
    { id: 3, name: 'Shopping', icon: 'shopping-bag' },
    { id: 4, name: 'Healthcare', icon: 'hospital' },
    { id: 5, name: 'Education', icon: 'graduation-cap' },
    { id: 6, name: 'Automotive', icon: 'car' },
    { id: 7, name: 'Real Estate', icon: 'home' },
    { id: 8, name: 'Services', icon: 'tools' }
];

// Sample data for businesses
const businesses = [
    {
        id: 1,
        name: 'Gourmet Delight',
        category: 'Restaurant',
        location: 'New York, USA',
        rating: 4.5,
        description: 'Fine dining restaurant offering international cuisine with a modern twist.',
        tags: ['Fine Dining', 'International', 'Luxury'],
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id: 2,
        name: 'Tech Solutions Inc.',
        category: 'Services',
        location: 'San Francisco, USA',
        rating: 4.8,
        description: 'Comprehensive IT services for businesses of all sizes.',
        tags: ['IT Services', 'Consulting', 'Support'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id: 3,
        name: 'Urban Style Boutique',
        category: 'Shopping',
        location: 'London, UK',
        rating: 4.2,
        description: 'Trendy fashion boutique offering the latest styles from top designers.',
        tags: ['Fashion', 'Clothing', 'Accessories'],
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
];

// Load categories
function loadCategories() {
    const categoryGrid = document.getElementById('category-grid');
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <div class="category-icon">
                <i class="fas fa-${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
        `;
        categoryGrid.appendChild(categoryCard);
    });
}

// Load businesses
function loadBusinesses() {
    const businessGrid = document.getElementById('business-grid');
    
    businesses.forEach(business => {
        const businessCard = document.createElement('div');
        businessCard.className = 'business-card';
        businessCard.innerHTML = `
            <div class="business-image" style="background-image: url('${business.image}')"></div>
            <div class="business-info">
                <h3>${business.name}</h3>
                <div class="business-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${business.location}</span>
                    <span class="business-rating">
                        <i class="fas fa-star"></i> ${business.rating}
                    </span>
                </div>
                <p class="business-description">${business.description}</p>
                <div class="business-tags">
                    ${business.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        businessGrid.appendChild(businessCard);
    });
}

// Search functionality
document.getElementById('search-btn').addEventListener('click', function() {
    const searchTerm = document.getElementById('search-input').value;
    if (searchTerm.trim() !== '') {
        alert(`Searching for: ${searchTerm}`);
        // In a real app, you would make an API call here
    }
});

// Mobile menu toggle
document.querySelector('.hamburger').addEventListener('click', function() {
    // This would toggle a mobile menu in a more complete implementation
    alert('Mobile menu would open here');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadBusinesses();
    
    // Try to get user's location for the map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                map.flyTo({
                    center: [longitude, latitude],
                    zoom: 12
                });
                
                // Add a marker at the user's location
                new mapboxgl.Marker()
                    .setLngLat([longitude, latitude])
                    .addTo(map);
            },
            error => {
                console.error('Error getting location:', error);
            }
        );
    }
    
    // Add sample markers for businesses
    businesses.forEach(business => {
        // In a real app, you would have actual coordinates for each business
        const randomLng = -74 + Math.random() * 10;
        const randomLat = 40 + Math.random() * 10;
        
        new mapboxgl.Marker()
            .setLngLat([randomLng, randomLat])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${business.name}</h3><p>${business.description}</p>`))
            .addTo(map);
    });
});