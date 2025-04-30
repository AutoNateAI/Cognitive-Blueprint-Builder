/**
 * Sora Gallery Component
 * Handles animations and interactions for the Sora-generated meme images
 */

class SoraGallery {
    constructor() {
        this.initAnimations();
        this.setupImageObservers();
        this.setupMemeHoverEffects();
    }

    /**
     * Initialize animations for gallery elements
     */
    initAnimations() {
        // Get all animation elements with specific classes
        const fadeInUpElements = document.querySelectorAll('.fade-in-up');
        const fadeInRightElements = document.querySelectorAll('.fade-in-right');
        const fadeInLeftElements = document.querySelectorAll('.fade-in-left');
        const zoomInElements = document.querySelectorAll('.zoom-in');
        
        // Create animation timeline
        if (typeof gsap !== 'undefined') {
            // Apply staggered animations
            gsap.registerPlugin(ScrollTrigger);
            
            // Fade in up animations
            fadeInUpElements.forEach(element => {
                const delay = element.dataset.delay || 0;
                
                gsap.from(element, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    delay: parseFloat(delay),
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                });
            });
            
            // Fade in right animations
            fadeInRightElements.forEach(element => {
                const delay = element.dataset.delay || 0;
                
                gsap.from(element, {
                    x: -50,
                    opacity: 0,
                    duration: 0.8,
                    delay: parseFloat(delay),
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                });
            });
            
            // Fade in left animations
            fadeInLeftElements.forEach(element => {
                const delay = element.dataset.delay || 0;
                
                gsap.from(element, {
                    x: 50,
                    opacity: 0,
                    duration: 0.8,
                    delay: parseFloat(delay),
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                });
            });
            
            // Zoom in animations
            zoomInElements.forEach(element => {
                const delay = element.dataset.delay || 0;
                
                gsap.from(element, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.8,
                    delay: parseFloat(delay),
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                });
            });
        } else {
            console.warn('GSAP library not loaded. Animations will not work.');
            // Fallback for when GSAP is not available
            document.querySelectorAll('.fade-in-up, .fade-in-right, .fade-in-left, .zoom-in').forEach(el => {
                el.style.opacity = 1;
                el.style.transform = 'none';
            });
        }
    }

    /**
     * Setup IntersectionObserver for lazy loading and animations
     */
    setupImageObservers() {
        if ('IntersectionObserver' in window) {
            const imageContainers = document.querySelectorAll('.sora-image-container');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                        
                        // When actual images are added, they can be lazy-loaded here
                        const placeholderImg = entry.target.querySelector('.sora-placeholder');
                        if (placeholderImg && entry.target.dataset.src) {
                            // Replace placeholder with actual image when it's loaded
                            const img = new Image();
                            img.src = entry.target.dataset.src;
                            img.onload = () => {
                                const newImg = document.createElement('img');
                                newImg.src = entry.target.dataset.src;
                                newImg.alt = entry.target.dataset.alt || 'Sora generated image';
                                newImg.className = 'sora-image';
                                
                                // Replace placeholder with actual image
                                placeholderImg.parentNode.replaceChild(newImg, placeholderImg);
                            };
                        }
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            });
            
            imageContainers.forEach(container => {
                observer.observe(container);
            });
        }
    }

    /**
     * Add interactive effects to meme images
     */
    setupMemeHoverEffects() {
        const memeContainers = document.querySelectorAll('.sora-image-container');
        
        memeContainers.forEach(container => {
            container.addEventListener('mouseenter', () => {
                const topText = container.querySelector('.meme-text.top');
                const bottomText = container.querySelector('.meme-text.bottom');
                
                if (topText && typeof gsap !== 'undefined') {
                    gsap.to(topText, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power1.out"
                    });
                }
                
                if (bottomText && typeof gsap !== 'undefined') {
                    gsap.to(bottomText, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power1.out"
                    });
                }
            });
            
            container.addEventListener('mouseleave', () => {
                const topText = container.querySelector('.meme-text.top');
                const bottomText = container.querySelector('.meme-text.bottom');
                
                if (topText && typeof gsap !== 'undefined') {
                    gsap.to(topText, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power1.in"
                    });
                }
                
                if (bottomText && typeof gsap !== 'undefined') {
                    gsap.to(bottomText, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power1.in"
                    });
                }
            });
        });
    }

    /**
     * Apply a random meme effect to an element
     * @param {HTMLElement} element - The element to apply the effect to
     */
    applyRandomEffect(element) {
        const effects = [
            'pulse',
            'bounce',
            'flash',
            'rubberBand',
            'shakeX',
            'shakeY',
            'headShake',
            'swing',
            'tada',
            'wobble',
            'jello',
            'heartBeat'
        ];
        
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        element.classList.add(randomEffect);
        
        // Remove the effect after animation completes
        setTimeout(() => {
            element.classList.remove(randomEffect);
        }, 1000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.soraGallery = new SoraGallery();
});
