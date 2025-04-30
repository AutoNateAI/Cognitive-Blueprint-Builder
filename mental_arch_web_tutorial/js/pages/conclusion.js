/**
 * Conclusion Page JavaScript
 * Handles animations and interactions for the Conclusion page
 */

document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initJourneyAnimation();
    initFinalActions();
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
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
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

    // Show completion card and final message
    setTimeout(() => {
        document.querySelector('.completion-card').classList.add('visible');
    }, 500);

    setTimeout(() => {
        document.querySelector('.final-message').classList.add('visible');
    }, 1500);

    // Animate future list items with staggered delay
    const futureListItems = document.querySelectorAll('.future-list li');
    futureListItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 200 * index);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(item);
    });
}

/**
 * Animate the journey visualization
 */
function initJourneyAnimation() {
    const journeyMilestones = document.querySelectorAll('.journey-milestone');
    
    if (journeyMilestones.length > 0) {
        journeyMilestones.forEach((milestone, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            milestone.classList.add('visible');
                        }, 300 * index);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2
            });
            
            observer.observe(milestone);
        });
    }
}

/**
 * Initialize actions for export and share buttons
 */
function initFinalActions() {
    // Export full blueprint
    const exportFullBtn = document.getElementById('exportFullBtn');
    if (exportFullBtn) {
        exportFullBtn.addEventListener('click', function() {
            alert('Your complete blueprint is being prepared for download.');
            // In a real application, this would trigger the export process
        });
    }
    
    // View action plan
    const viewActionPlanBtn = document.getElementById('viewActionPlanBtn');
    if (viewActionPlanBtn) {
        viewActionPlanBtn.addEventListener('click', function() {
            // Scroll to module 3.3 or show a modal with the action plan
            window.location.href = 'module3-3.html#action-plan';
        });
    }
    
    // Share experience
    const shareExperienceBtn = document.getElementById('shareExperienceBtn');
    if (shareExperienceBtn) {
        shareExperienceBtn.addEventListener('click', function() {
            // Example social sharing
            const shareText = "I've completed the Cognitive Blueprint Builder tutorial and created a personalized mental architecture map! #MentalArchitecture #CognitiveBlueprint";
            const shareUrl = window.location.origin + '/cognitive-blueprint-builder';
            
            // Create sharing options modal or direct share link
            if (navigator.share) {
                navigator.share({
                    title: 'My Cognitive Blueprint Journey',
                    text: shareText,
                    url: shareUrl,
                }).catch(console.error);
            } else {
                alert('Share your experience on social media! Copy this text:\n\n' + shareText + '\n\n' + shareUrl);
            }
        });
    }
}
