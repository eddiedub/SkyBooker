import airports from './airports.js';

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const passengerSelect = document.getElementById('passenger-select');
    const passengerModal = document.getElementById('passenger-modal');
    const applyPassengerSelection = document.getElementById('apply-passenger-selection');
    const tripTypeInputs = document.querySelectorAll('input[name="trip-type"]');
    const returnDateInput = document.getElementById('return-date');
    const searchBtn = document.querySelector('.search-btn');
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const departureDate = document.getElementById('departure-date');
    const returnDate = document.getElementById('return-date');

    // Set minimum dates for departure and return
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    departureDate.min = formatDate(today);
    returnDate.min = formatDate(tomorrow);

    // Enhanced Airport Search
    function createAirportSuggestion(airport) {
        const li = document.createElement('li');
        
        const code = document.createElement('div');
        code.className = 'airport-code';
        code.textContent = airport.code;
        
        const name = document.createElement('div');
        name.className = 'airport-name';
        name.textContent = airport.name;
        
        const location = document.createElement('div');
        location.className = 'airport-location';
        location.textContent = `${airport.city}, ${airport.country}`;
        
        li.appendChild(code);
        li.appendChild(name);
        li.appendChild(location);
        
        return li;
    }

    function setupAirportInput(input) {
        let currentFocus = -1;
        
        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            closeAllLists();
            
            if (!value) return;
            
            const matches = airports.filter(airport => 
                airport.code.toLowerCase().includes(value) ||
                airport.name.toLowerCase().includes(value) ||
                airport.city.toLowerCase().includes(value) ||
                airport.country.toLowerCase().includes(value)
            );

            if (matches.length > 0) {
                const suggestionList = document.createElement('ul');
                suggestionList.className = 'airport-suggestions';
                
                matches.forEach(airport => {
                    const li = createAirportSuggestion(airport);
                    li.addEventListener('click', () => {
                        input.value = `${airport.city} (${airport.code})`;
                        closeAllLists();
                    });
                    suggestionList.appendChild(li);
                });

                input.parentNode.appendChild(suggestionList);
            }
        });

        // Keyboard navigation
        input.addEventListener('keydown', function(e) {
            let suggestionList = document.querySelector('.airport-suggestions');
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
        const suggestions = document.querySelectorAll('.airport-suggestions');
        suggestions.forEach(list => list.remove());
    }

    // Setup airport inputs
    setupAirportInput(originInput);
    setupAirportInput(destinationInput);

    // Close airport suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.matches('#origin, #destination')) {
            closeAllLists();
        }
    });

    // Passenger Modal Toggle
    passengerSelect.addEventListener('click', () => {
        passengerModal.style.display = 'block';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === passengerModal) {
            passengerModal.style.display = 'none';
        }
    });

    // Handle passenger selection
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

    // Apply passenger selection
    applyPassengerSelection.addEventListener('click', () => {
        const adults = document.querySelector('.passenger-type:nth-child(1) input').value;
        const children = document.querySelector('.passenger-type:nth-child(2) input').value;
        const infants = document.querySelector('.passenger-type:nth-child(3) input').value;
        const travelClass = document.querySelector('.class-select select').value;

        const totalPassengers = parseInt(adults) + parseInt(children) + parseInt(infants);
        const classDisplay = travelClass.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        passengerSelect.querySelector('span').textContent = 
            `${totalPassengers} Passenger${totalPassengers > 1 ? 's' : ''}, ${classDisplay}`;
        
        passengerModal.style.display = 'none';
    });

    // Trip Type Handler
    tripTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.value === 'one-way') {
                returnDateInput.disabled = true;
                returnDateInput.value = '';
            } else {
                returnDateInput.disabled = false;
            }
        });
    });

    // Search Validation
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset previous error states
        resetErrorStates();

        let isValid = true;
        const errors = [];

        // Validate origin
        if (!originInput.value.trim()) {
            showError(originInput, 'Please select a departure airport');
            isValid = false;
        }

        // Validate destination
        if (!destinationInput.value.trim()) {
            showError(destinationInput, 'Please select an arrival airport');
            isValid = false;
        }

        // Validate departure date
        if (!departureDate.value) {
            showError(departureDate, 'Please select a departure date');
            isValid = false;
        }

        // Validate return date for round trips
        const selectedTripType = document.querySelector('input[name="trip-type"]:checked').value;
        if (selectedTripType === 'round-trip' && !returnDate.value) {
            showError(returnDate, 'Please select a return date');
            isValid = false;
        }

        if (isValid) {
            showSuccessMessage('Searching for flights...');
            // Simulate search delay
            setTimeout(() => {
                alert('This is a demo website. In a real application, this would search for actual flights.');
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
