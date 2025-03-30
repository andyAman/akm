document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.portfolio-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const detailsContainer = document.getElementById('project-details-container');
    const detailsContent = document.getElementById('project-content');
    const closeDetailsBtn = document.getElementById('close-details-btn');

    const totalItems = items.length;
    const angle = 360 / totalItems;
    const radius = getCarouselRadius(); // Get radius from CSS variable

    let currentAngle = 0;

    // Function to get carousel radius from CSS variable
    function getCarouselRadius() {
        const radiusString = getComputedStyle(document.documentElement).getPropertyValue('--carousel-radius').trim();
        return parseInt(radiusString, 10) || 400; // Default value if parsing fails
    }

    // 1. Position Items in 3D Space
    function positionItems() {
        const currentRadius = getCarouselRadius(); // Recalculate if window resized
        items.forEach((item, index) => {
            const itemAngle = angle * index;
            // Calculate transform: rotateY first, then translateZ
            item.style.transform = `rotateY(${itemAngle}deg) translateZ(${currentRadius}px)`;
        });
    }

    // 2. Rotate Carousel Function
    function rotateCarousel() {
        carousel.style.transform = `translateZ(${getCarouselRadius() * -1}px) rotateY(${currentAngle}deg)`;
    }

    // 3. Navigation Button Event Listeners
    nextBtn.addEventListener('click', () => {
        currentAngle -= angle;
        rotateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentAngle += angle;
        rotateCarousel();
    });

    // 4. Dynamic Content Loading & Display
    // Dummy project data (replace with your actual project details)
    const projectData = {
        project1: {
            title: "Project One: The Catalyst",
            description: "This project focused on creating a dynamic web application using modern frontend frameworks. It involved complex state management and API integrations.",
            image: "https://via.placeholder.com/600x400/FF5733/FFFFFF?text=Project+1+Detail",
            details: "Built with React, Redux, and Node.js. Features include real-time updates and user authentication."
        },
        project2: {
            title: "Project Two: Green Thumb",
            description: "An interactive platform for plant enthusiasts. Users can identify plants, track growth, and connect with others.",
            image: "https://via.placeholder.com/600x400/33FF57/FFFFFF?text=Project+2+Detail",
            details: "Developed using Vue.js and Firebase. Integrated a machine learning model for plant identification."
        },
        project3: {
            title: "Project Three: Web Weaver",
            description: "A comprehensive portfolio website showcasing advanced CSS animations and responsive design techniques.",
            image: "https://via.placeholder.com/600x400/3357FF/FFFFFF?text=Project+3+Detail",
            details: "Pure HTML, CSS (Flexbox, Grid, Animations), and JavaScript. Optimized for performance and accessibility."
        },
         project4: {
            title: "Project Four: Pixel Perfect",
            description: "A design system and component library created for consistency across multiple web applications.",
            image: "https://via.placeholder.com/600x400/F1C40F/FFFFFF?text=Project+4+Detail",
            details: "Tools used: Figma for design, Storybook for component documentation, built with styled-components."
        },
        project5: {
            title: "Project Five: Interactive Insights",
            description: "A data visualization dashboard displaying complex datasets in an easily understandable format.",
            image: "https://via.placeholder.com/600x400/9B59B6/FFFFFF?text=Project+5+Detail",
            details: "Utilized D3.js for custom visualizations and React for the user interface."
        },
        project6: {
            title: "Project Six: Mobile First",
            description: "A progressive web application (PWA) designed for seamless mobile experience, including offline capabilities.",
            image: "https://via.placeholder.com/600x400/E74C3C/FFFFFF?text=Project+6+Detail",
            details: "Built with Angular and Ionic. Implemented service workers for offline access and push notifications."
        }
        // Add data for other projects...
    };

    items.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project-id');
            const data = projectData[projectId];

            if (data) {
                detailsContent.innerHTML = `
                    <h2>${data.title}</h2>
                    <img src="${data.image}" alt="${data.title}" class="details-image">
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Details:</strong> ${data.details}</p>
                    `;
                detailsContainer.classList.add('visible');
            } else {
                detailsContent.innerHTML = '<p>Project details not found.</p>';
                detailsContainer.classList.add('visible');
            }
        });
    });

    // Close details view
    closeDetailsBtn.addEventListener('click', () => {
        detailsContainer.classList.remove('visible');
    });

    // Close details view if clicking outside the content area
    detailsContainer.addEventListener('click', (event) => {
        if (event.target === detailsContainer) {
            detailsContainer.classList.remove('visible');
        }
    });


    // 5. Responsive Adjustments (Recalculate positioning on resize)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize event
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            positionItems(); // Reposition based on new radius
             // Adjust translateZ in carousel transform to keep it centered
            carousel.style.transition = 'none'; // Disable transition during resize adjustment
            carousel.style.transform = `translateZ(${getCarouselRadius() * -1}px) rotateY(${currentAngle}deg)`;
            // Force reflow/repaint might be needed in some browsers, but often not
            // carousel.offsetHeight;
            carousel.style.transition = 'transform 1s cubic-bezier(0.77, 0, 0.175, 1)'; // Re-enable transition
        }, 250); // Adjust delay as needed
    });


    // Initial Setup
    positionItems(); // Position items initially

}); // End DOMContentLoaded
