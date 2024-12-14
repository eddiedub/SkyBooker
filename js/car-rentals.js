// Sample data for locations
const locations = [
    { name: 'JFK Airport', type: 'Airport', city: 'New York', country: 'USA' },
    { name: 'LAX Airport', type: 'Airport', city: 'Los Angeles', country: 'USA' },
    { name: 'Manhattan', type: 'City Center', city: 'New York', country: 'USA' },
    { name: 'Downtown LA', type: 'City Center', city: 'Los Angeles', country: 'USA' },
    { name: 'O\'Hare Airport', type: 'Airport', city: 'Chicago', country: 'USA' },
    { name: 'Heathrow Airport', type: 'Airport', city: 'London', country: 'UK' },
    { name: 'Charles de Gaulle Airport', type: 'Airport', city: 'Paris', country: 'France' },
    { name: 'Central Station', type: 'Train Station', city: 'Amsterdam', country: 'Netherlands' }
];

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const pickupLocation = document.getElementById('pickup-location');
    const returnLocation = document.getElementById('return-location');
    const sameLocationCheckbox = document.getElementById('same-location');
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    const searchBtn = document.querySelector('.search-btn');

    // Set minimum dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    pickupDate.min = formatDate(today);
    returnDate.min = formatDate(tomorrow);

    // Handle same location toggle
    sameLocationCheckbox.addEventListener('change', function() {
        returnLocation.disabled = this.checked;
        if (this.checked) {
            returnLocation.value = pickupLocation.value;
        }
    });

    // Pickup date change handler
    pickupDate.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        returnDate.min = formatDate(nextDay);
        
        if (returnDate.value && new Date(returnDate.value) <= selectedDate) {
            returnDate.value = formatDate(nextDay);
        }
    });

    // Location Search
    function createLocationSuggestion(location) {
        const li = document.createElement('li');
        
        const name = document.createElement('div');
        name.className = 'location-name';
        name.textContent = location.name;
        
        const details = document.createElement('div');
        details.className = 'location-details';
        details.textContent = `${location.type} • ${location.city}, ${location.country}`;
        
        li.appendChild(name);
        li.appendChild(details);
        
        return li;
    }

    function setupLocationInput(input) {
        let currentFocus = -1;
        
        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            closeAllLists();
            
            if (!value) return;
            
            const matches = locations.filter(location => 
                location.name.toLowerCase().includes(value) ||
                location.city.toLowerCase().includes(value) ||
                location.country.toLowerCase().includes(value)
            );

            if (matches.length > 0) {
                const suggestionList = document.createElement('ul');
                suggestionList.className = 'location-suggestions';
                
                matches.forEach(location => {
                    const li = createLocationSuggestion(location);
                    li.addEventListener('click', () => {
                        input.value = location.name;
                        if (input === pickupLocation && sameLocationCheckbox.checked) {
                            returnLocation.value = location.name;
                        }
                        closeAllLists();
                    });
                    suggestionList.appendChild(li);
                });

                input.parentNode.appendChild(suggestionList);
            }
        });

        // Keyboard navigation
        input.addEventListener('keydown', function(e) {
            let suggestionList = document.querySelector('.location-suggestions');
            if (!suggestionList) return;
            
            const items = suggestionList.getElementsByTagName('li');
            
            if (e.key === 'ArrowDown') {
                currentFocus++;
                addActive(items);
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                currentFocus--;
                addActive(items);
                e.preventDefault();
            } else if (e.key === 'Enter' && currentFocus > -1) {
                if (items[currentFocus]) {
                    items[currentFocus].click();
                    e.preventDefault();
                }
            }
        });

        function addActive(items) {
            if (!items) return;
            removeActive(items);
            if (currentFocus >= items.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = items.length - 1;
            items[currentFocus].classList.add('active');
            items[currentFocus].scrollIntoView({ block: 'nearest' });
        }

        function removeActive(items) {
            Array.from(items).forEach(item => item.classList.remove('active'));
        }
    }

    function closeAllLists() {
        const suggestions = document.querySelectorAll('.location-suggestions');
        suggestions.forEach(list => list.remove());
    }

    // Setup location inputs
    setupLocationInput(pickupLocation);
    setupLocationInput(returnLocation);

    // Close location suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.matches('#pickup-location, #return-location')) {
            closeAllLists();
        }
    });

    // Search Validation
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset previous error states
        resetErrorStates();

        let isValid = true;

        // Validate pickup location
        if (!pickupLocation.value.trim()) {
            showError(pickupLocation, 'Please enter a pickup location');
            isValid = false;
        }

        // Validate return location if enabled
        if (!sameLocationCheckbox.checked && !returnLocation.value.trim()) {
            showError(returnLocation, 'Please enter a return location');
            isValid = false;
        }

        // Validate pickup date
        if (!pickupDate.value) {
            showError(pickupDate, 'Please select a pickup date');
            isValid = false;
        }

        // Validate return date
        if (!returnDate.value) {
            showError(returnDate, 'Please select a return date');
            isValid = false;
        }

        if (isValid) {
            showSuccessMessage('Searching for available cars...');
            // Simulate search delay
            setTimeout(() => {
                alert('This is a demo website. In a real application, this would search for actual car rentals.');
            }, 1500);
        }
    });

    // Helper Functions
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function showError(element, message) {
        element.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);
    }

    function resetErrorStates() {
        document.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
    }

    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        searchBtn.parentNode.appendChild(successDiv);
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Populate time dropdowns
    const timeSelects = document.querySelectorAll('#pickup-time, #return-time');
    timeSelects.forEach(select => {
        for (let hour = 0; hour < 24; hour++) {
            for (let minute of ['00', '30']) {
                const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                const displayHour = hour % 12 || 12;
                const ampm = hour < 12 ? 'AM' : 'PM';
                const option = document.createElement('option');
                option.value = time;
                option.textContent = `${displayHour}:${minute} ${ampm}`;
                select.appendChild(option);
            }
        }
    });
});
