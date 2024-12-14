// Sample data for locations
const locations = [
    { name: 'Paris', country: 'France', type: 'City', properties: 1234 },
    { name: 'London', country: 'United Kingdom', type: 'City', properties: 2345 },
    { name: 'New York', country: 'United States', type: 'City', properties: 3456 },
    { name: 'Tokyo', country: 'Japan', type: 'City', properties: 2789 },
    { name: 'Dubai', country: 'UAE', type: 'City', properties: 945 },
    { name: 'Eiffel Tower', country: 'France', type: 'Landmark', properties: 156 },
    { name: 'Times Square', country: 'United States', type: 'Landmark', properties: 89 },
    { name: 'Burj Khalifa', country: 'UAE', type: 'Landmark', properties: 67 },
    { name: 'The Ritz Paris', country: 'France', type: 'Property', properties: 1 },
    { name: 'The Plaza', country: 'United States', type: 'Property', properties: 1 }
];

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const guestSelect = document.getElementById('guest-select');
    const guestModal = document.getElementById('guest-modal');
    const applyGuestSelection = document.getElementById('apply-guest-selection');
    const searchBtn = document.querySelector('.search-btn');
    const destinationInput = document.getElementById('destination');
    const checkInDate = document.getElementById('check-in-date');
    const checkOutDate = document.getElementById('check-out-date');

    // Set minimum dates for check-in and check-out
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    checkInDate.min = formatDate(today);
    checkOutDate.min = formatDate(tomorrow);

    // Check-in date change handler
    checkInDate.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutDate.min = formatDate(nextDay);
        
        if (checkOutDate.value && new Date(checkOutDate.value) <= selectedDate) {
            checkOutDate.value = formatDate(nextDay);
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
        details.textContent = `${location.type} • ${location.country} • ${location.properties} properties`;
        
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
                location.country.toLowerCase().includes(value)
            );

            if (matches.length > 0) {
                const suggestionList = document.createElement('ul');
                suggestionList.className = 'location-suggestions';
                
                matches.forEach(location => {
                    const li = createLocationSuggestion(location);
                    li.addEventListener('click', () => {
                        input.value = location.name;
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

    // Setup location input
    setupLocationInput(destinationInput);

    // Close location suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.matches('#destination')) {
            closeAllLists();
        }
    });

    // Guest Modal Toggle
    guestSelect.addEventListener('click', () => {
        guestModal.style.display = 'block';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === guestModal) {
            guestModal.style.display = 'none';
        }
    });

    // Handle guest selection
    const numberInputs = document.querySelectorAll('.number-input');
    numberInputs.forEach(input => {
        const decrementBtn = input.querySelector('.minus');
        const incrementBtn = input.querySelector('.plus');
        const numberField = input.querySelector('input');

        decrementBtn.addEventListener('click', () => {
            if (parseInt(numberField.value) > parseInt(numberField.min)) {
                numberField.value = parseInt(numberField.value) - 1;
            }
        });

        incrementBtn.addEventListener('click', () => {
            if (parseInt(numberField.value) < parseInt(numberField.max)) {
                numberField.value = parseInt(numberField.value) + 1;
            }
        });
    });

    // Apply guest selection
    applyGuestSelection.addEventListener('click', () => {
        const adults = document.querySelector('.guest-type:nth-child(1) input').value;
        const children = document.querySelector('.guest-type:nth-child(2) input').value;
        const rooms = document.querySelector('.guest-type:nth-child(3) input').value;

        const totalGuests = parseInt(adults) + parseInt(children);
        
        guestSelect.querySelector('span').textContent = 
            `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}, ${rooms} Room${rooms > 1 ? 's' : ''}`;
        
        guestModal.style.display = 'none';
    });

    // Search Validation
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset previous error states
        resetErrorStates();

        let isValid = true;

        // Validate destination
        if (!destinationInput.value.trim()) {
            showError(destinationInput, 'Please enter a destination');
            isValid = false;
        }

        // Validate check-in date
        if (!checkInDate.value) {
            showError(checkInDate, 'Please select a check-in date');
            isValid = false;
        }

        // Validate check-out date
        if (!checkOutDate.value) {
            showError(checkOutDate, 'Please select a check-out date');
            isValid = false;
        }

        if (isValid) {
            showSuccessMessage('Searching for hotels...');
            // Simulate search delay
            setTimeout(() => {
                alert('This is a demo website. In a real application, this would search for actual hotels.');
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
});
