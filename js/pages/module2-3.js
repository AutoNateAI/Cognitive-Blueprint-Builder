/**
 * Module 2.3: Cycles, Leaks, and Generators
 * This file contains the JavaScript functionality for the interactive elements
 * in Module 2.3 of the Cognitive Blueprint Builder tutorial.
 */

// Initialize when document is ready
$(document).ready(function() {
    // Initialize module components
    initializeProgressTracking();
    initializeCycleVisualizations();
    initializeLeakDetector();
    initializeGeneratorCards();
    initializeSystemOptimizationSimulator();
    
    // Save progress when user scrolls past specific sections
    initializeScrollBasedSaving();
});

/**
 * Progress Tracking Functionality
 * Tracks and saves user progress through the module
 */
function initializeProgressTracking() {
    // Set initial progress
    const moduleProgress = localStorage.getItem('module2-3-progress') || '0';
    $('.progress-bar').css('width', moduleProgress + '%').attr('aria-valuenow', moduleProgress);
    $('.text-muted').text(moduleProgress + '% Complete');
    
    // Track completion of major sections
    $('.module-section').on('focus', '.interactive-complete', function() {
        updateModuleProgress(parseInt(moduleProgress) + 20);
    });
}

/**
 * Update the module progress in the UI and localStorage
 * @param {number} progress - Progress percentage (0-100)
 */
function updateModuleProgress(progress) {
    // Cap progress at 100%
    progress = Math.min(progress, 100);
    
    // Update UI
    $('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);
    $('.text-muted').text(progress + '% Complete');
    
    // Save to localStorage
    localStorage.setItem('module2-3-progress', progress.toString());
    
    // If module is complete, save to overall progress
    if (progress === 100) {
        const overallProgress = parseInt(localStorage.getItem('overall-progress') || '0');
        localStorage.setItem('overall-progress', Math.min(overallProgress + 5, 100).toString());
    }
}

/**
 * Save progress based on scroll position
 */
function initializeScrollBasedSaving() {
    const sections = [
        { id: 'cycles-section', progress: 20 },
        { id: 'leaks-section', progress: 40 },
        { id: 'generators-section', progress: 60 },
        { id: 'sustainability-section', progress: 80 },
        { id: 'completion-section', progress: 100 }
    ];
    
    $(window).on('scroll', function() {
        const currentScroll = $(window).scrollTop() + $(window).height();
        
        sections.forEach(section => {
            const $section = $('#' + section.id);
            if ($section.length && currentScroll > $section.offset().top + $section.height() / 2) {
                const currentProgress = parseInt(localStorage.getItem('module2-3-progress') || '0');
                if (section.progress > currentProgress) {
                    updateModuleProgress(section.progress);
                }
            }
        });
    });
}

/**
 * Cycle Visualizations
 * Creates and animates different types of mental cycles
 */
function initializeCycleVisualizations() {
    // Set up reinforcing cycle visualization
    setupReinforcingCycle('#reinforcing-cycle-viz', [
        { id: 'focus', label: 'Focus', color: '#4caf50', x: 100, y: 150 },
        { id: 'progress', label: 'Progress', color: '#2196f3', x: 250, y: 75 },
        { id: 'motivation', label: 'Motivation', color: '#ff9800', x: 400, y: 150 },
        { id: 'skill', label: 'Skill', color: '#9c27b0', x: 250, y: 225 }
    ], true);
    
    // Set up balancing cycle visualization
    setupBalancingCycle('#balancing-cycle-viz', [
        { id: 'stress', label: 'Stress', color: '#f44336', x: 100, y: 150 },
        { id: 'awareness', label: 'Awareness', color: '#2196f3', x: 250, y: 75 },
        { id: 'relaxation', label: 'Relaxation', color: '#4caf50', x: 400, y: 150 }
    ]);
    
    // Allow users to create custom cycles
    setupCustomCycleBuilder('#custom-cycle-builder');
}

/**
 * Set up a reinforcing cycle visualization
 * @param {string} selector - CSS selector for the visualization container
 * @param {Array} nodes - Array of node objects with id, label, color, x, y properties
 * @param {boolean} isVirtuous - Whether this is a virtuous (true) or vicious (false) cycle
 */
function setupReinforcingCycle(selector, nodes, isVirtuous = true) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Add nodes to the container
    nodes.forEach(node => {
        $container.append(
            `<div class="cycle-node" id="${node.id}" style="background-color: ${node.color}; left: ${node.x}px; top: ${node.y}px;">
                <i class="bi bi-${getNodeIcon(node.id)}"></i>
                <div class="node-label">${node.label}</div>
            </div>`
        );
    });
    
    // Add connectors between nodes
    for (let i = 0; i < nodes.length; i++) {
        const currentNode = nodes[i];
        const nextNode = nodes[(i + 1) % nodes.length];
        
        drawConnector($container, currentNode, nextNode, isVirtuous ? 'positive' : 'negative');
    }
    
    // Add animation
    animateCycle($container, isVirtuous);
    
    // Add interaction
    $container.find('.cycle-node').on('click', function() {
        const nodeId = $(this).attr('id');
        showNodeDetails(nodeId, isVirtuous);
    });
}

/**
 * Set up a balancing cycle visualization
 * @param {string} selector - CSS selector for the visualization container
 * @param {Array} nodes - Array of node objects with id, label, color, x, y properties
 */
function setupBalancingCycle(selector, nodes) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Add nodes to the container
    nodes.forEach(node => {
        $container.append(
            `<div class="cycle-node" id="${node.id}" style="background-color: ${node.color}; left: ${node.x}px; top: ${node.y}px;">
                <i class="bi bi-${getNodeIcon(node.id)}"></i>
                <div class="node-label">${node.label}</div>
            </div>`
        );
    });
    
    // Add connectors between nodes (alternating positive/negative)
    for (let i = 0; i < nodes.length; i++) {
        const currentNode = nodes[i];
        const nextNode = nodes[(i + 1) % nodes.length];
        
        // Alternate between positive and negative connections
        const connectionType = i % 2 === 0 ? 'positive' : 'negative';
        drawConnector($container, currentNode, nextNode, connectionType);
    }
    
    // Add animation
    animateBalancingCycle($container);
    
    // Add interaction
    $container.find('.cycle-node').on('click', function() {
        const nodeId = $(this).attr('id');
        showNodeDetails(nodeId, 'balancing');
    });
}

/**
 * Draw a connector between two nodes
 * @param {jQuery} $container - The container element
 * @param {Object} fromNode - Starting node
 * @param {Object} toNode - Ending node
 * @param {string} type - Connection type (positive, negative, neutral)
 */
function drawConnector($container, fromNode, toNode, type = 'neutral') {
    // Calculate center points of nodes
    const fromX = fromNode.x + 40; // Half of node width (80px)
    const fromY = fromNode.y + 40;
    const toX = toNode.x + 40;
    const toY = toNode.y + 40;
    
    // Calculate distance and angle
    const dx = toX - fromX;
    const dy = toY - fromY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Create connector element with appropriate position, length, and rotation
    const $connector = $(`<div class="cycle-connector ${type}" style="
        left: ${fromX}px;
        top: ${fromY}px;
        width: ${length - 80}px;
        transform: rotate(${angle}deg);
    "></div>`);
    
    $container.append($connector);
}

/**
 * Get an appropriate icon for a node based on its id
 * @param {string} nodeId - The node ID
 * @returns {string} - Bootstrap icon name
 */
function getNodeIcon(nodeId) {
    // Map common node types to bootstrap icons
    const iconMap = {
        focus: 'eye',
        progress: 'graph-up-arrow',
        motivation: 'lightning-charge',
        skill: 'tools',
        stress: 'exclamation-triangle',
        awareness: 'eye',
        relaxation: 'heart',
        energy: 'battery-charging',
        willpower: 'shield',
        creativity: 'palette',
        attention: 'eyeglasses',
        time: 'clock',
        default: 'circle'
    };
    
    return iconMap[nodeId] || iconMap.default;
}

