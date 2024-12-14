document.addEventListener('DOMContentLoaded', function() {
    // FAQ Category Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const faqCategories = document.querySelectorAll('.faq-category');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and categories
            tabButtons.forEach(btn => btn.classList.remove('active'));
            faqCategories.forEach(category => category.classList.remove('active'));

            // Add active class to clicked button and corresponding category
            button.classList.add('active');
            const categoryId = button.getAttribute('data-category');
            document.getElementById(categoryId).classList.add('active');
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');

            // Animate icon
            const icon = question.querySelector('i');
            icon.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('faq-search');
    const allQuestions = document.querySelectorAll('.faq-question h3');
    const allAnswers = document.querySelectorAll('.faq-answer');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length > 2) {
            // Show all categories for searching
            faqCategories.forEach(category => category.style.display = 'block');
            
            let hasResults = false;

            // Search through questions and answers
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    hasResults = true;
                    
                    // Highlight matching text
                    highlightText(item, searchTerm);
                } else {
                    item.style.display = 'none';
                }
            });

            // Show no results message if needed
            const noResults = document.querySelector('.no-results');
            if (!hasResults) {
                if (!noResults) {
                    const message = document.createElement('div');
                    message.className = 'no-results';
                    message.innerHTML = `
                        <p>No results found for "${searchTerm}"</p>
                        <p>Try different keywords or <a href="#" class="clear-search">clear search</a></p>
                    `;
                    document.querySelector('.faq-container').appendChild(message);

                    // Add clear search functionality
                    message.querySelector('.clear-search').addEventListener('click', (e) => {
                        e.preventDefault();
                        searchInput.value = '';
                        resetSearch();
                    });
                }
            } else if (noResults) {
                noResults.remove();
            }
        } else {
            resetSearch();
        }
    });

    function highlightText(item, searchTerm) {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer');

        // Remove existing highlights
        [question, answer].forEach(element => {
            element.innerHTML = element.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/g, '$1');
        });

        // Add new highlights
        const regex = new RegExp(searchTerm, 'gi');
        [question, answer].forEach(element => {
            element.innerHTML = element.innerHTML.replace(regex, match => 
                `<mark class="highlight">${match}</mark>`
            );
        });
    }

    function resetSearch() {
        // Remove highlights
        document.querySelectorAll('.highlight').forEach(mark => {
            const text = mark.textContent;
            mark.replaceWith(text);
        });

        // Reset display
        faqItems.forEach(item => item.style.display = 'block');
        
        // Show only active category
        faqCategories.forEach(category => {
            category.style.display = category.classList.contains('active') ? 'block' : 'none';
        });

        // Remove no results message
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }

    // Print FAQ Button
    const printButton = document.createElement('button');
    printButton.className = 'print-btn';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print FAQs';
    document.querySelector('.faq-categories').appendChild(printButton);

    printButton.addEventListener('click', () => {
        window.print();
    });

    // Add smooth scroll for anchor links
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

    // Add CSS for print button
    const style = document.createElement('style');
    style.textContent = `
        .print-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            padding: 0.8rem 1.5rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s;
            z-index: 100;
        }

        .print-btn:hover {
            background-color: var(--secondary-color);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        @media print {
            .print-btn {
                display: none;
            }
        }

        @media (max-width: 768px) {
            .print-btn {
                bottom: 1rem;
                right: 1rem;
                padding: 0.6rem 1rem;
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);
});
