/**
 * AI Prompts Page JavaScript
 * Handles animations and interactions for the AI Prompts guide
 */

document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initCopyButtons();
    initUsageGuideAnimation();
});

/**
 * Initialize animations for elements
 */
function initAnimations() {
    // Animate SORA placeholders
    const soraContainers = document.querySelectorAll('.sora-image-container');
    soraContainers.forEach(container => {
        const delay = container.dataset.delay || 0;
        container.style.setProperty('--delay', delay + 's');
        
        // Use Intersection Observer to trigger animations when elements come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    container.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(container);
    });
    
    // Animate fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(element => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    element.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(element);
    });
}

/**
 * Initialize copy buttons for prompt templates
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const promptText = this.previousElementSibling.textContent;
            navigator.clipboard.writeText(promptText).then(() => {
                // Provide visual feedback
                const originalText = this.textContent;
                const originalClass = this.className;
                
                this.textContent = 'Copied!';
                this.classList.add('btn-success');
                this.classList.remove('btn-outline-primary', 'btn-outline-success', 'btn-outline-danger');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.className = originalClass;
                }, 2000);
            });
        });
    });
}

/**
 * Initialize animated appearance of usage guide steps
 */
function initUsageGuideAnimation() {
    const usageSteps = document.querySelectorAll('.usage-step');
    
    if (usageSteps.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get the index of this step
                    const index = Array.from(usageSteps).indexOf(entry.target);
                    // Staggered animation
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, 200 * index);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        usageSteps.forEach(step => {
            observer.observe(step);
        });
    }
}

/**
 * Initialize prompt category view toggle
 */
function initPromptToggle() {
    const toggleButtons = document.querySelectorAll('[data-bs-toggle="collapse"]');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get target collapse element
            const targetId = this.getAttribute('data-bs-target');
            const targetElement = document.querySelector(targetId);
            
            // Check if it's currently collapsed
            const isCollapsed = !targetElement.classList.contains('show');
            
            // Update button text based on state
            if (isCollapsed) {
                this.innerHTML = 'Hide Prompts <i class="bi bi-chevron-up ms-1"></i>';
            } else {
                this.innerHTML = 'View Prompts <i class="bi bi-chevron-down ms-1"></i>';
            }
        });
    });
}
