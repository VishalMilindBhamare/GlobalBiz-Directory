// Sample data for categories
const categoriesData = [
    {
        id: 1,
        name: 'Restaurants',
        icon: 'utensils',
        businessCount: 1245,
        popular: true,
        description: 'All types of dining establishments'
    },
    {
        id: 2,
        name: 'Hotels & Accommodation',
        icon: 'hotel',
        businessCount: 892,
        popular: true,
        description: 'Hotels, motels, and places to stay'
    },
    {
        id: 3,
        name: 'Retail & Shopping',
        icon: 'shopping-bag',
        businessCount: 2103,
        popular: true,
        description: 'Stores and shopping centers'
    },
    {
        id: 4,
        name: 'Healthcare',
        icon: 'hospital',
        businessCount: 756,
        popular: false,
        description: 'Medical services and facilities'
    },
    {
        id: 5,
        name: 'Education',
        icon: 'graduation-cap',
        businessCount: 432,
        popular: false,
        description: 'Schools and educational services'
    },
    {
        id: 6,
        name: 'Automotive',
        icon: 'car',
        businessCount: 567,
        popular: false,
        description: 'Car dealers and services'
    },
    {
        id: 7,
        name: 'Real Estate',
        icon: 'home',
        businessCount: 389,
        popular: true,
        description: 'Property and housing services'
    },
    {
        id: 8,
        name: 'Professional Services',
        icon: 'briefcase',
        businessCount: 1203,
        popular: false,
        description: 'Business and professional services'
    },
    {
        id: 9,
        name: 'Beauty & Personal Care',
        icon: 'spa',
        businessCount: 987,
        popular: true,
        description: 'Salons and beauty services'
    },
    {
        id: 10,
        name: 'Entertainment',
        icon: 'film',
        businessCount: 654,
        popular: false,
        description: 'Movies, events, and fun activities'
    },
    {
        id: 11,
        name: 'Technology',
        icon: 'laptop',
        businessCount: 543,
        popular: true,
        description: 'Tech products and services'
    },
    {
        id: 12,
        name: 'Fitness & Sports',
        icon: 'dumbbell',
        businessCount: 321,
        popular: false,
        description: 'Gyms and sports facilities'
    }
];

// DOM Elements
const categoriesContainer = document.getElementById('categories-container');
const popularCategories = document.getElementById('popular-categories');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-categories');

// Load all categories
function loadCategories(filter = 'all', sortBy = 'name-asc') {
    categoriesContainer.innerHTML = '';
    
    let filteredCategories = [...categoriesData];
    
    // Apply filter
    if (filter === 'popular') {
        filteredCategories = filteredCategories.filter(cat => cat.popular);
    } else if (filter === 'new') {
        // In a real app, you would have a date property to filter by
        filteredCategories = filteredCategories.slice(0, 6); // Just for demo
    }
    
    // Apply sorting
    filteredCategories.sort((a, b) => {
        switch(sortBy) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'count-asc':
                return a.businessCount - b.businessCount;
            case 'count-desc':
                return b.businessCount - a.businessCount;
            default:
                return 0;
        }
    });
    
    // Display categories
    filteredCategories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-icon">
                <i class="fas fa-${category.icon}"></i>
            </div>
            <div class="category-info">
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <span class="business-count">${category.businessCount} businesses</span>
            </div>
        `;
        categoryItem.addEventListener('click', () => {
            // In a real app, this would navigate to a category page
            alert(`Viewing ${category.name} category`);
        });
        categoriesContainer.appendChild(categoryItem);
    });
}

// Load popular categories
function loadPopularCategories() {
    const popular = categoriesData.filter(cat => cat.popular);
    
    popular.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'popular-category';
        categoryCard.innerHTML = `
            <div class="icon">
                <i class="fas fa-${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
            <div class="count">${category.businessCount} businesses</div>
        `;
        categoryCard.addEventListener('click', () => {
            // In a real app, this would navigate to a category page
            alert(`Viewing ${category.name} category`);
        });
        popularCategories.appendChild(categoryCard);
    });
}

// Filter button event listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        loadCategories(button.dataset.filter, sortSelect.value);
    });
});

// Sort select event listener
sortSelect.addEventListener('change', (e) => {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    loadCategories(activeFilter, e.target.value);
});

// Search functionality
document.getElementById('search-btn').addEventListener('click', function() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (searchTerm.trim() !== '') {
        const filtered = categoriesData.filter(cat => 
            cat.name.toLowerCase().includes(searchTerm) || 
            cat.description.toLowerCase().includes(searchTerm)
        );
        
        categoriesContainer.innerHTML = '';
        
        if (filtered.length === 0) {
            categoriesContainer.innerHTML = '<p class="no-results">No categories found matching your search.</p>';
            return;
        }
        
        filtered.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <div class="category-icon">
                    <i class="fas fa-${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                    <span class="business-count">${category.businessCount} businesses</span>
                </div>
            `;
            categoriesContainer.appendChild(categoryItem);
        });
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadPopularCategories();
    
    // Mobile menu toggle
    document.querySelector('.hamburger').addEventListener('click', function() {
        // This would toggle a mobile menu in a more complete implementation
        alert('Mobile menu would open here');
    });
});