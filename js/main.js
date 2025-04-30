/**
 * Main JavaScript file
 * Initializes components and handles global functionality
 */

// Global app configuration
const AppConfig = {
    version: '1.0.0',
    appName: 'Cognitive Blueprint Builder',
    debug: false
};

// Document ready function
$(document).ready(function() {
    // Initialize tooltips and popovers
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    
    // Log initialization in debug mode
    if (AppConfig.debug) {
        console.log(`${AppConfig.appName} v${AppConfig.version} initialized`);
    }

    // Handle errors gracefully
    window.onerror = function(message, source, lineno, colno, error) {
        console.error(`Error: ${message} at ${source}:${lineno}:${colno}`);
        
        if (AppConfig.debug) {
            showErrorMessage(`An error occurred: ${message}`);
        }
        
        // Prevent the browser's default error handling
        return true;
    };
    
    // Show error message function
    function showErrorMessage(message) {
        // Create error toast notification
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-danger border-0 position-fixed bottom-0 end-0 m-3';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', function() {
            document.body.removeChild(toast);
        });
    }

    // Add page transition effects
    $('a').not('[target="_blank"]').not('[href^="#"]').on('click', function(e) {
        // Don't apply to downloads or external links
        if ($(this).attr('download') || $(this).attr('href').indexOf('://') !== -1) {
            return true;
        }
        
        e.preventDefault();
        const href = $(this).attr('href');
        
        // Fade out current content
        $('#content').fadeOut(300, function() {
            // Navigate to new page
            window.location.href = href;
        });
    });
    
    // Fade in content on page load
    $('#content').hide().fadeIn(300);
    
    // Export functions and configuration for use by other scripts
    window.App = {
        config: AppConfig,
        showError: showErrorMessage
    };
});
