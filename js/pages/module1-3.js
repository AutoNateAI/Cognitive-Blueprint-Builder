/**
 * Module 1.3 JavaScript
 * Handles functionality specific to the "Hierarchies, Networks, and Mental Models" module
 */

$(document).ready(function() {
    // Initialize Sora image containers with animation
    initSoraContainers();
    
    // Track module progress
    updateModuleProgress();
    
    // Function to initialize Sora image containers with animations
    function initSoraContainers() {
        // First add the 'animated' class to all sora containers to make them visible
        const soraContainers = document.querySelectorAll('.sora-image-container');
        soraContainers.forEach(container => {
            container.classList.add('animated');
        });
        
        // Add scroll-triggered animations
        $(window).on('scroll', function() {
            $('.sora-image-container:not(.scroll-animated)').each(function() {
                const containerTop = $(this).offset().top;
                const windowBottom = $(window).scrollTop() + $(window).height();
                
                if (windowBottom > containerTop + 100) {
                    $(this).addClass('scroll-animated');
                    
                    // Add different animation classes based on position
                    if ($(this).hasClass('fade-in-up')) {
                        // Already has animation class
                    } else if ($(this).index() % 3 === 0) {
                        $(this).addClass('fade-in-up');
                    } else if ($(this).index() % 3 === 1) {
                        $(this).addClass('fade-in-right');
                    } else {
                        $(this).addClass('fade-in-left');
                    }
                }
            });
        });
        
        // Trigger scroll event to animate visible elements on page load
        setTimeout(() => {
            $(window).trigger('scroll');
        }, 100);
    }
    
    // Structure toggle functionality
    $('.structure-toggle .btn').on('click', function() {
        const structureType = $(this).data('structure');
        
        // Remove active class from all buttons
        $('.structure-toggle .btn').removeClass('active');
        
        // Add active class to clicked button
        $(this).addClass('active');
        
        // Hide all structure content
        $('.structure-content').removeClass('shifted-in');
        $('.structure-content').hide();
        
        // Show the selected structure content with animation
        $(`.structure-content[data-structure="${structureType}"]`).show();
        setTimeout(() => {
            $(`.structure-content[data-structure="${structureType}"]`).addClass('shifted-in');
        }, 50);
    });
    
    // Animate structure visuals on hover
    $('.structure-visual').on('mouseenter', function() {
        // Add a subtle pulse animation using GSAP
        gsap.to(this, {
            y: -5,
            duration: 0.3,
            ease: "power2.out"
        });
    }).on('mouseleave', function() {
        gsap.to(this, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    // Animate model types on hover
    $('.model-type').on('mouseenter', function() {
        gsap.to(this, {
            y: -3,
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
            duration: 0.3,
            ease: "power2.out"
        });
    }).on('mouseleave', function() {
        gsap.to(this, {
            y: 0,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    // Handle saving responses
    $('.save-response-btn').on('click', function() {
        const responseArea = $(this).closest('.response-area');
        const responseInput = responseArea.find('textarea');
        const questionId = responseInput.attr('id');
        const response = responseInput.val();
        
        // Save response to local storage
        if (DataManager.saveResponse(questionId, response)) {
            // Show saved indicator
            $(this).addClass('saved');
            $(this).html('<i class="bi bi-check-circle"></i> Saved');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                $(this).removeClass('saved');
                $(this).html('Save Response');
            }, 2000);
            
            // Update progress
            updateModuleProgress();
        }
    });
    
    // Auto-save responses as user types (with debounce)
    let typingTimer;
    $('.response-area textarea').on('keyup', function() {
        const questionId = $(this).attr('id');
        const response = $(this).val();
        const saveBtn = $(this).closest('.response-area').find('.save-response-btn');
        
        // Clear previous timer
        clearTimeout(typingTimer);
        
        // Set new timer
        typingTimer = setTimeout(function() {
            // Save response to local storage
            if (DataManager.saveResponse(questionId, response)) {
                // Show brief saved indicator
                saveBtn.addClass('saved');
                saveBtn.html('<i class="bi bi-check-circle"></i> Saved');
                
                // Reset button after 1 second
                setTimeout(() => {
                    saveBtn.removeClass('saved');
                    saveBtn.html('Save Response');
                }, 1000);
                
                // Update progress
                updateModuleProgress();
            }
        }, 1000);
    });
    
    // Load saved responses
    function loadSavedResponses() {
        const responses = DataManager.getModuleResponses('module1-3');
        
        if (responses) {
            // Populate each textarea with saved responses
            for (const [id, response] of Object.entries(responses)) {
                $(`#${id}`).val(response);
            }
        }
    }
    loadSavedResponses();
    
    // Display progress based on completed responses
    function updateModuleProgress() {
        const responses = DataManager.getModuleResponses('module1-3');
        const totalQuestions = $('.response-area').length;
        let answeredQuestions = 0;
        
        // Count answered questions
        if (responses) {
            for (const [id, response] of Object.entries(responses)) {
                if (response && response.trim().length > 0) {
                    answeredQuestions++;
                }
            }
        }
        
        // Calculate progress percentage (30% base progress + up to 70% for questions)
        let progress = 30;
        
        if (totalQuestions > 0) {
            progress += Math.round((answeredQuestions / totalQuestions) * 70);
        }
        
        // Update progress bar
        $('.progress-bar').css('width', `${progress}%`);
        $('.progress-bar').attr('aria-valuenow', progress);
        $('.progress-text').text(`${progress}% Complete`);
    }
    
    // Mark module as complete when clicking the next module button
    $('.btn-primary').on('click', function() {
        if ($(this).attr('href') === 'module2-1.html') {
            DataManager.completeCurrentModule();
        }
    });
    
    // Check if module is already completed
    if (DataManager.isModuleCompleted('module1-3')) {
        // Show completion indicator if needed
    }
});
