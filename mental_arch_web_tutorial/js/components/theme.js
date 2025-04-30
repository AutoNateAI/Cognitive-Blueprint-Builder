/**
 * Theme Component - Handles light/dark theme toggle functionality
 */

$(document).ready(function() {
    // Initialize theme from localStorage or system preference
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // Use saved user preference
            if (savedTheme === 'dark') {
                $('body').addClass('dark-theme');
            }
        } else {
            // Check system preference
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                $('body').addClass('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        }
    }

    // Toggle theme function
    function toggleTheme() {
        $('body').addClass('theme-transition');
        
        if ($('body').hasClass('dark-theme')) {
            // Switch to light theme
            $('body').removeClass('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            $('body').addClass('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        
        // Remove transition class after animation completes
        setTimeout(function() {
            $('body').removeClass('theme-transition');
        }, 500);
    }

    // Theme toggle button click handler
    $('#themeToggle').on('click', function() {
        toggleTheme();
    });

    // Initialize theme on page load
    initTheme();
    
    // Listen for system theme preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newTheme = event.matches ? 'dark' : 'light';
            
            // Only auto-switch if user hasn't explicitly set a preference
            const userTheme = localStorage.getItem('userSetTheme');
            if (!userTheme) {
                if (newTheme === 'dark') {
                    if (!$('body').hasClass('dark-theme')) {
                        $('body').addClass('dark-theme');
                    }
                    localStorage.setItem('theme', 'dark');
                } else {
                    $('body').removeClass('dark-theme');
                    localStorage.setItem('theme', 'light');
                }
            }
        });
    }

    // Export theme toggle function for use by other components
    window.themeComponent = {
        toggle: toggleTheme,
        isDarkTheme: function() {
            return $('body').hasClass('dark-theme');
        }
    };
});
