// Toggle section visibility - only one section open at a time
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const content = section.querySelector('.section-content');
    const toggleIcon = section.querySelector('.toggle-icon');
    
    // If this section is currently closed, close all other sections first
    if (content.style.display === 'none' || content.style.display === '') {
        // Close all other sections
        const allSections = document.querySelectorAll('.form-section');
        allSections.forEach(otherSection => {
            if (otherSection.id !== sectionId) {
                const otherContent = otherSection.querySelector('.section-content');
                const otherIcon = otherSection.querySelector('.toggle-icon');
                otherContent.style.display = 'none';
                otherIcon.classList.remove('fa-chevron-down');
                otherIcon.classList.add('fa-chevron-right');
            }
        });
        
        // Open the clicked section
        content.style.display = 'block';
        toggleIcon.classList.remove('fa-chevron-right');
        toggleIcon.classList.add('fa-chevron-down');
    } else {
        // If this section is open, close it
        content.style.display = 'none';
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-right');
    }
}

// Form validation
function validateForm() {
  const requiredFields = [
    'customerName',
    'phoneNumber',
    'email',
    'make',
    'model',
    'year',
    'mileage',
    'serviceType',
    'urgency',
    'problemDescription'
  ];
    
    let isValid = true;
    const errors = [];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            isValid = false;
            errors.push(`${field.previousElementSibling.textContent.replace(' *', '')} is required`);
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '#e9ecef';
        }
    });
    
      // Validate year format
  const yearField = document.getElementById('year');
  if (yearField.value) {
    const year = parseInt(yearField.value);
    if (year < 1900 || year > 2030) {
      isValid = false;
      errors.push('Year must be between 1900 and 2030');
      yearField.style.borderColor = '#dc3545';
    }
  }
  
  // Validate phone number format (basic)
  const phoneField = document.getElementById('phoneNumber');
    if (phoneField.value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phoneField.value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errors.push('Please enter a valid phone number');
            phoneField.style.borderColor = '#dc3545';
        }
    }
    
    return { isValid, errors };
}

// Show message
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    const form = document.getElementById('medicalForm');
    form.appendChild(messageDiv);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const validation = validateForm();
    
    if (!validation.isValid) {
        showMessage(validation.errors.join(', '), 'error');
        return;
    }
    
    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
          // Show success message
    showMessage('Service request submitted successfully! We will contact you soon.', 'success');
  
  // Don't reset form - keep data for verification
  // Reset border colors only
  const inputs = event.target.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.style.borderColor = '#e9ecef';
  });
    
    // Log form data to console (for debugging)
    console.log('Form submitted with data:', data);
}

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('serviceForm');
    form.addEventListener('submit', handleSubmit);
    
    // Ensure only the first section (Customer Information) is open by default
    const allSections = document.querySelectorAll('.form-section');
    allSections.forEach((section, index) => {
        const content = section.querySelector('.section-content');
        const icon = section.querySelector('.toggle-icon');
        if (index === 0) {
            // First section should be open
            content.style.display = 'block';
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-down');
        } else {
            // All other sections should be closed
            content.style.display = 'none';
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    });
    
    // Add input event listeners to clear error styling on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(220, 53, 69)') {
                this.style.borderColor = '#e9ecef';
            }
        });
    });
    
    // Auto-expand sections when user starts typing in collapsed sections
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const section = this.closest('.form-section');
            const content = section.querySelector('.section-content');
            if (content.style.display === 'none') {
                toggleSection(section.id);
            }
        });
    });
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const section = this.closest('.form-section');
            const content = section.querySelector('.section-content');
            
            // Smooth scroll to section if it's being expanded
            if (content.style.display === 'none' || content.style.display === '') {
                setTimeout(() => {
                    section.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }, 100);
            }
        });
    });
}); 