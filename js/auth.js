document.addEventListener('DOMContentLoaded', function() {
    // Password Toggle Functionality
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Password Validation (Register Page)
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        const requirements = {
            length: document.getElementById('length'),
            uppercase: document.getElementById('uppercase'),
            lowercase: document.getElementById('lowercase'),
            number: document.getElementById('number'),
            special: document.getElementById('special')
        };

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            // Check length
            if (password.length >= 8) {
                requirements.length.classList.add('valid');
            } else {
                requirements.length.classList.remove('valid');
            }

            // Check uppercase
            if (/[A-Z]/.test(password)) {
                requirements.uppercase.classList.add('valid');
            } else {
                requirements.uppercase.classList.remove('valid');
            }

            // Check lowercase
            if (/[a-z]/.test(password)) {
                requirements.lowercase.classList.add('valid');
            } else {
                requirements.lowercase.classList.remove('valid');
            }

            // Check number
            if (/[0-9]/.test(password)) {
                requirements.number.classList.add('valid');
            } else {
                requirements.number.classList.remove('valid');
            }

            // Check special character
            if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                requirements.special.classList.add('valid');
            } else {
                requirements.special.classList.remove('valid');
            }
        });
    }

    // Form Submission Handling
    const registerForm = document.getElementById('register-form');
    const signinForm = document.getElementById('signin-form');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('.auth-submit');
            
            // Validate password requirements
            const password = passwordInput.value;
            const isValid = 
                password.length >= 8 &&
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /[0-9]/.test(password) &&
                /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (!isValid) {
                showError('Please meet all password requirements');
                return;
            }

            // Validate password confirmation
            const confirmPassword = document.getElementById('confirm-password').value;
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            // Show loading state
            submitButton.classList.add('loading');
            
            // Simulate API call
            setTimeout(() => {
                submitButton.classList.remove('loading');
                // Redirect to success page or show success message
                showSuccess('Account created successfully! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 2000);
            }, 1500);
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('.auth-submit');
            
            // Show loading state
            submitButton.classList.add('loading');
            
            // Simulate API call
            setTimeout(() => {
                submitButton.classList.remove('loading');
                // Redirect to dashboard or show error
                showSuccess('Sign in successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }, 1500);
        });
    }

    // Social Authentication Handlers
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            // Simulate social auth
            showInfo(`Connecting to ${provider}...`);
        });
    });

    // Helper Functions
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.backgroundColor = '#dc3545';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '1rem';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.marginBottom = '1rem';
        errorDiv.textContent = message;

        const form = document.querySelector('.auth-form');
        form.insertBefore(errorDiv, form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.backgroundColor = '#28a745';
        successDiv.style.color = 'white';
        successDiv.style.padding = '1rem';
        successDiv.style.borderRadius = '4px';
        successDiv.style.marginBottom = '1rem';
        successDiv.textContent = message;

        const form = document.querySelector('.auth-form');
        form.insertBefore(successDiv, form.firstChild);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    function showInfo(message) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-message';
        infoDiv.style.backgroundColor = '#17a2b8';
        infoDiv.style.color = 'white';
        infoDiv.style.padding = '1rem';
        infoDiv.style.borderRadius = '4px';
        infoDiv.style.marginBottom = '1rem';
        infoDiv.textContent = message;

        const form = document.querySelector('.auth-form');
        form.insertBefore(infoDiv, form.firstChild);

        setTimeout(() => {
            infoDiv.remove();
        }, 3000);
    }
});
