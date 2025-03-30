document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.portfolio-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const detailsContainer = document.getElementById('project-details-container');
    const detailsContent = document.getElementById('project-content');
    const closeDetailsBtn = document.getElementById('close-details-btn');
    const footerYear = document.getElementById('current-year');
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('main section[id]'); // Sections with IDs

    // --- Carousel Variables ---
    const totalItems = items.length;
    let angle = 0; // Will be calculated
    let currentAngle = 0;
    let radius = 0; // Will be calculated

    // --- Functions ---

    // Get carousel radius from CSS variable dynamically
    function getCarouselRadius() {
        const radiusString = getComputedStyle(document.documentElement).getPropertyValue('--carousel-radius').trim();
        return parseInt(radiusString, 10) || 400; // Default value
    }

    // Position Carousel Items
    function positionItems() {
        if (totalItems === 0) return; // Avoid division by zero if no items

        radius = getCarouselRadius(); // Get current radius
        angle = 360 / totalItems; // Calculate angle based on item count

        items.forEach((item, index) => {
            const itemAngle = angle * index;
            // Store original transform for hover effect combination
            const transformValue = `rotateY(${itemAngle}deg) translateZ(${radius}px)`;
            item.style.transform = transformValue;
            // Add a CSS variable to the item itself to easily access during hover
            item.style.setProperty('--item-transform', transformValue);
        });

        // Initial carousel position (needs recalculation if radius changes)
        carousel.style.transform = `translateZ(${radius * -1}px) rotateY(${currentAngle}deg)`;
    }

    // Rotate Carousel
    function rotateCarousel() {
        radius = getCarouselRadius(); // Ensure radius is current
        carousel.style.transform = `translateZ(${radius * -1}px) rotateY(${currentAngle}deg)`;
    }

    // Update Footer Year
    function updateFooterYear() {
        if (footerYear) {
            footerYear.textContent = new Date().getFullYear();
        }
    }

    // Update Active Navigation Link based on Scroll Position
    function updateActiveNavLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust offset (e.g., header height)
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Debounce function to limit resize/scroll event frequency
    function debounce(func, wait = 15, immediate = false) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }


    // --- Project Data (Replace with your actual data) ---
    const projectData = {
        project1: {
            title: "Project Alpha: Interactive Viz",
            description: "A web-based platform for visualizing complex datasets using D3.js, featuring interactive charts and user-driven exploration.",
            image: "https://via.placeholder.com/600x400/FF5733/FFFFFF?text=Project+Alpha+Detail",
            details: "Tech Stack: D3.js, React, Node.js, Express. Focused on performance optimization for large datasets and intuitive UI design."
            // link: "#" // Optional link to live project or repo
        },
        project2: {
            title: "Project Beta: E-commerce Hub",
            description: "Developed a full-stack e-commerce solution with user authentication, product management, and a secure checkout process.",
            image: "https://via.placeholder.com/600x400/33FF57/FFFFFF?text=Project+Beta+Detail",
            details: "Tech Stack: Vue.js, Vuex, Node.js, MongoDB, Stripe API. Implemented RESTful APIs and ensured responsive design across all devices."
        },
        project3: {
            title: "Project Gamma: Generative Art Gallery",
            description: "An online gallery showcasing generative art pieces created using p5.js. Allows users to tweak parameters and see art evolve.",
            image: "https://via.placeholder.com/600x400/3357FF/FFFFFF?text=Project+Gamma+Detail",
            details: "Tech Stack: p5.js, Vanilla JavaScript, HTML5 Canvas. Explored algorithms for pattern generation and interactive art creation."
        },
         project4: {
            title: "Project Delta: Component Library",
            description: "Built a reusable UI component library for a design system, ensuring consistency and developer efficiency across projects.",
            image: "https://via.placeholder.com/600x400/F1C40F/FFFFFF?text=Project+Delta+Detail",
            details: "Tech Stack: React, Storybook, Styled Components/Tailwind CSS. Focused on accessibility (WCAG), modularity, and comprehensive documentation."
        },
        project5: {
            title: "Project Epsilon: Portfolio Engine",
            description: "The very portfolio site you are viewing now, built with CSS 3D transforms, animations, and dynamic content loading.",
            image: "https://via.placeholder.com/600x400/9B59B6/FFFFFF?text=Project+Epsilon+Detail",
            details: "Tech Stack: HTML5, CSS3 (Flexbox, Grid, Animations, 3D Transforms), Vanilla JavaScript. Emphasized clean code, performance, and responsive design."
        },
        project6: {
            title: "Project Zeta: Mobile PWA",
            description: "A Progressive Web App designed for task management, featuring offline capabilities and push notifications.",
            image: "https://via.placeholder.com/600x400/E74C3C/FFFFFF?text=Project+Zeta+Detail",
            details: "Tech Stack: Angular, Ionic Framework, Firebase (Firestore, Cloud Functions). Utilized Service Workers for offline functionality and PWA manifests."
        }
    };


    // --- Event Listeners ---

    // Carousel Navigation
    if (prevBtn && nextBtn && totalItems > 0) {
        nextBtn.addEventListener('click', () => {
            currentAngle -= angle;
            rotateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentAngle += angle;
            rotateCarousel();
        });
    }

    // Project Item Clicks (Dynamic Content)
    items.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project-id');
            const data = projectData[projectId];

            if (data && detailsContent && detailsContainer) {
                // Use textContent for safety against XSS unless HTML is intended
                detailsContent.innerHTML = `
                    <h2 id="details-title">${data.title}</h2>
                    <img src="${data.image}" alt="${data.title}" class="details-image">
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Details:</strong> ${data.details}</p>
                    ${data.link ? `<p><a href="${data.link}" target="_blank" rel="noopener noreferrer" class="cta-button">View Project</a></p>` : ''}
                `;
                detailsContainer.removeAttribute('hidden'); // Show modal
                detailsContainer.focus(); // Focus modal for accessibility
            } else if (detailsContent && detailsContainer) {
                detailsContent.innerHTML = '<h2 id="details-title">Error</h2><p>Project details could not be loaded.</p>';
                detailsContainer.removeAttribute('hidden');
                detailsContainer.focus();
            }
        });
    });

    // Close Project Details Modal
    if (closeDetailsBtn && detailsContainer) {
        closeDetailsBtn.addEventListener('click', () => {
            detailsContainer.setAttribute('hidden', true); // Hide modal
        });
    }
     // Close modal on background click
    if (detailsContainer) {
        detailsContainer.addEventListener('click', (event) => {
            if (event.target === detailsContainer) {
                 detailsContainer.setAttribute('hidden', true);
            }
        });
    }
    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !detailsContainer.hasAttribute('hidden')) {
            detailsContainer.setAttribute('hidden', true);
        }
    });


    // Window Resize Listener (Debounced)
    const handleResize = debounce(() => {
        if (carousel) {
             // Disable transition during resize adjustment for instant update
            carousel.style.transition = 'none';
            positionItems(); // Reposition items and update carousel transform
            // Force reflow might sometimes be needed, but often not critical
            // carousel.offsetHeight;
            // Re-enable transition after a short delay
            setTimeout(() => {
                 if (carousel) { // Check again in case element removed
                    carousel.style.transition = 'transform 1s cubic-bezier(0.77, 0, 0.175, 1)';
                 }
            }, 50);
        }
        updateActiveNavLink(); // Update nav on resize too
    }, 200); // 200ms delay

    window.addEventListener('resize', handleResize);

    // Scroll Listener for Active Nav Link (Debounced)
    const handleScroll = debounce(() => {
        updateActiveNavLink();
    }, 50); // Check scroll position frequently but efficiently

    window.addEventListener('scroll', handleScroll);


    // --- Initial Setup Calls ---
    if (carousel) {
        positionItems(); // Position carousel items on load
    }
    updateFooterYear(); // Set current year in footer
    updateActiveNavLink(); // Set initial active nav link

    // Optional: Handle form submission (prevents default reload)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the form data via AJAX/Fetch
            console.log('Form submitted (prevented default)');
            alert('Thank you for your message! (Form submission logic not implemented in this demo)');
            contactForm.reset(); // Clear the form
        });
    }

}); // End DOMContentLoaded
