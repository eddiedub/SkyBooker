document.addEventListener('DOMContentLoaded', function() {
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.legal-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');

                // Scroll to section with offset for fixed header
                const headerOffset = 90;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });

    // Scroll to Top Button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    // Show/Hide Scroll to Top Button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to Top Functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Active Section Tracking
    const sections = document.querySelectorAll('.legal-content section');
    const navItems = document.querySelectorAll('.legal-nav a');

    function setActiveNavItem() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentSection) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavItem);

    // Table of Contents Mobile Toggle
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i> Table of Contents';
    
    const sidebar = document.querySelector('.legal-sidebar');
    if (window.innerWidth <= 768) {
        sidebar.insertBefore(sidebarToggle, sidebar.firstChild);
        sidebar.querySelector('.legal-nav').style.display = 'none';
    }

    sidebarToggle.addEventListener('click', function() {
        const nav = sidebar.querySelector('.legal-nav');
        const isHidden = nav.style.display === 'none';
        nav.style.display = isHidden ? 'block' : 'none';
        this.innerHTML = isHidden ? 
            '<i class="fas fa-times"></i> Close' : 
            '<i class="fas fa-bars"></i> Table of Contents';
    });

    // Handle Window Resize
    window.addEventListener('resize', function() {
        const nav = sidebar.querySelector('.legal-nav');
        if (window.innerWidth > 768) {
            if (!sidebar.contains(sidebarToggle)) {
                sidebar.insertBefore(sidebarToggle, sidebar.firstChild);
            }
            nav.style.display = 'block';
            sidebarToggle.style.display = 'none';
        } else {
            sidebarToggle.style.display = 'flex';
            nav.style.display = 'none';
        }
    });

    // Add styles for mobile toggle button
    const style = document.createElement('style');
    style.textContent = `
        .sidebar-toggle {
            display: none;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.8rem;
            margin-bottom: 1rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
        }

        @media (max-width: 768px) {
            .sidebar-toggle {
                display: flex;
            }
        }

        .sidebar-toggle:hover {
            background: var(--secondary-color);
        }
    `;
    document.head.appendChild(style);

    // Print Handler
    window.addEventListener('beforeprint', function() {
        // Expand all sections for printing
        document.querySelectorAll('.legal-nav').forEach(nav => {
            nav.style.display = 'block';
        });
    });

    // Copy Link Button for Sections
    sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-link-btn';
            copyBtn.innerHTML = '<i class="fas fa-link"></i>';
            copyBtn.title = 'Copy link to section';
            
            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = section.getAttribute('id');
                const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
                
                navigator.clipboard.writeText(url).then(() => {
                    // Show success tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'copy-tooltip';
                    tooltip.textContent = 'Link copied!';
                    this.appendChild(tooltip);
                    
                    setTimeout(() => tooltip.remove(), 2000);
                });
            });

            heading.appendChild(copyBtn);
        }
    });

    // Add styles for copy link button and tooltip
    const copyLinkStyles = document.createElement('style');
    copyLinkStyles.textContent = `
        .copy-link-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            padding: 0;
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            margin-left: 0.5rem;
            opacity: 0;
            transition: opacity 0.3s;
        }

        h2:hover .copy-link-btn {
            opacity: 1;
        }

        .copy-link-btn:hover {
            color: var(--primary-color);
        }

        .copy-tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-left: 0.5rem;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(copyLinkStyles);
});