/**
 * Animate a cycle visualization with a pulse effect
 * @param {jQuery} $container - The cycle container
 * @param {boolean|string} cycleType - Type of cycle (true=virtuous, false=vicious, 'balancing'=balancing)
 */
function animateCycle($container, cycleType) {
    // Pulse effect on nodes
    const nodes = $container.find('.cycle-node');
    nodes.each(function(index) {
        const $node = $(this);
        gsap.to($node, {
            scale: 1.1,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            duration: 1,
            delay: index * 0.5,
            repeat: -1,
            yoyo: true
        });
    });
    
    // Flow animation on connectors
    const connectors = $container.find('.cycle-connector');
    connectors.each(function(index) {
        const $connector = $(this);
        // Add a pulse effect
        gsap.fromTo($connector, 
            { opacity: 0.5, width: $(this).width() * 0.85 },
            { opacity: 1, width: $(this).width(), duration: 1.5, delay: index * 0.5, repeat: -1, yoyo: true }
        );
    });
}

/**
 * Animate a balancing cycle visualization
 * @param {jQuery} $container - The cycle container
 */
function animateBalancingCycle($container) {
    // Similar to regular cycle animation but with alternating effects
    animateCycle($container, 'balancing');
}

/**
 * Show detailed information about a node when clicked
 * @param {string} nodeId - ID of the clicked node
 * @param {boolean|string} cycleType - Type of cycle the node belongs to
 */
function showNodeDetails(nodeId, cycleType) {
    // Node details data based on node type and cycle context
    const nodeDetails = getNodeDetailsData(nodeId, cycleType);
    
    // Create or update details panel
    let $detailsPanel = $('#node-details-panel');
    if (!$detailsPanel.length) {
        $detailsPanel = $('<div id="node-details-panel" class="node-details p-3 mb-3 rounded"></div>');
        $('#' + (typeof cycleType === 'boolean' ? 
            (cycleType ? 'reinforcing-virtuous' : 'reinforcing-vicious') : 
            'balancing') + '-cycle-viz')
            .after($detailsPanel);
    }
    
    // Fill with content
    $detailsPanel.html(`
        <h5>${nodeDetails.title}</h5>
        <p>${nodeDetails.description}</p>
        <div class="examples">
            <strong>Examples:</strong>
            <ul>
                ${nodeDetails.examples.map(ex => `<li>${ex}</li>`).join('')}
            </ul>
        </div>
    `).hide().slideDown(300);
}

/**
 * Get detailed information about a node
 * @param {string} nodeId - ID of the node
 * @param {boolean|string} cycleType - Type of cycle the node belongs to
 * @returns {Object} Node details object with title, description, examples
 */
function getNodeDetailsData(nodeId, cycleType) {
    // A data map of node details based on node ID and cycle context
    const detailsMap = {
        // Focus node details
        focus: {
            virtuous: {
                title: "Focus in Virtuous Cycles",
                description: "In a virtuous cycle, focus becomes self-reinforcing, allowing sustained attention with less effort over time.",
                examples: ["Deep work sessions that get easier to maintain", "Reading flow that deepens with engagement", "Meditation practice that becomes more natural"]
            },
            vicious: {
                title: "Focus in Vicious Cycles",
                description: "In a vicious cycle, focus becomes increasingly difficult to maintain, creating a downward spiral.",
                examples: ["Distraction leading to frustration leading to more distraction", "Multitasking causing errors causing stress causing more multitasking", "Broken concentration requiring more effort to refocus"]
            }
        },
        // Other nodes would follow a similar pattern...
        stress: {
            balancing: {
                title: "Stress in Balancing Cycles",
                description: "In a balancing cycle, stress serves as a signal that triggers corrective responses in the system.",
                examples: ["Stress triggering awareness of need for self-care", "Pressure leading to prioritization of important tasks", "Physical tension prompting relaxation activities"]
            }
        }
    };
    
    // Default details if specific mapping not found
    const defaultDetails = {
        title: nodeId.charAt(0).toUpperCase() + nodeId.slice(1),
        description: "This represents a component in your mental system that interacts with other components in this cycle.",
        examples: ["Example 1", "Example 2", "Example 3"]
    };
    
    // Determine which type of cycle we're dealing with
    let cycleCategory;
    if (cycleType === true) cycleCategory = 'virtuous';
    else if (cycleType === false) cycleCategory = 'vicious';
    else cycleCategory = 'balancing';
    
    // Return specific details if available, otherwise default
    return (detailsMap[nodeId] && detailsMap[nodeId][cycleCategory]) || defaultDetails;
}

/**
 * Set up custom cycle builder interface
 * @param {string} selector - CSS selector for the custom cycle builder container
 */
