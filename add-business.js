// DOM Elements
const form = document.getElementById('business-form');
const steps = document.querySelectorAll('.form-step');
const prevButtons = document.querySelectorAll('.btn-prev');
const nextButtons = document.querySelectorAll('.btn-next');
const submitButton = document.querySelector('.btn-submit');
const progressFill = document.querySelector('.progress-fill');
const progressSteps = document.querySelectorAll('.progress-step');
const successModal = document.getElementById('success-modal');

// Current step
let currentStep = 0;

// Days of week for hours
const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

// Initialize business hours
function initBusinessHours() {
    const hoursContainer = document.getElementById('business-hours');
    
    daysOfWeek.forEach(day => {
        const hourRow = document.createElement('div');
        hourRow.className = 'hour-row';
        hourRow.innerHTML = `
            <div class="hour-day">${day}</div>
            <div class="hour-inputs">
                <select class="hour-start">
                    ${generateTimeOptions()}
                </select>
                <span>to</span>
                <select class="hour-end">
                    ${generateTimeOptions()}
                </select>
            </div>
            <div class="hour-closed">
                <input type="checkbox" id="closed-${day.toLowerCase()}" class="hour-closed-check">
                <label for="closed-${day.toLowerCase()}">Closed</label>
            </div>
        `;
        hoursContainer.appendChild(hourRow);
        
        // Add event listener for closed checkbox
        const closedCheck = hourRow.querySelector('.hour-closed-check');
        const startSelect = hourRow.querySelector('.hour-start');
        const endSelect = hourRow.querySelector('.hour-end');
        
        closedCheck.addEventListener('change', function() {
            if (this.checked) {
                startSelect.disabled = true;
                endSelect.disabled = true;
            } else {
                startSelect.disabled = false;
                endSelect.disabled = false;
            }
        });
    });
}

// Generate time options for select
function generateTimeOptions() {
    let options = '<option value="">--</option>';
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            options += `<option value="${time}">${formatTime(time)}</option>`;
        }
    }
    return options;
}

// Format time for display (e.g., "09:00" -> "9:00 AM")
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
}

// File upload functionality
function initFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('business-photos');
    const previewContainer = document.getElementById('preview-container');
    const photosError = document.getElementById('photos-error');
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFiles(fileInput.files);
        }
    });
    
    // Handle file selection
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFiles(fileInput.files);
        }
    });
    
    // Process selected files
    function handleFiles(files) {
        // Clear previous previews
        previewContainer.innerHTML = '';
        
        // Validate number of files
        if (files.length > 5) {
            photosError.textContent = 'You can upload a maximum of 5 photos';
            photosError.classList.add('show');
            return;
        } else {
            photosError.classList.remove('show');
        }
        
        // Validate file types and sizes
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            if (!file.type.match('image.*')) {
                photosError.textContent = 'Only image files are allowed';
                photosError.classList.add('show');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) { // 5MB
                photosError.textContent = 'Images must be less than 5MB';
                photosError.classList.add('show');
                return;
            }
        }
        
        // Create previews
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                previewContainer.appendChild(previewItem);
                
                // Add remove button event
                previewItem.querySelector('.remove-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    removeFile(index);
                });
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Remove file from selection
    function removeFile(index) {
        const dt = new DataTransfer();
        const files = Array.from(fileInput.files);
        
        files.splice(index, 1);
        
        files.forEach(file => {
            dt.items.add(file);
        });
        
        fileInput.files = dt.files;
        handleFiles(fileInput.files);
    }
}

// Show step
function showStep(stepIndex) {
    // Hide all steps
    steps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    steps[stepIndex].classList.add('active');
    
    // Update progress bar
    const progressPercent = ((stepIndex + 1) / steps.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
    // Update progress steps
    progressSteps.forEach((step, index) => {
        if (index <= stepIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update current step
    currentStep = stepIndex;
}

// Validate step
function validateStep(stepIndex) {
    let isValid = true;
    
    // Get all required fields in current step
    const requiredFields = steps[stepIndex].querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            const errorId = `${field.id}-error`;
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = 'This field is required';
                errorElement.classList.add('show');
            }
            
            // Highlight the field
            field.style.borderColor = 'var(--warning)';
            field.addEventListener('input', function() {
                this.style.borderColor = '';
                const errorId = `${this.id}-error`;
                const errorElement = document.getElementById(errorId);
                if (errorElement) errorElement.classList.remove('show');
            });
        }
        
        // Special validation for email
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                const errorElement = document.getElementById(`${field.id}-error`);
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email address';
                    errorElement.classList.add('show');
                }
                field.style.borderColor = 'var(--warning)';
            }
        }
        
        // Special validation for phone
        if (field.id === 'business-phone' && field.value.trim()) {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(field.value)) {
                isValid = false;
                const errorElement = document.getElementById(`${field.id}-error`);
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid phone number';
                    errorElement.classList.add('show');
                }
                field.style.borderColor = 'var(--warning)';
            }
        }
    });
    
    return isValid;
}

