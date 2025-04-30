/**
 * Navigation Component - Handles sidebar toggle and navigation functionality
 */

$(document).ready(function() {
    // Sidebar toggle for desktop
    $('#sidebarToggle').on('click', function() {
        $('#sidebar').toggleClass('active');
        $('.overlay').toggleClass('active');
    });

    // Close sidebar when clicking on overlay (mobile)
    $('.overlay').on('click', function() {
        $('#sidebar').addClass('active');
        $('.overlay').removeClass('active');
    });

    // Close sidebar with X button
    $('#sidebarCollapseIn').on('click', function() {
        $('#sidebar').addClass('active');
        $('.overlay').removeClass('active');
    });

    // Close sidebar when clicking outside on mobile
    $(document).on('click', function(e) {
        const sidebar = $('#sidebar');
        const sidebarToggle = $('#sidebarToggle');
        
        if (!sidebar.is(e.target) && 
            sidebar.has(e.target).length === 0 && 
            !sidebarToggle.is(e.target) && 
            sidebarToggle.has(e.target).length === 0 &&
            $(window).width() < 768) {
            
            $('#sidebar').addClass('active');
            $('.overlay').removeClass('active');
        }
    });

    // Update active state in menu based on current page
    function setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        
        // Remove active class from all items
        $('#sidebar ul.components li').removeClass('active');
        
        // Special case for index.html or empty path
        if (filename === '' || filename === 'index.html') {
            $('#sidebar ul.components li').first().addClass('active');
            return;
        }
        
        // Find the current page in the menu and set it as active
        $('#sidebar ul.components li a').each(function() {
            const href = $(this).attr('href');
            if (href === filename) {
                $(this).closest('li').addClass('active');
                
                // If it's in a submenu, expand that submenu
                const submenu = $(this).closest('ul.collapse');
                if (submenu.length) {
                    submenu.addClass('show');
                    submenu.prev('a.dropdown-toggle').attr('aria-expanded', 'true');
                }
            }
        });
    }

    // Update progress indicator based on completed modules
    function updateProgressIndicator() {
        const totalModules = 9; // 3 phases x 3 modules each
        let completedModules = 0;
        
        // Check localStorage for completed modules
        if (window.localStorage) {
            for (let i = 1; i <= 3; i++) {
                for (let j = 1; j <= 3; j++) {
                    const moduleKey = `module${i}-${j}-completed`;
                    if (localStorage.getItem(moduleKey) === 'true') {
                        completedModules++;
                    }
                }
            }
        }
        
        // Update progress bar
        const progressPercentage = Math.round((completedModules / totalModules) * 100);
        $('.progress-bar').css('width', progressPercentage + '%');
        $('.progress-bar').attr('aria-valuenow', progressPercentage);
        $('.progress-indicator small').text(progressPercentage + '% Complete');
    }

    // Initialize navigation
    setActiveMenuItem();
    updateProgressIndicator();

    // Export function to be used by other components
    window.navigationComponent = {
        updateProgress: updateProgressIndicator
    };
});