function setupCustomCycleBuilder(selector) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Create UI for adding nodes and connections
    $container.html(`
        <div class="cycle-builder mb-4">
            <div class="cycle-visualization custom-cycle-canvas" style="height: 300px;"></div>
            <div class="builder-controls mt-3">
                <div class="row g-2 mb-3">
                    <div class="col">
                        <input type="text" class="form-control" id="node-name" placeholder="Node name">
                    </div>
                    <div class="col-auto">
                        <input type="color" class="form-control form-control-color" id="node-color" value="#4caf50">
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-primary" id="add-node-btn">Add Node</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="cycle-type" id="virtuous-cycle" value="virtuous" checked>
                            <label class="form-check-label" for="virtuous-cycle">Virtuous</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="cycle-type" id="vicious-cycle" value="vicious">
                            <label class="form-check-label" for="vicious-cycle">Vicious</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="cycle-type" id="balancing-cycle" value="balancing">
                            <label class="form-check-label" for="balancing-cycle">Balancing</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    // Initialize the custom cycle canvas with existing nodes
    const customNodes = [];
    
    // Handle adding new nodes
    $('#add-node-btn').on('click', function() {
        const nodeName = $('#node-name').val().trim();
        const nodeColor = $('#node-color').val();
        
        if (nodeName) {
            const nodeId = nodeName.toLowerCase().replace(/\s+/g, '-');
            const nodeX = 150 + Math.random() * 200; // Random position
            const nodeY = 50 + Math.random() * 200;
            
            customNodes.push({ id: nodeId, label: nodeName, color: nodeColor, x: nodeX, y: nodeY });
            updateCustomCycle();
            $('#node-name').val(''); // Clear the input
        }
    });
    
    // Handle cycle type changes
    $('input[name="cycle-type"]').on('change', function() {
        updateCustomCycle();
    });
    
    // Update the custom cycle visualization
    function updateCustomCycle() {
        const $canvas = $('.custom-cycle-canvas');
        $canvas.empty();
        
        if (customNodes.length < 2) return;
        
        const cycleType = $('input[name="cycle-type"]:checked').val();
        const isVirtuous = cycleType === 'virtuous';
        const isBalancing = cycleType === 'balancing';
        
        // Add nodes
        customNodes.forEach(node => {
            $canvas.append(
                `<div class="cycle-node" id="${node.id}" style="background-color: ${node.color}; left: ${node.x}px; top: ${node.y}px;">
                    <i class="bi bi-${getNodeIcon(node.id)}"></i>
                    <div class="node-label">${node.label}</div>
                </div>`
            );
        });
        
        // Add connectors
        for (let i = 0; i < customNodes.length; i++) {
            const currentNode = customNodes[i];
            const nextNode = customNodes[(i + 1) % customNodes.length];
            
            let connectionType;
            if (isBalancing) {
                connectionType = i % 2 === 0 ? 'positive' : 'negative';
            } else {
                connectionType = isVirtuous ? 'positive' : 'negative';
            }
            
            drawConnector($canvas, currentNode, nextNode, connectionType);
        }
        
        // Make nodes draggable
        $canvas.find('.cycle-node').draggable({
            containment: "parent",
            stop: function(event, ui) {
                // Update node position in the array
                const nodeId = $(this).attr('id');
                const nodeIndex = customNodes.findIndex(n => n.id === nodeId);
                if (nodeIndex >= 0) {
                    customNodes[nodeIndex].x = ui.position.left;
                    customNodes[nodeIndex].y = ui.position.top;
                    updateCustomCycle();
                }
            }
        });
    }
}

/**
 * Resource Leak Detection & Analysis
 * Functions for identifying and analyzing resource leaks in mental systems
 */
function initializeLeakDetector() {
    // Set up the leak detector interface
    setupLeakSurvey('#leak-detector-tool');
    
    // Setup the leak heatmap
    setupLeakHeatmap('#leak-heatmap');
    
    // Set up the leak intervention planner
    setupLeakInterventions('#leak-interventions');
}

/**
 * Set up the leak detection survey
 * @param {string} selector - CSS selector for the leak survey container
 */
function setupLeakSurvey(selector) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Define common leak types based on mental resource categories
    const leakTypes = [
        {
            category: 'attention',
            title: 'Attention Leaks',
            icon: 'eye',
            leaks: [
                { id: 'multitasking', label: 'Excessive Multitasking', impact: 8 },
                { id: 'distractions', label: 'Environmental Distractions', impact: 7 },
                { id: 'notifications', label: 'Digital Notifications', impact: 6 },
                { id: 'meandering', label: 'Mind Wandering During Tasks', impact: 5 },
                { id: 'meetings', label: 'Unproductive Meetings', impact: 7 }
            ]
        },
        {
            category: 'energy',
            title: 'Energy Leaks',
            icon: 'battery-half',
            leaks: [
                { id: 'poorSleep', label: 'Poor Sleep Hygiene', impact: 9 },
                { id: 'skipMeals', label: 'Irregular Eating Patterns', impact: 6 },
                { id: 'sedentary', label: 'Sedentary Behavior', impact: 7 },
                { id: 'overcommitment', label: 'Overcommitment', impact: 8 },
                { id: 'inefficientProcess', label: 'Inefficient Work Processes', impact: 5 }
            ]
        },
        {
            category: 'willpower',
            title: 'Willpower Leaks',
            icon: 'shield',
            leaks: [
                { id: 'unclearPriorities', label: 'Unclear Priorities', impact: 8 },
                { id: 'perfectionism', label: 'Perfectionism', impact: 7 },
                { id: 'decisionFatigue', label: 'Decision Fatigue', impact: 6 },
                { id: 'valueMisalignment', label: 'Misalignment with Values', impact: 9 },
                { id: 'excessiveOptimism', label: 'Planning Fallacy', impact: 5 }
            ]
        }
    ];
    
    // Create the survey UI
    let surveyHTML = `
        <h5 class="mb-3">Identify Your Resource Leaks</h5>
        <p class="mb-4">Rate how much each potential leak affects your mental resources:</p>
    `;
    
    leakTypes.forEach(type => {
        surveyHTML += `
            <div class="leak-type">
                <h4><i class="bi bi-${type.icon}"></i> ${type.title}</h4>
                <div class="leak-items">
        `;
        
        type.leaks.forEach(leak => {
            surveyHTML += `
                <div class="leak-item" data-leak-id="${leak.id}" data-category="${type.category}" data-default-impact="${leak.impact}">
                    <div class="leak-description">${leak.label}</div>
                    <div class="leak-impact">
                        <div class="impact-bar">
                            <div class="fill" style="width: ${leak.impact * 10}%"></div>
                        </div>
                        <div class="impact-value">${leak.impact}</div>
                    </div>
                </div>
            `;
        });
        
        surveyHTML += `
                </div>
            </div>
        `;
    });
    
    // Add custom leak option
    surveyHTML += `
        <div class="mt-4">
            <h5>Add Your Own Leak</h5>
            <div class="row g-2 mb-3">
                <div class="col">
                    <input type="text" class="form-control" id="custom-leak-name" placeholder="Describe the leak">
                </div>
                <div class="col-auto">
                    <select class="form-select" id="custom-leak-category">
                        <option value="attention">Attention</option>
                        <option value="energy">Energy</option>
                        <option value="willpower">Willpower</option>
                        <option value="creativity">Creativity</option>
                    </select>
                </div>
                <div class="col-auto">
                    <select class="form-select" id="custom-leak-impact">
                        <option value="1">1 (Minor)</option>
                        <option value="3">3</option>
                        <option value="5" selected>5 (Moderate)</option>
                        <option value="7">7</option>
                        <option value="9">9 (Severe)</option>
                    </select>
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary" id="add-custom-leak-btn">Add</button>
                </div>
            </div>
        </div>
        
        <div class="mt-4">
            <button class="btn btn-success" id="analyze-leaks-btn">Analyze My Resource Leaks</button>
        </div>
    `;
    
    $container.html(surveyHTML);
    
    // Make leak items interactive
    $container.find('.leak-item').on('click', function() {
        // Toggle selection
        $(this).toggleClass('active');
        
        // Update the fill width based on the impact value
        updateLeakImpact($(this));
    });
    
    // Handle custom leak addition
    $('#add-custom-leak-btn').on('click', function() {
        const leakName = $('#custom-leak-name').val().trim();
        const category = $('#custom-leak-category').val();
        const impact = parseInt($('#custom-leak-impact').val());
        
        if (leakName) {
            const leakId = leakName.toLowerCase().replace(/\s+/g, '-');
            
            // Find the appropriate leak type section
            const $typeSection = $container.find(`.leak-type h4 i.bi-${getCategoryIcon(category)}`).closest('.leak-type').find('.leak-items');
            
            // Add the new leak item
            const $newLeakItem = $(`
                <div class="leak-item active" data-leak-id="${leakId}" data-category="${category}" data-default-impact="${impact}">
                    <div class="leak-description">${leakName}</div>
                    <div class="leak-impact">
                        <div class="impact-bar">
                            <div class="fill" style="width: ${impact * 10}%"></div>
                        </div>
                        <div class="impact-value">${impact}</div>
                    </div>
                </div>
            `);
            
            $typeSection.append($newLeakItem);
            
            // Add event handler
            $newLeakItem.on('click', function() {
                $(this).toggleClass('active');
                updateLeakImpact($(this));
            });
            
            // Clear the input
            $('#custom-leak-name').val('');
        }
    });
    
    // Handle leak analysis button click
    $('#analyze-leaks-btn').on('click', function() {
        analyzeLeaks($container);
    });
    
    // Helper function to update leak impact
    function updateLeakImpact($leakItem) {
        const currentImpact = parseInt($leakItem.find('.impact-value').text());
        let newImpact;
        
        if ($leakItem.hasClass('active')) {
            // Increase impact (cap at 10)
            newImpact = Math.min(currentImpact + 1, 10);
        } else {
            // Decrease impact (floor at 0)
            newImpact = Math.max(currentImpact - 1, 0);
        }
        
        $leakItem.find('.impact-value').text(newImpact);
        $leakItem.find('.fill').css('width', newImpact * 10 + '%');
    }
    
    // Helper function to get icon for resource category
    function getCategoryIcon(category) {
        const iconMap = {
            attention: 'eye',
            energy: 'battery-half',
            willpower: 'shield',
            creativity: 'palette'
        };
        
        return iconMap[category] || 'question-circle';
    }
}

/**
 * Analyze selected leaks and generate insights
 * @param {jQuery} $container - The leak survey container
 */
function analyzeLeaks($container) {
    // Collect active leaks
    const activeLeaks = [];
    $container.find('.leak-item.active').each(function() {
        activeLeaks.push({
            id: $(this).data('leak-id'),
            category: $(this).data('category'),
            label: $(this).find('.leak-description').text(),
            impact: parseInt($(this).find('.impact-value').text())
        });
    });
    
    // Sort by impact
    activeLeaks.sort((a, b) => b.impact - a.impact);
    
    // Group by category
    const leaksByCategory = {};
    activeLeaks.forEach(leak => {
        if (!leaksByCategory[leak.category]) {
            leaksByCategory[leak.category] = [];
        }
        leaksByCategory[leak.category].push(leak);
    });
    
    // Calculate total impact by category
    const categoryImpacts = {};
    Object.keys(leaksByCategory).forEach(category => {
        categoryImpacts[category] = leaksByCategory[category].reduce((sum, leak) => sum + leak.impact, 0);
    });
    
    // Show results to user
    if (activeLeaks.length === 0) {
        alert('Please select at least one resource leak to analyze.');
        return;
    }
    
    // Update the heat map with these insights
    updateLeakHeatmap(leaksByCategory, categoryImpacts);
    
    // Generate intervention suggestions
    generateInterventions(activeLeaks.slice(0, 5)); // Top 5 leaks
    
    // Scroll to results
    $('html, body').animate({
        scrollTop: $('#leak-heatmap').offset().top - 100
    }, 500);
}

/**
 * Set up the leak heat map visualization
 * @param {string} selector - CSS selector for the heat map container
 */
function setupLeakHeatmap(selector) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Initial setup - will be populated after analysis
    $container.html(`
        <h5 class="mb-3">Your Mental Resource Leak Heat Map</h5>
        <p>Analyze your leaks to see where your mental resources are being lost.</p>
        <div class="heatmap-visualization mt-4" style="height: 250px; position: relative;">
            <!-- Will be populated by analysis -->
        </div>
        <div class="heatmap-legend mt-3 d-flex justify-content-between">
            <div class="legend-item">
                <span class="legend-color" style="background: rgba(76, 175, 80, 0.3);"></span>
                <span>Low Impact</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: rgba(255, 152, 0, 0.5);"></span>
                <span>Medium Impact</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: rgba(244, 67, 54, 0.7);"></span>
                <span>High Impact</span>
            </div>
        </div>
    `);
    
    // Create default demo visualization with example data
    createDefaultHeatmap($container.find('.heatmap-visualization'));
}

/**
 * Create a default heat map visualization to demonstrate functionality
 * @param {jQuery} $heatmap - The container for the heat map
 */
function createDefaultHeatmap($heatmap) {
    // Sample data for default visualization
    const defaultCategories = {
        'attention': 32,
        'energy': 27,
        'willpower': 18,
        'creativity': 12
    };
    
    // Create a grid layout for the heatmap
    const cols = 2;
    const rows = 2;
    
    // Calculate cell dimensions
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    
    // Calculate total impact for scaling
    const totalImpact = Object.values(defaultCategories).reduce((sum, impact) => sum + impact, 0);
    
    // Map categories to visual regions
    let i = 0;
    for (const [category, impact] of Object.entries(defaultCategories)) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        i++;
        
        // Normalize impact for color intensity (0-100%)
        const impactPercent = (impact / totalImpact) * 100;
        const intensity = Math.min(Math.max(impactPercent * 2, 30), 100); // Scale between 30-100%
        
        // Determine color based on impact
        let color;
        if (impactPercent > 40) {
            color = `rgba(244, 67, 54, ${intensity/100})`; // Red for high
        } else if (impactPercent > 25) {
            color = `rgba(255, 152, 0, ${intensity/100})`; // Orange for medium
        } else {
            color = `rgba(76, 175, 80, ${intensity/100})`; // Green for low
        }
        
        // Create the cell
        const $cell = $(`
            <div class="heatmap-cell" style="
                position: absolute;
                left: ${col * cellWidth}%;
                top: ${row * cellHeight}%;
                width: ${cellWidth-4}%;
                height: ${cellHeight-4}%;
                margin: 2%;
                background-color: ${color};
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                cursor: pointer;
            ">
                <i class="bi bi-${getCategoryIcon(category)} mb-2" style="font-size: 1.5rem;"></i>
                <div class="cell-title">${formatCategoryName(category)}</div>
                <div class="cell-value">${impact} points</div>
            </div>
        `);
        
        // Add tooltip
        $cell.attr('data-bs-toggle', 'tooltip')
             .attr('data-bs-html', 'true')
             .attr('title', `<strong>Example Leaks:</strong><ul><li>Sample leak 1</li><li>Sample leak 2</li></ul>`);
        
        $heatmap.append($cell);
    }
    
    // Add animation to draw attention
    $heatmap.find('.heatmap-cell').each(function(i) {
        gsap.from(this, {
            scale: 0.5,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'back.out(1.7)'
        });
    });
    
    // Initialize tooltips
    setTimeout(() => {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }, 500);
}

/**
 * Update the leak heat map with analysis results
 * @param {Object} leaksByCategory - Leaks grouped by category
 * @param {Object} categoryImpacts - Total impact score by category
 */
function updateLeakHeatmap(leaksByCategory, categoryImpacts) {
    const $heatmap = $('#leak-heatmap .heatmap-visualization');
    if (!$heatmap.length) return;
    
    // Clear previous content
    $heatmap.empty();
    
    // Calculate total impact for scaling
    const totalImpact = Object.values(categoryImpacts).reduce((sum, impact) => sum + impact, 0);
    if (totalImpact === 0) return;
    
    // Map categories to visual regions with appropriate sizes
    const categories = Object.keys(categoryImpacts);
    
    // Create a grid layout for the heatmap
    const cols = Math.ceil(Math.sqrt(categories.length));
    const rows = Math.ceil(categories.length / cols);
    
    // Calculate cell dimensions
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    
    // Create heat cells
    categories.forEach((category, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        // Normalize impact for color intensity (0-100%)
        const impactPercent = (categoryImpacts[category] / totalImpact) * 100;
        const intensity = Math.min(Math.max(impactPercent * 2, 30), 100); // Scale between 30-100%
        
        // Determine color based on impact
        let color;
        if (impactPercent > 60) {
            color = `rgba(244, 67, 54, ${intensity/100})`; // Red for high
        } else if (impactPercent > 30) {
            color = `rgba(255, 152, 0, ${intensity/100})`; // Orange for medium
        } else {
            color = `rgba(76, 175, 80, ${intensity/100})`; // Green for low
        }
        
        // Create the cell
        const $cell = $(`
            <div class="heatmap-cell" style="
                position: absolute;
                left: ${col * cellWidth}%;
                top: ${row * cellHeight}%;
                width: ${cellWidth}%;
                height: ${cellHeight}%;
                background-color: ${color};
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                cursor: pointer;
            ">
                <i class="bi bi-${getCategoryIcon(category)} mb-2" style="font-size: 1.5rem;"></i>
                <div class="cell-title">${formatCategoryName(category)}</div>
                <div class="cell-value">${categoryImpacts[category]} points</div>
            </div>
        `);
        
        // Add tooltip with top leaks in this category
        const topLeaksHtml = leaksByCategory[category]
            .slice(0, 3)
            .map(leak => `<li>${leak.label} (${leak.impact})</li>`)
            .join('');
            
        $cell.attr('data-bs-toggle', 'tooltip')
             .attr('data-bs-html', 'true')
             .attr('title', `<strong>Top Leaks:</strong><ul>${topLeaksHtml}</ul>`);
        
        $heatmap.append($cell);
    });
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Helper function to format category names
    function formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Add animation to draw attention
    $heatmap.find('.heatmap-cell').each(function(i) {
        gsap.from(this, {
            scale: 0.5,
            opacity: 0,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'back.out(1.7)'
        });
    });
}

/**
 * Set up the leak interventions planning tool
 * @param {string} selector - CSS selector for the interventions container
 */
function setupLeakInterventions(selector) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Initial setup - will be populated after analysis
    $container.html(`
        <h5 class="mb-3">Recommended Interventions</h5>
        <p>Based on your top resource leaks, here are personalized interventions:</p>
        <div class="interventions-list mt-4">
            <!-- Will be populated by analysis -->
            <div class="placeholder-message text-center py-4 text-muted">
                <i class="bi bi-arrow-up-circle" style="font-size: 2rem;"></i>
                <p class="mt-2">Complete the leak detector above to see personalized recommendations</p>
            </div>
        </div>
    `);
}

/**
 * Generate intervention suggestions for top leaks
 * @param {Array} topLeaks - Array of the most impactful leaks
 */
function generateInterventions(topLeaks) {
    const $container = $('#leak-interventions .interventions-list');
    if (!$container.length) return;
    
    // Clear previous content
    $container.empty();
    
    // Add interventions for each top leak
    topLeaks.forEach(leak => {
        const interventions = getInterventionsForLeak(leak);
        
        const $interventionCard = $(`
            <div class="card mb-3">
                <div class="card-header d-flex align-items-center bg-${getColorForImpact(leak.impact)}">
                    <i class="bi bi-${getCategoryIcon(leak.category)} me-2"></i>
                    <h6 class="mb-0">${leak.label} (Impact: ${leak.impact})</h6>
                </div>
                <div class="card-body">
                    <p class="card-text">${interventions.description}</p>
                    <h6>Try these approaches:</h6>
                    <ul class="intervention-strategies">
                        ${interventions.strategies.map(strategy => `<li>${strategy}</li>`).join('')}
                    </ul>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="intervention-${leak.id}">
                        <label class="form-check-label" for="intervention-${leak.id}">
                            Track this intervention in my plan
                        </label>
                    </div>
                </div>
            </div>
        `);
        
        $container.append($interventionCard);
    });
    
    // Add a save button
    $container.append(`
        <div class="text-center mt-4">
            <button class="btn btn-primary" id="save-interventions-btn">
                <i class="bi bi-save me-2"></i>Save to My Mental Architecture Plan
            </button>
        </div>
    `);
    
    // Handle save button click
    $('#save-interventions-btn').on('click', function() {
        const selectedInterventions = [];
        $container.find('.form-check-input:checked').each(function() {
            const $card = $(this).closest('.card');
            selectedInterventions.push({
                leak: $card.find('.card-header h6').text(),
                strategies: $card.find('.intervention-strategies li').map(function() { return $(this).text(); }).get()
            });
        });
        
        // Save to localStorage
        if (selectedInterventions.length > 0) {
            const savedPlans = JSON.parse(localStorage.getItem('intervention-plans') || '[]');
            savedPlans.push({
                date: new Date().toISOString(),
                interventions: selectedInterventions
            });
            localStorage.setItem('intervention-plans', JSON.stringify(savedPlans));
            
            // Show confirmation
            alert('Your intervention plan has been saved!');
        } else {
            alert('Please select at least one intervention to save.');
        }
    });
    
    // Helper functions
    function getColorForImpact(impact) {
        if (impact >= 8) return 'danger text-white';
        if (impact >= 5) return 'warning';
        return 'success text-white';
    }
}

/**
 * Get intervention strategies for a specific leak
 * @param {Object} leak - Leak to generate interventions for
 * @returns {Object} - Object with description and strategies
 */
function getInterventionsForLeak(leak) {
    // Collection of specific interventions for common leak types
    const interventionLibrary = {
        // Attention leaks
        multitasking: {
            description: "Multitasking dramatically reduces attention quality and increases cognitive load, leading to errors and mental fatigue.",
            strategies: [
                "Implement focused time blocks of 25-90 minutes with no task switching",
                "Use a physical timer visible in your workspace to enforce single-tasking",
                "Create a 'parking lot' to write down ideas that come up while focusing on something else",
                "Practice noticing when you're switching tasks and gently returning to one task"
            ]
        },
        distractions: {
            description: "Environmental distractions constantly pull your attention away, requiring energy to refocus each time.",
            strategies: [
                "Create a dedicated workspace with minimal visual and auditory distractions",
                "Use noise-cancelling headphones or ambient background sounds",
                "Implement a visual 'do not disturb' signal for people around you",
                "Schedule specific times to check email and messages rather than responding immediately"
            ]
        },
        // Energy leaks
        poorSleep: {
            description: "Poor sleep quality or insufficient duration directly impacts your mental energy reserves for the following day.",
            strategies: [
                "Establish a consistent sleep and wake schedule, even on weekends",
                "Create a wind-down ritual 30-60 minutes before bed with no screens",
                "Optimize your bedroom environment (temperature, darkness, quiet)",
                "Track your sleep quality to identify patterns and improvements"
            ]
        },
        // Willpower leaks
        perfectionism: {
            description: "Perfectionism consumes willpower through excessive revision, overthinking, and self-criticism.",
            strategies: [
                "Set time boxes for tasks with a 'good enough' threshold defined in advance",
                "Practice deliberate imperfection in low-stakes situations",
                "Focus on learning goals rather than performance goals",
                "Schedule specific 'refinement time' separate from initial creation phases"
            ]
        },
        // Default for custom leaks
        default: {
            description: "This resource leak is consuming mental energy that could be directed toward your priorities and goals.",
            strategies: [
                "Track when and where this leak occurs to identify patterns",
                "Create environmental adjustments to reduce friction",
                "Design replacement behaviors that fulfill the same underlying need",
                "Set up accountability structures or social support"
            ]
        }
    };
    
    // Return specific interventions if available, otherwise default
    return interventionLibrary[leak.id] || interventionLibrary.default;
}

/**
 * Resource Generator Functionality
 * Functions for identifying, evaluating and utilizing mental resource generators
 */
function initializeGeneratorCards() {
    // Set up the generator cards
    setupGeneratorTypes('#generator-container');
    
    // Set up the generator effectiveness rating tool
    setupGeneratorRatings('#generator-ratings');
    
    // Set up the custom generator design interface
    setupCustomGenerators('#custom-generator-builder');
}

/**
 * Set up the generator type cards
 * @param {string} selector - CSS selector for the generator container
 */
function setupGeneratorTypes(selector) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Define generator types and examples
    const generatorTypes = [
        {
            category: 'attention',
            title: 'Attention Generators',
            icon: 'eye',
            description: 'Activities and practices that restore or enhance your ability to focus and maintain attention.',
            examples: [
                'Meditation and mindfulness practices',
                'Consistent deep sleep',
                'Nature exposure',
                'Digital detox periods',
                'Single-tasking practice'
            ],
            effectiveness: 4
        },
        {
            category: 'energy',
            title: 'Energy Generators',
            icon: 'battery-charging',
            description: 'Activities that replenish physical and mental energy reserves.',
            examples: [
                'Physical exercise appropriate to your body',
                'Nutrient-dense foods and proper hydration',
                'Meaningful social connection',
                'Purpose-driven activities',
                'Play and genuine enjoyment'
            ],
            effectiveness: 5
        },
        {
            category: 'willpower',
            title: 'Willpower Generators',
            icon: 'shield',
            description: 'Practices that restore decision-making capacity and self-regulation ability.',
            examples: [
                'Small wins that build momentum',
                'Clear personal values connection',
                'Supportive community and accountability',
                'Environmental design that reduces friction',
                'Self-compassion practices'
            ],
            effectiveness: 3
        },
        {
            category: 'creativity',
            title: 'Creativity Generators',
            icon: 'palette',
            description: 'Activities that enhance innovative thinking and creative capacity.',
            examples: [
                'Diverse inputs and novel experiences',
                'Cross-pollination between knowledge domains',
                'Constraints that force innovative thinking',
                'Psychological safety to explore and fail',
                'Time for incubation and non-directed thinking'
            ],
            effectiveness: 4
        }
    ];
    
    // Create the HTML for generator cards
    let generatorsHTML = `
        <h5 class="mb-3">Mental Resource Generators</h5>
        <p class="mb-4">These activities and practices generate the mental resources you need:</p>
        <div class="row g-4">
    `;
    
    // Add cards for each generator type
    generatorTypes.forEach(generator => {
        generatorsHTML += `
            <div class="col-md-6">
                <div class="generator-card ${generator.category}">
                    <h5><i class="bi bi-${generator.icon}"></i> ${generator.title}</h5>
                    <p>${generator.description}</p>
                    <div class="generator-effectiveness">
                        <div class="stars">
                            ${getStarRating(generator.effectiveness)}
                        </div>
                    </div>
                    <ul>
                        ${generator.examples.map(example => `<li>${example}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    
    generatorsHTML += `
        </div>
        <div class="mt-4 text-center">
            <button class="btn btn-outline-primary" id="personalize-generators-btn">
                <i class="bi bi-sliders me-2"></i>Personalize My Generators
            </button>
        </div>
    `;
    
    $container.html(generatorsHTML);
    
    // Handle personalize button click
    $('#personalize-generators-btn').on('click', function() {
        // Smooth scroll to ratings section
        $('html, body').animate({
            scrollTop: $('#generator-ratings').offset().top - 100
        }, 500);
    });
    
    // Helper function to generate star ratings
    function getStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }
        return stars;
    }
}

/**
 * Set up the generator effectiveness rating tool
 * @param {string} selector - CSS selector for the generator ratings container
 */
function setupGeneratorRatings(selector) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Define common generator activities that users can rate
    const generatorActivities = [
        // Attention generators
        { id: 'meditation', label: 'Meditation (10+ minutes)', category: 'attention' },
        { id: 'natureWalk', label: 'Walking in nature', category: 'attention' },
        { id: 'deepSleep', label: 'Deep sleep (7+ hours)', category: 'attention' },
        { id: 'digitalDetox', label: 'Digital detox (2+ hours)', category: 'attention' },
        
        // Energy generators
        { id: 'exercise', label: 'Physical exercise', category: 'energy' },
        { id: 'healthyMeal', label: 'Nutrient-dense meal', category: 'energy' },
        { id: 'socialTime', label: 'Quality time with friends/family', category: 'energy' },
        { id: 'hobbies', label: 'Engaging in favorite hobbies', category: 'energy' },
        
        // Willpower generators
        { id: 'journaling', label: 'Reflective journaling', category: 'willpower' },
        { id: 'smallWin', label: 'Completing a small task fully', category: 'willpower' },
        { id: 'valueActivity', label: 'Activity aligned with core values', category: 'willpower' },
        { id: 'support', label: 'Receiving support or accountability', category: 'willpower' },
        
        // Creativity generators
        { id: 'newInput', label: 'Exposure to new ideas/information', category: 'creativity' },
        { id: 'mindWandering', label: 'Unstructured thinking time', category: 'creativity' },
        { id: 'artActivity', label: 'Creative expression or artistic activity', category: 'creativity' },
        { id: 'novelty', label: 'Trying something new or unfamiliar', category: 'creativity' }
    ];
    
    // Create the ratings interface
    let ratingsHTML = `
        <h5 class="mb-3">Rate Your Resource Generators</h5>
        <p>For each activity, rate how effective it is at generating mental resources for you personally:</p>
        
        <div class="generator-ratings mt-4">
    `;
    
    // Group activities by category
    const categorizedActivities = {};
    generatorActivities.forEach(activity => {
        if (!categorizedActivities[activity.category]) {
            categorizedActivities[activity.category] = [];
        }
        categorizedActivities[activity.category].push(activity);
    });
    
    // Add category sections
    Object.entries(categorizedActivities).forEach(([category, activities]) => {
        ratingsHTML += `
            <div class="generator-category mb-4">
                <h6 class="category-title">
                    <i class="bi bi-${getCategoryIcon(category)}"></i>
                    ${formatCategoryName(category)} Generators
                </h6>
                <div class="list-group">
        `;
        
        activities.forEach(activity => {
            ratingsHTML += `
                <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" data-activity-id="${activity.id}" data-category="${activity.category}">
                    <div class="activity-label">${activity.label}</div>
                    <div class="rating-stars" data-rating="0">
                        <i class="bi bi-star rating-star" data-value="1"></i>
                        <i class="bi bi-star rating-star" data-value="2"></i>
                        <i class="bi bi-star rating-star" data-value="3"></i>
                        <i class="bi bi-star rating-star" data-value="4"></i>
                        <i class="bi bi-star rating-star" data-value="5"></i>
                    </div>
                </div>
            `;
        });
        
        ratingsHTML += `
                </div>
            </div>
        `;
    });
    
    // Add custom activity option
    ratingsHTML += `
        <div class="mt-4">
            <h6>Add Your Own Generator</h6>
            <div class="row g-2 mb-3">
                <div class="col">
                    <input type="text" class="form-control" id="custom-activity-name" placeholder="Describe the activity">
                </div>
                <div class="col-auto">
                    <select class="form-select" id="custom-activity-category">
                        <option value="attention">Attention</option>
                        <option value="energy">Energy</option>
                        <option value="willpower">Willpower</option>
                        <option value="creativity">Creativity</option>
                    </select>
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary" id="add-custom-activity-btn">Add</button>
                </div>
            </div>
        </div>
        
        <div class="mt-4 text-center">
            <button class="btn btn-success" id="analyze-generators-btn">
                <i class="bi bi-lightning-charge me-2"></i>Generate My Personal Profile
            </button>
        </div>
    `;
    
    $container.html(ratingsHTML);
    
    // Make rating stars interactive
    $container.find('.rating-star').on('click', function() {
        const $star = $(this);
        const value = parseInt($star.data('value'));
        const $stars = $star.parent().find('.rating-star');
        
        // Set the rating value
        $star.parent().attr('data-rating', value);
        
        // Update the star appearances
        $stars.each(function() {
            const starValue = parseInt($(this).data('value'));
            if (starValue <= value) {
                $(this).removeClass('bi-star').addClass('bi-star-fill');
            } else {
                $(this).removeClass('bi-star-fill').addClass('bi-star');
            }
        });
        
        // Also update the parent item to show it's been rated
        $star.closest('.list-group-item').addClass('rated');
    });
    
    // Handle hover effect on stars
    $container.find('.rating-stars').each(function() {
        const $ratingGroup = $(this);
        const $stars = $ratingGroup.find('.rating-star');
        
        $stars.hover(
            function() { // Mouse enter
                const hoverValue = parseInt($(this).data('value'));
                $stars.each(function() {
                    const starValue = parseInt($(this).data('value'));
                    if (starValue <= hoverValue) {
                        $(this).addClass('hover');
                    }
                });
            },
            function() { // Mouse leave
                $stars.removeClass('hover');
            }
        );
    });
    
    // Handle custom activity addition
    $('#add-custom-activity-btn').on('click', function() {
        const activityName = $('#custom-activity-name').val().trim();
        const category = $('#custom-activity-category').val();
        
        if (activityName) {
            const activityId = activityName.toLowerCase().replace(/\s+/g, '-');
            
            // Find the appropriate category section
            const $categorySection = $container.find(`.category-title i.bi-${getCategoryIcon(category)}`).closest('.generator-category').find('.list-group');
            
            // Add the new activity item
            const $newActivity = $(`
                <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" data-activity-id="${activityId}" data-category="${category}">
                    <div class="activity-label">${activityName}</div>
                    <div class="rating-stars" data-rating="0">
                        <i class="bi bi-star rating-star" data-value="1"></i>
                        <i class="bi bi-star rating-star" data-value="2"></i>
                        <i class="bi bi-star rating-star" data-value="3"></i>
                        <i class="bi bi-star rating-star" data-value="4"></i>
                        <i class="bi bi-star rating-star" data-value="5"></i>
                    </div>
                </div>
            `);
            
            $categorySection.append($newActivity);
            
            // Add event handlers to new stars
            $newActivity.find('.rating-star').on('click', function() {
                const $star = $(this);
                const value = parseInt($star.data('value'));
                const $stars = $star.parent().find('.rating-star');
                
                $star.parent().attr('data-rating', value);
                
                $stars.each(function() {
                    const starValue = parseInt($(this).data('value'));
                    if (starValue <= value) {
                        $(this).removeClass('bi-star').addClass('bi-star-fill');
                    } else {
                        $(this).removeClass('bi-star-fill').addClass('bi-star');
                    }
                });
                
                $star.closest('.list-group-item').addClass('rated');
            });
            
            // Add hover handlers
            const $stars = $newActivity.find('.rating-star');
            $stars.hover(
                function() {
                    const hoverValue = parseInt($(this).data('value'));
                    $stars.each(function() {
                        const starValue = parseInt($(this).data('value'));
                        if (starValue <= hoverValue) {
                            $(this).addClass('hover');
                        }
                    });
                },
                function() {
                    $stars.removeClass('hover');
                }
            );
            
            // Clear the input
            $('#custom-activity-name').val('');
        }
    });
    
    // Handle analyze button click
    $('#analyze-generators-btn').on('click', function() {
        analyzeGenerators($container);
    });
    
    // Helper function to format category names
    function formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
}

/**
 * Analyze the user's generator ratings and provide insights
 * @param {jQuery} $container - The generator ratings container
 */
function analyzeGenerators($container) {
    // Collect rated activities
    const ratedActivities = [];
    $container.find('.list-group-item.rated').each(function() {
        ratedActivities.push({
            id: $(this).data('activity-id'),
            category: $(this).data('category'),
            label: $(this).find('.activity-label').text(),
            rating: parseInt($(this).find('.rating-stars').attr('data-rating'))
        });
    });
    
    // Validate we have enough data
    if (ratedActivities.length < 3) {
        alert('Please rate at least 3 activities to generate your profile.');
        return;
    }
    
    // Group by category
    const activitiesByCategory = {};
    ratedActivities.forEach(activity => {
        if (!activitiesByCategory[activity.category]) {
            activitiesByCategory[activity.category] = [];
        }
        activitiesByCategory[activity.category].push(activity);
    });
    
    // Calculate average effectiveness by category
    const categoryEffectiveness = {};
    Object.keys(activitiesByCategory).forEach(category => {
        const activities = activitiesByCategory[category];
        const sum = activities.reduce((total, activity) => total + activity.rating, 0);
        categoryEffectiveness[category] = sum / activities.length;
    });
    
    // Find top activities
    ratedActivities.sort((a, b) => b.rating - a.rating);
    const topActivities = ratedActivities.filter(activity => activity.rating >= 4).slice(0, 5);
    
    // Generate recommendations based on ratings
    const recommendations = generateRecommendations(ratedActivities, categoryEffectiveness);
    
    // Display the results
    showGeneratorResults(topActivities, categoryEffectiveness, recommendations);
}

/**
 * Generate personalized recommendations based on user ratings
 * @param {Array} activities - Array of rated activities
 * @param {Object} categoryEffectiveness - Average effectiveness by category
 * @returns {Array} - List of recommendation objects
 */
function generateRecommendations(activities, categoryEffectiveness) {
    const recommendations = [];
    
    // Find strongest and weakest resource categories
    let strongestCategory = null;
    let weakestCategory = null;
    let highestScore = 0;
    let lowestScore = 5;
    
    Object.entries(categoryEffectiveness).forEach(([category, score]) => {
        if (score > highestScore) {
            highestScore = score;
            strongestCategory = category;
        }
        if (score < lowestScore) {
            lowestScore = score;
            weakestCategory = category;
        }
    });
    
    // Add category-based recommendations
    if (strongestCategory) {
        recommendations.push({
            title: `Leverage Your ${formatCategoryName(strongestCategory)} Generators`,
            description: `Your strongest generators are in the ${formatCategoryName(strongestCategory)} category. These activities reliably produce mental resources for you.`,
            suggestions: [
                `Schedule ${formatCategoryName(strongestCategory)} generating activities before challenging tasks`,
                `Create a "${formatCategoryName(strongestCategory)} generator emergency kit" for when you're depleted`,
                `Look for ways to combine these activities with other responsibilities`
            ]
        });
    }
    
    if (weakestCategory) {
        recommendations.push({
            title: `Explore Alternative ${formatCategoryName(weakestCategory)} Generators`,
            description: `Your current ${formatCategoryName(weakestCategory)} generators aren't as effective for you personally. This presents an opportunity.`,
            suggestions: [
                `Experiment with different types of ${formatCategoryName(weakestCategory)} generators not on your list`,
                `Try modifying your approach to these activities (duration, timing, environment)`,
                `Consider whether you need to supplement with external resources in this area`
            ]
        });
    }
    
    // Find balance in the user's generator portfolio
    const categories = Object.keys(categoryEffectiveness);
    const hasAllCategories = ['attention', 'energy', 'willpower', 'creativity'].every(cat => categories.includes(cat));
    
    if (!hasAllCategories) {
        recommendations.push({
            title: 'Diversify Your Generator Portfolio',
            description: 'A balanced mental system requires multiple types of resource generators.',
            suggestions: [
                'Experiment with activities in your less-represented categories',
                'Look for activities that generate multiple resource types simultaneously',
                'Create a weekly schedule that includes at least one generator from each category'
            ]
        });
    }
    
    // Add timing and consistency recommendations
    recommendations.push({
        title: 'Optimize Your Generator Timing',
        description: 'When you use your generators is as important as which ones you use.',
        suggestions: [
            'Use "attention" generators before focused work periods',
            'Schedule "energy" generators when you typically experience dips',
            'Deploy "willpower" generators before making important decisions',
            'Make space for "creativity" generators when innovation is needed'
        ]
    });
    
    return recommendations;
}

