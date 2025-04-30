/**
 * Module 3.1: Creating Your Unified Mental Resource Map
 * JavaScript functionality for interactive elements
 */

$(document).ready(function() {
    // Initialize module
    initializeModule();

    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the module components
 */
function initializeModule() {
    // Set up progress tracking
    trackProgress();
    
    // Initialize map integration tool
    initializeMapIntegrationTool();
    
    // Initialize legend builder
    initializeLegendBuilder();
    
    // Set up map explorer
    initializeMapExplorer();
    
    // Set up insight capture tool
    initializeInsightCaptureTool();
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Map integration tool opacity sliders
    $('#structureOpacity').on('input', function() {
        updateOpacityValues();
    });
    
    $('#flowOpacity').on('input', function() {
        updateOpacityValues();
    });
    
    // Toggle integration button
    $('#toggleIntegration').on('click', function() {
        toggleIntegrationView();
    });
    
    // Save insights button
    $('.insight-category textarea').on('input', function() {
        enableSaveButton(true);
    });
    
    $('button:contains("Save Insights")').on('click', function() {
        saveInsights();
    });
}

/**
 * Track user progress through the module
 */
function trackProgress() {
    // Update progress in sidebar
    $('.progress-bar').css('width', '70%').attr('aria-valuenow', 70);
    $('.progress-text').text('70% Complete');
    
    // Check if user has completed previous modules
    const completedModules = JSON.parse(localStorage.getItem('completedModules') || '[]');
    
    // Mark this module as visited
    if (!completedModules.includes('module3-1')) {
        completedModules.push('module3-1');
        localStorage.setItem('completedModules', JSON.stringify(completedModules));
    }
}

/**
 * Initialize the map integration tool
 */
function initializeMapIntegrationTool() {
    // Set initial opacity values
    updateOpacityValues();
    
    // Simulate map layers with GSAP animations
    simulateMapLayers();
}

/**
 * Update opacity values for the sliders
 */
function updateOpacityValues() {
    const structureOpacity = $('#structureOpacity').val();
    const flowOpacity = $('#flowOpacity').val();
    
    $('#structureOpacityValue').text(structureOpacity + '%');
    $('#flowOpacityValue').text(flowOpacity + '%');
    
    // Update visualization (in a real implementation, this would adjust actual layer opacities)
    simulateLayerAdjustment(structureOpacity, flowOpacity);
}

/**
 * Simulate adjusting layer opacities with visual feedback
 */
function simulateLayerAdjustment(structureOpacity, flowOpacity) {
    // This is a placeholder that would normally update actual map layers
    // For demonstration purposes, we'll just change a visual indicator
    
    // Calculate combined visualization effect (simplified for demo)
    const effectLevel = Math.min(parseInt(structureOpacity) + parseInt(flowOpacity), 100) / 100;
    
    // Apply visual effect to the map visualization
    $('.map-visualization img').css('opacity', 0.5 + (effectLevel * 0.5));
}

/**
 * Toggle between separate and combined views of maps
 */
function toggleIntegrationView() {
    const $btn = $('#toggleIntegration');
    const $img = $('.map-visualization img');
    
    if ($btn.data('state') === 'combined') {
        // Switch to separate view
        $btn.data('state', 'separate');
        $btn.text('Show Combined View');
        
        // Visual feedback (would be replaced with actual layer toggling)
        gsap.to($img, {
            scale: 0.9,
            opacity: 0.7,
            duration: 0.5,
            ease: 'power2.out'
        });
    } else {
        // Switch to combined view
        $btn.data('state', 'combined');
        $btn.text('Toggle Combined View');
        
        // Visual feedback
        gsap.to($img, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
    }
}

/**
 * Simulate map layers with animation effects
 */
function simulateMapLayers() {
    // Animate map layers to give a sense of depth and interactivity
    gsap.fromTo('.map-visualization img', 
        { scale: 0.95, opacity: 0.7 },
        { 
            scale: 1, 
            opacity: 1, 
            duration: 1.2, 
            ease: 'power2.out',
            onComplete: function() {
                // Set state for toggle button
                $('#toggleIntegration').data('state', 'combined');
            }
        }
    );
}

/**
 * Initialize the legend builder tool
 */
function initializeLegendBuilder() {
    // This would connect to a more complex legend building interface
    // For now, we'll just add a simple animation effect
    
    gsap.from('.legend-builder-placeholder img', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5
    });
}

/**
 * Initialize the map explorer interactive elements
 */
function initializeMapExplorer() {
    // Animate the explorer list items
    gsap.from('.exploring-stops-list li', {
        x: -20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.3
    });
    
    // Animate the map tour placeholder
    gsap.from('.map-tour-placeholder', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1
    });
}

/**
 * Initialize the insight capture tool
 */
function initializeInsightCaptureTool() {
    // Animate the insight categories
    gsap.from('.insight-category', {
        y: 20,
        opacity: 1,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3
    });
    
    // Disable save button initially
    enableSaveButton(false);
    
    // Check for existing insights
    loadSavedInsights();
}

/**
 * Enable or disable the save insights button
 */
function enableSaveButton(enabled) {
    $('button:contains("Save Insights")').prop('disabled', !enabled);
    
    if (enabled) {
        $('button:contains("Save Insights")').removeClass('btn-secondary').addClass('btn-primary');
    } else {
        $('button:contains("Save Insights")').removeClass('btn-primary').addClass('btn-secondary');
    }
}

/**
 * Save user insights to local storage
 */
function saveInsights() {
    const insights = {
        misalignments: $('#misalignmentInsights').val(),
        competitions: $('#competitionInsights').val(),
        capacities: $('#capacityInsights').val(),
        influence: $('#influenceInsights').val(),
        timestamp: new Date().toISOString()
    };
    
    // Get existing data or initialize new
    const savedData = JSON.parse(localStorage.getItem('mentalMapInsights') || '{}');
    
    // Save new insights
    savedData.module3_1 = insights;
    localStorage.setItem('mentalMapInsights', JSON.stringify(savedData));
    
    // Visual confirmation
    showSaveConfirmation();
    
    // Disable save button until next change
    enableSaveButton(false);
}

/**
 * Load any previously saved insights
 */
function loadSavedInsights() {
    const savedData = JSON.parse(localStorage.getItem('mentalMapInsights') || '{}');
    
    if (savedData.module3_1) {
        $('#misalignmentInsights').val(savedData.module3_1.misalignments || '');
        $('#competitionInsights').val(savedData.module3_1.competitions || '');
        $('#capacityInsights').val(savedData.module3_1.capacities || '');
        $('#influenceInsights').val(savedData.module3_1.influence || '');
    }
}

/**
 * Show save confirmation message
 */
function showSaveConfirmation() {
    // Create a toast notification
    const toast = $(`
        <div class="toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle me-2"></i> Your insights have been saved!
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `);
    
    // Add to document
    $('body').append(toast);
    
    // Initialize Bootstrap toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove from DOM after hiding
    toast.on('hidden.bs.toast', function() {
        toast.remove();
    });
}
