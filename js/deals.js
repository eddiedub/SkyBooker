document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const dealCards = document.querySelectorAll('.deal-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            dealCards.forEach(card => {
                // First remove any existing animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = null;

                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.classList.remove('hidden');
                    // Add animation
                    card.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for subscribing to our newsletter!';
            successMessage.style.color = 'white';
            successMessage.style.marginTop = '1rem';

            // Remove any existing success message
            const existingMessage = newsletterForm.querySelector('.success-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Add new success message
            newsletterForm.appendChild(successMessage);

            // Clear input
            emailInput.value = '';

            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }

    // Deal card hover effects
    dealCards.forEach(card => {
        const button = card.querySelector('.btn-primary');
        
        card.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });

        // View Deal button click handler
        button.addEventListener('click', () => {
            const dealTitle = card.querySelector('h3').textContent;
            alert(`This is a demo website. In a real application, this would take you to the booking page for: ${dealTitle}`);
        });
    });

    // Add smooth scroll for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize with "All Deals" filter active
    const allDealsBtn = document.querySelector('[data-filter="all"]');
    if (allDealsBtn) {
        allDealsBtn.classList.add('active');
    }

    // Add loading animation when switching between deals
    function addLoadingEffect(card) {
        card.style.opacity = '0.7';
        card.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 300);
    }

    // Optional: Add price animation
    const dealTags = document.querySelectorAll('.deal-tag');
    dealTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.1)';
            tag.style.transition = 'transform 0.3s';
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1)';
        });
    });
});