/**
 * Display generator analysis results
 * @param {Array} topActivities - Top-rated activities
 * @param {Object} categoryEffectiveness - Average effectiveness by category
 * @param {Array} recommendations - Personalized recommendations
 */
function showGeneratorResults(topActivities, categoryEffectiveness, recommendations) {
    // Find or create results container
    let $resultsContainer = $('#generator-results');
    if (!$resultsContainer.length) {
        $resultsContainer = $('<div id="generator-results" class="mt-5"></div>');
        $('#generator-ratings').after($resultsContainer);
    }
    
    // Clear previous content
    $resultsContainer.empty();
    
    // Create results HTML
    let resultsHTML = `
        <h5 class="mb-3">Your Personal Generator Profile</h5>
        
        <div class="card mb-4">
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0">Your Top Resource Generators</h6>
            </div>
            <div class="card-body">
                <p>These activities are most effective at generating mental resources for you:</p>
                <div class="list-group">
    `;
    
    // Add top activities
    if (topActivities.length > 0) {
        topActivities.forEach(activity => {
            resultsHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <i class="bi bi-${getCategoryIcon(activity.category)} me-2"></i>
                        ${activity.label}
                    </div>
                    <div>
                        <span class="badge bg-primary rounded-pill">${activity.rating}/5</span>
                    </div>
                </div>
            `;
        });
    } else {
        resultsHTML += `<div class="text-center text-muted p-3">No highly-rated activities found</div>`;
    }
    
    resultsHTML += `
                </div>
            </div>
        </div>
        
        <div class="card mb-4">
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0">Resource Category Effectiveness</h6>
            </div>
            <div class="card-body">
                <p>How effective different types of generators are for you:</p>
                <div class="row">
    `;
    
    // Add category effectiveness chart
    Object.entries(categoryEffectiveness).forEach(([category, score]) => {
        const percent = Math.round(score * 20); // Convert 5-point scale to percentage
        
        resultsHTML += `
            <div class="col-md-6 mb-3">
                <div>
                    <div class="d-flex justify-content-between mb-1">
                        <div>
                            <i class="bi bi-${getCategoryIcon(category)} me-1"></i>
                            ${formatCategoryName(category)}
                        </div>
                        <div>${score.toFixed(1)}/5</div>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-${getCategoryColor(category)}" 
                             role="progressbar" 
                             style="width: ${percent}%" 
                             aria-valuenow="${percent}" 
                             aria-valuemin="0" 
                             aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsHTML += `
                </div>
            </div>
        </div>
        
        <div class="card mb-4">
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0">Personalized Recommendations</h6>
            </div>
            <div class="card-body">
                <p>Based on your ratings, here are strategies to optimize your generator system:</p>
                <div class="accordion" id="recommendationsAccordion">
    `;
    
    // Add recommendations accordion
    recommendations.forEach((recommendation, index) => {
        resultsHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button ${index > 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                        ${recommendation.title}
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${index}" data-bs-parent="#recommendationsAccordion">
                    <div class="accordion-body">
                        <p>${recommendation.description}</p>
                        <ul>
                            ${recommendation.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsHTML += `
                </div>
            </div>
        </div>
        
        <div class="mt-4 text-center">
            <button class="btn btn-success" id="save-generator-profile-btn">
                <i class="bi bi-save me-2"></i>Save To My Mental Architecture Plan
            </button>
        </div>
    `;
    
    // Add results to page
    $resultsContainer.html(resultsHTML);
    
    // Handle save button
    $('#save-generator-profile-btn').on('click', function() {
        const savedProfile = {
            topActivities: topActivities,
            categoryEffectiveness: categoryEffectiveness,
            recommendations: recommendations,
            date: new Date().toISOString()
        };
        
        localStorage.setItem('generator-profile', JSON.stringify(savedProfile));
        alert('Your generator profile has been saved!');
    });
    
    // Scroll to results
    $('html, body').animate({
        scrollTop: $resultsContainer.offset().top - 100
    }, 500);
    
    // Helper function to get color for a category
    function getCategoryColor(category) {
        const colorMap = {
            attention: 'info',
            energy: 'warning',
            willpower: 'danger',
            creativity: 'success'
        };
        
        return colorMap[category] || 'primary';
    }
}

/**
 * Set up the custom generator design interface
 * @param {string} selector - CSS selector for the custom generator builder container
 */
function setupCustomGenerators(selector) {
    const $container = $(selector);
    if (!$container.length) return;
    
    // Create the interface
    $container.html(`
        <h5 class="mb-3">Design Your Custom Resource Generator</h5>
        <p>Create a tailored mental resource generator that fits your unique needs and preferences.</p>
        
        <div class="card mb-4">
            <div class="card-body">
                <form id="custom-generator-form">
                    <div class="mb-3">
                        <label for="generator-name" class="form-label">Generator Name</label>
                        <input type="text" class="form-control" id="generator-name" placeholder="Name your generator">
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="generator-category" class="form-label">Primary Resource Type</label>
                            <select class="form-select" id="generator-category">
                                <option value="attention">Attention</option>
                                <option value="energy">Energy</option>
                                <option value="willpower">Willpower</option>
                                <option value="creativity">Creativity</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="generator-duration" class="form-label">Duration (minutes)</label>
                            <input type="number" class="form-control" id="generator-duration" min="5" value="15">
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Generator Components</label>
                        <div class="components-list">
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" value="physical" id="component-physical">
                                <label class="form-check-label" for="component-physical">
                                    Physical movement or exercise
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" value="mental" id="component-mental">
                                <label class="form-check-label" for="component-mental">
                                    Mental engagement or challenge
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" value="social" id="component-social">
                                <label class="form-check-label" for="component-social">
                                    Social connection or interaction
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" value="nature" id="component-nature">
                                <label class="form-check-label" for="component-nature">
                                    Connection with nature
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" value="creative" id="component-creative">
                                <label class="form-check-label" for="component-creative">
                                    Creative expression
                                </label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" value="rest" id="component-rest">
                                <label class="form-check-label" for="component-rest">
                                    Rest or relaxation
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="generator-description" class="form-label">Description</label>
                        <textarea class="form-control" id="generator-description" rows="3" placeholder="Describe how this generator works and what makes it effective for you"></textarea>
                    </div>
                    
                    <div class="mb-3">
                        <label for="generator-triggers" class="form-label">When to Use</label>
                        <input type="text" class="form-control" id="generator-triggers" placeholder="When would you use this generator? (e.g., 'When feeling mentally foggy')">
                    </div>
                    
                    <div class="text-center">
                        <button type="button" class="btn btn-primary" id="preview-generator-btn">
                            <i class="bi bi-eye me-2"></i>Preview Generator
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div id="generator-preview" style="display: none;">
            <!-- Preview will be shown here -->
        </div>
    `);
    
    // Handle preview button click
    $('#preview-generator-btn').on('click', function() {
        const name = $('#generator-name').val().trim();
        const category = $('#generator-category').val();
        const duration = $('#generator-duration').val();
        const description = $('#generator-description').val().trim();
        const triggers = $('#generator-triggers').val().trim();
        
        // Collect selected components
        const components = [];
        $('.components-list input:checked').each(function() {
            components.push($(this).val());
        });
        
        // Validate form
        if (!name) {
            alert('Please give your generator a name.');
            $('#generator-name').focus();
            return;
        }
        
        if (components.length === 0) {
            alert('Please select at least one component for your generator.');
            return;
        }
        
        // Generate preview
        showGeneratorPreview(name, category, duration, components, description, triggers);
    });
}

/**
 * Show a preview of the custom generator
 * @param {string} name - Generator name
 * @param {string} category - Primary resource type
 * @param {number} duration - Duration in minutes
 * @param {Array} components - Selected components
 * @param {string} description - Generator description
 * @param {string} triggers - When to use the generator
 */
function showGeneratorPreview(name, category, duration, components, description, triggers) {
    const $previewContainer = $('#generator-preview');
    
    // Format components nicely
    const componentLabels = {
        physical: 'Physical activity',
        mental: 'Mental engagement',
        social: 'Social connection',
        nature: 'Nature connection',
        creative: 'Creative expression',
        rest: 'Rest/relaxation'
    };
    
    const formattedComponents = components.map(comp => componentLabels[comp] || comp).join(', ');
    
    // Generate effectiveness estimation based on number of components and diversity
    let effectiveness = Math.min(Math.ceil(components.length * 1.2), 5);
    
    // Create preview HTML
    const previewHTML = `
        <div class="card border-${getCategoryColor(category)} mb-4">
            <div class="card-header bg-${getCategoryColor(category)} ${['danger', 'primary', 'dark'].includes(getCategoryColor(category)) ? 'text-white' : ''}">
                <h5 class="mb-0">${name}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <p>${description || 'A custom generator designed specifically for your mental architecture.'}</p>
                        
                        <h6 class="mt-3">Details:</h6>
                        <ul>
                            <li><strong>Primary Resource:</strong> ${formatCategoryName(category)}</li>
                            <li><strong>Duration:</strong> ${duration} minutes</li>
                            <li><strong>Components:</strong> ${formattedComponents}</li>
                            ${triggers ? `<li><strong>When to use:</strong> ${triggers}</li>` : ''}
                        </ul>
                    </div>
                    <div class="col-md-4 text-center">
                        <div class="generator-effectiveness mb-2">
                            <h6>Estimated Effectiveness:</h6>
                            <div class="stars fs-4">
                                ${getStarRating(effectiveness)}
                            </div>
                        </div>
                        <div class="resource-icon mt-3">
                            <i class="bi bi-${getCategoryIcon(category)}" style="font-size: 2.5rem; color: var(--bs-${getCategoryColor(category)});"></i>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-4">
                    <button class="btn btn-outline-secondary me-2" id="edit-generator-btn">
                        <i class="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button class="btn btn-success" id="save-custom-generator-btn">
                        <i class="bi bi-journal-plus me-1"></i>Add to My Generators
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Show the preview
    $previewContainer.html(previewHTML).slideDown(300);
    
    // Scroll to preview
    $('html, body').animate({
        scrollTop: $previewContainer.offset().top - 100
    }, 500);
    
    // Handle edit button
    $('#edit-generator-btn').on('click', function() {
        $previewContainer.slideUp(300);
    });
    
    // Handle save button
    $('#save-custom-generator-btn').on('click', function() {
        // Create generator object
        const generator = {
            name: name,
            category: category,
            duration: duration,
            components: components,
            description: description,
            triggers: triggers,
            effectiveness: effectiveness,
            date: new Date().toISOString()
        };
        
        // Save to localStorage
        const savedGenerators = JSON.parse(localStorage.getItem('custom-generators') || '[]');
        savedGenerators.push(generator);
        localStorage.setItem('custom-generators', JSON.stringify(savedGenerators));
        
        // Show success message
        $previewContainer.append(`
            <div class="alert alert-success mt-3">
                <i class="bi bi-check-circle me-2"></i>
                <strong>Success!</strong> Your custom generator has been added to your collection.
            </div>
        `);
    });
    
    // Helper function for star rating
    function getStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill"></i> ';
            } else {
                stars += '<i class="bi bi-star"></i> ';
            }
        }
        return stars;
    }
}