// Update summary
function updateSummary() {
    // Basic Information
    const basicInfo = {
        'Business Name': document.getElementById('business-name').value,
        'Category': document.getElementById('business-category').value,
        'Description': document.getElementById('business-description').value
    };
    
    let basicHtml = '';
    for (const [label, value] of Object.entries(basicInfo)) {
        basicHtml += `
            <div class="summary-item">
                <div class="summary-label">${label}:</div>
                <div class="summary-value">${value || 'Not provided'}</div>
            </div>
        `;
    }
    document.getElementById('summary-basic').innerHTML += basicHtml;
    
    // Location Details
    const locationInfo = {
        'Address': document.getElementById('business-address').value,
        'City': document.getElementById('business-city').value,
        'Country': document.getElementById('business-country').value,
        'Postal Code': document.getElementById('business-postal').value,
        'Region': document.getElementById('business-region').value
    };
    
    let locationHtml = '';
    for (const [label, value] of Object.entries(locationInfo)) {
        locationHtml += `
            <div class="summary-item">
                <div class="summary-label">${label}:</div>
                <div class="summary-value">${value || 'Not provided'}</div>
            </div>
        `;
    }
    document.getElementById('summary-location').innerHTML += locationHtml;
    
    // Contact Information
    const contactInfo = {
        'Phone': document.getElementById('business-phone').value,
        'Email': document.getElementById('business-email').value,
        'Website': document.getElementById('business-website').value || 'Not provided',
        'Facebook': document.querySelector('[name="business-facebook"]').value || 'Not provided',
        'Twitter': document.querySelector('[name="business-twitter"]').value || 'Not provided',
        'Instagram': document.querySelector('[name="business-instagram"]').value || 'Not provided',
        'LinkedIn': document.querySelector('[name="business-linkedin"]').value || 'Not provided'
    };
    
    let contactHtml = '';
    for (const [label, value] of Object.entries(contactInfo)) {
        contactHtml += `
            <div class="summary-item">
                <div class="summary-label">${label}:</div>
                <div class="summary-value">${value}</div>
            </div>
        `;
    }
    document.getElementById('summary-contact').innerHTML += contactHtml;
    
    // Additional Details
    // Business Hours
    let hoursHtml = '<div class="summary-item"><div class="summary-label">Business Hours:</div><div class="summary-value">';
    const hourRows = document.querySelectorAll('.hour-row');
    
    hourRows.forEach(row => {
        const day = row.querySelector('.hour-day').textContent;
        const closed = row.querySelector('.hour-closed-check').checked;
        const start = row.querySelector('.hour-start').value;
        const end = row.querySelector('.hour-end').value;
        
        if (closed) {
            hoursHtml += `${day}: Closed<br>`;
        } else if (start && end) {
            hoursHtml += `${day}: ${formatTime(start)} - ${formatTime(end)}<br>`;
        } else {
            hoursHtml += `${day}: Not specified<br>`;
        }
    });
    
    hoursHtml += '</div></div>';
    
    // Amenities
    let amenitiesHtml = '<div class="summary-item"><div class="summary-label">Amenities:</div><div class="summary-value">';
    const amenities = [];
    
    document.querySelectorAll('.amenity-option input:checked').forEach(checkbox => {
        amenities.push(checkbox.nextElementSibling.textContent);
    });
    
    amenitiesHtml += amenities.length > 0 ? amenities.join(', ') : 'None selected';
    amenitiesHtml += '</div></div>';
    
    // Photos
    const fileInput = document.getElementById('business-photos');
    const photosHtml = `<div class="summary-item">
        <div class="summary-label">Photos:</div>
        <div class="summary-value">${fileInput.files.length} uploaded</div>
    </div>`;
    
    document.getElementById('summary-additional').innerHTML = hoursHtml + amenitiesHtml + photosHtml;
}

// Event Listeners
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            // If going to summary step (last step), update the summary
            if (button.dataset.next === 'step-5') {
                document.getElementById('summary-basic').innerHTML = '<h4>Basic Information</h4>';
                document.getElementById('summary-location').innerHTML = '<h4>Location Details</h4>';
                document.getElementById('summary-contact').innerHTML = '<h4>Contact Information</h4>';
                document.getElementById('summary-additional').innerHTML = '<h4>Additional Details</h4>';
                updateSummary();
            }
            
            showStep(currentStep + 1);
        }
    });
});

prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        showStep(currentStep - 1);
    });
});

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate terms checkbox
    const termsAgree = document.getElementById('terms-agree');
    const termsError = document.getElementById('terms-error');
    
    if (!termsAgree.checked) {
        termsError.textContent = 'You must agree to the terms';
        termsError.classList.add('show');
        return;
    }
    
    // In a real application, you would send the form data to your server here
    // For this demo, we'll just show the success modal
    
    // Create FormData object
    const formData = new FormData(form);
    
    // Add business hours to form data
    const hourRows = document.querySelectorAll('.hour-row');
    const hours = {};
    
    hourRows.forEach(row => {
        const day = row.querySelector('.hour-day').textContent;
        const closed = row.querySelector('.hour-closed-check').checked;
        const start = row.querySelector('.hour-start').value;
        const end = row.querySelector('.hour-end').value;
        
        hours[day] = closed ? 'Closed' : `${start} - ${end}`;
    });
    
    formData.append('business-hours', JSON.stringify(hours));
    
    // Add amenities to form data
    const amenities = [];
    document.querySelectorAll('.amenity-option input:checked').forEach(checkbox => {
        amenities.push(checkbox.value);
    });
    
    formData.append('amenities', JSON.stringify(amenities));
    
    // Log form data (in a real app, you would send this to your server)
    for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    // Show success modal
    successModal.classList.add('show');
    
    // Reset form after submission (optional)
    // form.reset();
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initBusinessHours();
    initFileUpload();
    showStep(0);
    
    // Mobile menu toggle
    document.querySelector('.hamburger').addEventListener('click', function() {
        // This would toggle a mobile menu in a more complete implementation
        alert('Mobile menu would open here');
    });
});