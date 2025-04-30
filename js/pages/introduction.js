/**
 * Introduction Page JavaScript
 * Handles animations and interactive elements for the introduction page
 */

$(document).ready(function() {
    // Handle theme-specific SVG colors
    function updateSvgColors() {
        // Force a repaint for SVG elements to ensure visibility
        $('.brain-svg').css('opacity', '0.99').css('opacity', '1');
        
        const isDarkTheme = $('body').hasClass('dark-theme');
        const textColor = isDarkTheme ? '#e0e0e0' : '#333333';
        const primaryColor = isDarkTheme ? '#5d7dcb' : '#4b6cb7';
        const accentColor = isDarkTheme ? '#ffad33' : '#ff9d00';

        // Explicitly set colors on the DOM elements without using CSS variables for SVG
        $('svg text').css('fill', textColor);
        $('.brain-outline').css({
            'stroke': primaryColor,
            'fill': 'none',  // Ensure this is explicitly set
            'stroke-width': '2px'
        });
        
        // Update node colors with direct attribute setting
        $('.node').each(function() {
            // Get original color or provide fallback
            const originalFill = $(this).data('originalFill') || $(this).attr('fill');
            if (!$(this).data('originalFill')) {
                $(this).data('originalFill', originalFill);
            }
            
            // Determine which theme color to use based on original
            if (originalFill.includes('5d7dcb') || originalFill.includes('4b6cb7')) {
                $(this).css('fill', primaryColor);
            } else if (originalFill.includes('ff9d00') || originalFill.includes('ffad33')) {
                $(this).css('fill', accentColor);
            }
        });
        
        // Update connection paths with direct styling
        $('.flow-path').css({
            'stroke': primaryColor,
            'fill': 'none',
            'stroke-width': '2px'
        });
        
        // Force opacity on animation elements to ensure visibility
        $('animate').each(function() {
            // Store the original animation settings if not already stored
            if (!$(this).data('originalFrom')) {
                $(this).data('originalFrom', $(this).attr('from'));
                $(this).data('originalTo', $(this).attr('to'));
            }
        });
    }
    
    // Initialize SVG brain animation interactions
    function initBrainAnimation() {
        console.log('Initializing brain animation');
        const container = document.getElementById('brainAnimation');
        if (!container) {
            console.log('Brain animation container not found');
            return;
        }
        
        // Ensure SVG is visible by setting explicit dimensions and styles
        const svg = container.querySelector('svg');
        if (svg) {
            console.log('SVG found, setting explicit styles');
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.display = 'block';
            
            // Make sure animations are running
            const animations = svg.querySelectorAll('animate');
            animations.forEach(anim => {
                // Reset animation by cloning and replacing
                const parent = anim.parentNode;
                const clone = anim.cloneNode(true);
                parent.removeChild(anim);
                parent.appendChild(clone);
                console.log('Animation reset');
            });
            
            // Ensure all SVG elements have proper styling
            const paths = svg.querySelectorAll('path');
            paths.forEach(path => {
                if (path.classList.contains('brain-outline')) {
                    path.style.fill = 'none';
                    path.style.stroke = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                    path.style.strokeWidth = '2px';
                }
            });
            
            const circles = svg.querySelectorAll('circle');
            circles.forEach(circle => {
                if (!circle.style.fill) {
                    circle.style.fill = '#5d7dcb';  // Set a default fill if none exists
                }
            });
        } else {
            console.log('SVG element not found in container');
        }
        
        // Add interactivity to the brain animation nodes
        $('.node').on('mouseenter', function() {
            console.log('Node hover enter');
            // Scale up the node on hover
            gsap.to(this, {
                scale: 1.5,
                transformOrigin: 'center center',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Get the connected paths
            const cx = parseFloat($(this).attr('cx'));
            const cy = parseFloat($(this).attr('cy'));
            console.log(`Node position: ${cx},${cy}`);
            
            // Highlight all paths connected to this node
            $('.flow-path').each(function() {
                const pathD = $(this).attr('d');
                if (pathD.includes(cx + ',' + cy) || pathD.includes(cx + ' ' + cy)) {
                    gsap.to(this, {
                        opacity: 1,
                        strokeWidth: 3,
                        duration: 0.3
                    });
                    console.log('Connected path highlighted');
                }
            });
        }).on('mouseleave', function() {
            console.log('Node hover leave');
            // Scale back down on mouse leave
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Reset path styling
            $('.flow-path').each(function() {
                gsap.to(this, {
                    opacity: 0.6,
                    strokeWidth: 2,
                    duration: 0.3
                });
            });
        });

        // If we need to create SVG programmatically, we can do it here
        if (!container.querySelector('svg')) {
            // Create SVG element
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("viewBox", "0 0 800 400");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.classList.add('brain-svg');
            container.appendChild(svg);
            
            // Create brain outline path
            const brainPath = document.createElementNS(svgNS, "path");
            brainPath.setAttribute("d", "M400,320 C520,320 600,230 600,150 C600,80 550,40 500,40 C450,40 440,80 400,80 C360,80 350,40 300,40 C250,40 200,80 200,150 C200,230 280,320 400,320 Z");
            brainPath.setAttribute("fill", "none");
            brainPath.setAttribute("stroke", "#4b6cb7");
            brainPath.setAttribute("stroke-width", "2");
            brainPath.setAttribute("stroke-dasharray", "1400");
            brainPath.setAttribute("stroke-dashoffset", "1400");
            brainPath.classList.add('brain-outline');
            svg.appendChild(brainPath);
        
        // Create connection lines
        const lines = [];
        for (let i = 0; i < 20; i++) {
            const line = document.createElementNS(svgNS, "line");
            const x1 = 150 + Math.random() * 300;
            const y1 = 100 + Math.random() * 150;
            const x2 = 150 + Math.random() * 300;
            const y2 = 100 + Math.random() * 150;
            
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("stroke", "#182848");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("opacity", "0");
            svg.appendChild(line);
            lines.push(line);
        }
        
        // Create nodes
        const nodes = [];
        for (let i = 0; i < 12; i++) {
            const circle = document.createElementNS(svgNS, "circle");
            const cx = 150 + Math.random() * 300;
            const cy = 100 + Math.random() * 150;
            const r = 3 + Math.random() * 5;
            
            circle.setAttribute("cx", cx);
            circle.setAttribute("cy", cy);
            circle.setAttribute("r", r);
            circle.setAttribute("fill", "#ff9d00");
            circle.setAttribute("opacity", "0");
            svg.appendChild(circle);
            nodes.push(circle);
        }
        
        // Create particles
        const particles = [];
        for (let i = 0; i < 15; i++) {
            const particle = document.createElementNS(svgNS, "circle");
            const cx = 150 + Math.random() * 300;
            const cy = 100 + Math.random() * 150;
            
            particle.setAttribute("cx", cx);
            particle.setAttribute("cy", cy);
            particle.setAttribute("r", "2");
            particle.setAttribute("fill", "#4b6cb7");
            particle.setAttribute("opacity", "0");
            svg.appendChild(particle);
            particles.push(particle);
        }
        
        // Animation timeline
        const tl = gsap.timeline({repeat: -1, repeatDelay: 1});
        
        // Animate brain outline drawing
        tl.to(brainPath, {
            strokeDashoffset: 0,
            duration: 3,
            ease: "power2.inOut"
        });
        
        // Fade in nodes
        tl.to(nodes, {
            opacity: 0.8,
            stagger: 0.1,
            duration: 0.5,
            ease: "power1.out"
        }, "-=2");
        
        // Fade in connection lines
        tl.to(lines, {
            opacity: 0.6,
            stagger: 0.1,
            duration: 0.5,
            ease: "power1.out"
        }, "-=1.5");
        
        // Animate particles moving along paths
        particles.forEach((particle, index) => {
            const delay = index * 0.2;
            tl.to(particle, {
                opacity: 0.8,
                duration: 0.3,
                ease: "power1.in"
            }, `-=${2-delay}`);
            
            // Random motion path
            tl.to(particle, {
                motionPath: {
                    path: "M" + particle.getAttribute("cx") + "," + particle.getAttribute("cy") + " C" + 
                          (parseInt(particle.getAttribute("cx")) + Math.random() * 100 - 50) + "," + 
                          (parseInt(particle.getAttribute("cy")) + Math.random() * 100 - 50) + " " +
                          (parseInt(particle.getAttribute("cx")) + Math.random() * 100 - 50) + "," + 
                          (parseInt(particle.getAttribute("cy")) + Math.random() * 100 - 50) + " " +
                          (parseInt(particle.getAttribute("cx")) + Math.random() * 100 - 50) + "," + 
                          (parseInt(particle.getAttribute("cy")) + Math.random() * 100 - 50),
                    autoRotate: false,
                    curviness: 2
                },
                duration: 4 + Math.random() * 3,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            }, `-=${2-delay}`);
        });
    }
    
    // Initialize the brain animation
    initBrainAnimation();
    
    // Listen for theme changes and update SVG colors
    $('#themeToggle').on('click', function() {
        // Wait for theme transition to complete
        setTimeout(updateSvgColors, 300);
    });
    
    // Run initial SVG color update
    updateSvgColors();

    // Initialize interactive cards and carousel
    function initBenefitCards() {
        // Enhance hover effects on benefit cards
        $('.benefit-card, .floating-card').hover(
            function() {
                const benefit = $(this).data('benefit');
                $(this).find('.card-title').addClass('text-accent');
                
                // Create a subtle wobble animation
                gsap.to(this, {
                    rotation: 0.5,
                    duration: 0.2,
                    ease: 'power1.out'
                });
            },
            function() {
                $(this).find('.card-title').removeClass('text-accent');
                
                // Reset the rotation
                gsap.to(this, {
                    rotation: 0,
                    duration: 0.2,
                    ease: 'power1.out'
                });
            }
        );
        
        // Initialize the carousel with automatic rotation
        if ($('#benefitCarousel').length) {
            const benefitCarousel = new bootstrap.Carousel(document.getElementById('benefitCarousel'), {
                interval: 5000,
                wrap: true
            });
        }
    }

    // Save checkbox state to localStorage
    $('.preparation-item input[type="checkbox"]').on('change', function() {
        if (!DataManager.isStorageAvailable()) return;
        
        const checkboxId = $(this).attr('id');
        const isChecked = $(this).prop('checked');
        
        DataManager.saveResponse(checkboxId, isChecked);
    });
    
    // Load checkbox state from localStorage
    function loadCheckboxStates() {
        if (!DataManager.isStorageAvailable()) return;
        
        const responses = DataManager.getModuleResponses('intro');
        
        for (const [id, isChecked] of Object.entries(responses)) {
            if (id.startsWith('prep')) {
                $(`#${id}`).prop('checked', isChecked);
            }
        }
    }
    
    // Save slider values to localStorage
    $('.readiness-assessment input[type="range"]').on('change', function() {
        if (!DataManager.isStorageAvailable()) return;
        
        const sliderId = $(this).attr('id');
        const value = $(this).val();
        
        DataManager.saveResponse(sliderId, value);
    });
    
    // Load slider values from localStorage
    function loadSliderValues() {
        if (!DataManager.isStorageAvailable()) return;
        
        const responses = DataManager.getModuleResponses('intro');
        
        for (const [id, value] of Object.entries(responses)) {
            if (id.endsWith('Range')) {
                $(`#${id}`).val(value);
            }
        }
    }
    
    // Initialize GSAP animations for scroll triggers if available
    function initScrollAnimations() {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Animate section headers when they enter the viewport
            gsap.utils.toArray('.section-header').forEach(header => {
                gsap.from(header, {
                    x: -30,
                    opacity: 0,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });
                
                // Animate the underline separately
                gsap.from(header.querySelector('::after') || header, {
                    width: 0,
                    duration: 0.8,
                    delay: 0.3,
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });
            });
            
            // Animate floating cards on scroll
            gsap.utils.toArray('.floating-card').forEach((card, i) => {
                gsap.from(card, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    delay: i * 0.2
                });
            });
            
            // Animate layer cards sequentially
            gsap.utils.toArray('.layer-card').forEach((card, i) => {
                gsap.from(card, {
                    x: -50,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    delay: i * 0.3
                });
            });
        }
    }

    // Initialize interactive elements
    // Load any previously saved user data
    loadCheckboxStates();
    loadSliderValues();
    
    // Initialize interactive components
    initBenefitCards();
    initScrollAnimations();
    
    // Add an observer to restart animations when they come into view again
    if ('IntersectionObserver' in window) {
        console.log('Setting up IntersectionObserver for animations');
        const animationContainers = document.querySelectorAll('.brain-animation-container');
        console.log(`Found ${animationContainers.length} animation containers`);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Animation container in view, restarting animations');
                    // Restart SVG animations when they come back into view
                    const svg = entry.target.querySelector('svg');
                    if (svg) {
                        // First ensure the SVG is visible
                        svg.style.display = 'block';
                        svg.style.visibility = 'visible';
                        
                        // Force a repaint of the SVG
                        entry.target.style.opacity = '0.99';
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                        }, 10);
                        
                        // Reset all animations
                        const animations = svg.querySelectorAll('animate');
                        console.log(`Resetting ${animations.length} animations`);
                        animations.forEach(anim => {
                            // Reset animation by removing and re-adding it
                            const parent = anim.parentNode;
                            const clone = anim.cloneNode(true);
                            parent.removeChild(anim);
                            parent.appendChild(clone);
                        });
                        
                        // Update SVG colors for current theme
                        updateSvgColors();
                    }
                }
            });
        }, {
            threshold: 0.3  // Trigger when at least 30% of the element is visible
        });
        
        animationContainers.forEach(container => {
            observer.observe(container);
            console.log('Observer attached to container');
        });
    }
    
    // Force SVG visibility on load - setTimeout helps ensure DOM is fully processed
    setTimeout(() => {
        console.log('Forcing SVG visibility');
        $('.brain-animation-container').each(function() {
            const svg = $(this).find('svg');
            if (svg.length) {
                svg.css({
                    'display': 'block',
                    'visibility': 'visible',
                    'opacity': '1'
                });
                
                // Force animation restart
                const animations = svg.find('animate');
                animations.each(function() {
                    const parent = this.parentNode;
                    const clone = this.cloneNode(true);
                    parent.removeChild(this);
                    parent.appendChild(clone);
                });
                
                // Update colors
                updateSvgColors();
            }
        });
    }, 500);
    
    // Mark introduction as viewed/completed when user clicks "Start" button
    $('.start-button').on('click', function() {
        DataManager.completeCurrentModule();
    });
});
