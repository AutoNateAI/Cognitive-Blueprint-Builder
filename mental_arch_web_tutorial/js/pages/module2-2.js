/**
 * Module 2.2: Resource Flows and Exchanges
 * JavaScript functionality for interactive elements
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initFlowPatterns();
    initExchangeSimulator();
    initFlowEfficiency();
    initHeatmap();
    initFlowStateDesigner();
    initSoraContainers();
    trackProgress();
    
    // Save data when module is completed
    const nextModuleBtn = document.querySelector('a[href="module2-3.html"]');
    if (nextModuleBtn) {
        nextModuleBtn.addEventListener('click', function(e) {
            // Save completion status
            if (window.dataManager) {
                window.dataManager.markModuleCompleted('module2-2');
                window.dataManager.saveData();
            }
        });
    }
});

/**
 * Initialize flow pattern visualizations
 */
function initFlowPatterns() {
    // Set up flow nodes and connections for visualization
    const flowContainer = document.getElementById('flowPatternVisualizer');
    if (!flowContainer) return;
    
    // This would normally set up interactive visualization
    // For now, we'll use the Sora placeholders
}

/**
 * Initialize exchange simulator functionality
 */
function initExchangeSimulator() {
    const calculateBtn = document.getElementById('calculateExchange');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', function() {
        const resourceSpend = document.getElementById('resourceSpend').value;
        const investmentAmount = document.getElementById('investmentAmount').value;
        const resourceAcquire = document.getElementById('resourceAcquire').value;
        const activityContext = document.getElementById('activityContext').value;
        
        calculateExchangeRate(resourceSpend, investmentAmount, resourceAcquire, activityContext);
    });
}

/**
 * Calculate and display exchange rate visualization
 */
function calculateExchangeRate(resourceSpend, investmentAmount, resourceAcquire, activityContext) {
    const visualization = document.getElementById('exchangeVisualization');
    if (!visualization) return;
    
    // Clear existing content
    visualization.innerHTML = '';
    
    // Create visualization elements
    const container = document.createElement('div');
    container.className = 'p-3 h-100';
    
    // ROI calculation (simplified for demo)
    let roi = 0;
    let roiClass = '';
    
    // Very basic simulation of different ROIs based on inputs
    if (resourceSpend === 'Attention' && resourceAcquire === 'Insight' && activityContext === 'Deep Work') {
        roi = 1.8; // High ROI
        roiClass = 'positive';
    } else if (resourceSpend === 'Willpower' && resourceAcquire === 'Habits') {
        roi = 2.0; // Very high ROI
        roiClass = 'positive';
    } else if (resourceSpend === 'Energy' && resourceAcquire === 'Emotional Support' && activityContext === 'Social Interaction') {
        roi = 1.5; // Good ROI
        roiClass = 'positive';
    } else if (resourceSpend === 'Attention' && resourceAcquire === 'Creativity' && activityContext === 'Social Interaction') {
        roi = 0.7; // Poor ROI
        roiClass = 'negative';
    } else {
        roi = 1.0; // Neutral
        roiClass = 'neutral';
    }
    
    // Adjust for investment amount
    roi = roi * (investmentAmount / 5);
    
    // Create results display
    const header = document.createElement('h5');
    header.className = 'mb-3';
    header.textContent = 'Exchange Rate Results';
    
    const resultBox = document.createElement('div');
    resultBox.className = `p-3 rounded ${roiClass === 'positive' ? 'bg-success' : roiClass === 'negative' ? 'bg-danger' : 'bg-warning'} bg-opacity-10`;
    
    const equation = document.createElement('div');
    equation.className = 'fs-5 mb-2';
    equation.innerHTML = `${investmentAmount} units of <strong>${resourceSpend}</strong> ➔ <strong>${(roi * investmentAmount).toFixed(1)}</strong> units of ${resourceAcquire}`;
    
    const roiText = document.createElement('div');
    roiText.className = `fw-bold ${roiClass === 'positive' ? 'text-success' : roiClass === 'negative' ? 'text-danger' : 'text-warning'}`;
    roiText.textContent = `ROI: ${roi.toFixed(1)}x ${roi > 1 ? '(Good investment)' : roi < 1 ? '(Poor investment)' : '(Break-even)'}`;
    
    const context = document.createElement('div');
    context.className = 'mt-3 small text-muted';
    context.textContent = `Context: ${activityContext}`;
    
    resultBox.appendChild(equation);
    resultBox.appendChild(roiText);
    resultBox.appendChild(context);
    
    container.appendChild(header);
    container.appendChild(resultBox);
    
    // Add a recommendation
    const recommendationDiv = document.createElement('div');
    recommendationDiv.className = 'mt-4';
    
    const recHeader = document.createElement('h6');
    recHeader.textContent = 'Recommendation:';
    
    const recText = document.createElement('p');
    if (roi > 1.5) {
        recText.textContent = 'This is a high-value exchange! Prioritize these activities for optimal resource utilization.';
    } else if (roi > 1) {
        recText.textContent = 'This is a positive exchange. Worth investing in when you have the resources available.';
    } else if (roi >= 0.8) {
        recText.textContent = 'This exchange is roughly break-even. Consider if there are better ways to invest your resources.';
    } else {
        recText.textContent = 'This appears to be an inefficient exchange. Look for better ways to utilize this resource.';
    }
    
    recommendationDiv.appendChild(recHeader);
    recommendationDiv.appendChild(recText);
    container.appendChild(recommendationDiv);
    
    visualization.appendChild(container);
}

/**
 * Initialize flow efficiency visualizations
 */
function initFlowEfficiency() {
    // Set up smooth and turbulent flow animations
    // For now, we're using the Sora placeholders
}

/**
 * Initialize heatmap visualization
 */
function initHeatmap() {
    // Set up heatmap visualization
    // For now, we're using the Sora placeholders
}

/**
 * Initialize flow state designer
 */
function initFlowStateDesigner() {
    const generateBtn = document.getElementById('generateFlowState');
    if (!generateBtn) return;
    
    generateBtn.addEventListener('click', function() {
        const activity = document.getElementById('flowStateActivity').value;
        const attention = document.getElementById('attentionAllocation').value;
        const energy = document.getElementById('energyAllocation').value;
        const willpower = document.getElementById('willpowerAllocation').value;
        const creativity = document.getElementById('creativityAllocation').value;
        
        generateFlowStateMap(activity, attention, energy, willpower, creativity);
    });
}

/**
 * Generate and display flow state map
 */
function generateFlowStateMap(activity, attention, energy, willpower, creativity) {
    const canvas = document.getElementById('flowStateCanvas');
    if (!canvas) return;
    
    // Clear existing content
    canvas.innerHTML = '';
    
    // Create flow state visualization
    const container = document.createElement('div');
    container.className = 'p-3 h-100';
    
    // Create header
    const header = document.createElement('h5');
    header.className = 'mb-3';
    header.textContent = `Flow State Map for ${activity}`;
    
    // Create resource allocation display
    const resourceAllocation = document.createElement('div');
    resourceAllocation.className = 'mb-4';
    
    const totalValue = parseInt(attention) + parseInt(energy) + parseInt(willpower) + parseInt(creativity);
    const totalMax = 40; // 10 max for each of the 4 resources
    const flowScore = Math.round((totalValue / totalMax) * 100);
    
    resourceAllocation.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span>Attention: ${attention}/10</span>
            <span>Energy: ${energy}/10</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <span>Willpower: ${willpower}/10</span>
            <span>Creativity: ${creativity}/10</span>
        </div>
        <div class="flow-score text-center p-2 rounded bg-primary bg-opacity-10 fw-bold">
            Flow Potential: ${flowScore}%
        </div>
    `;
    
    // Create flow state message
    const message = document.createElement('div');
    message.className = 'mt-4 p-3 rounded';
    
    // Customize message based on activity and resource allocation
    if (activity === 'Creative Work') {
        if (parseInt(creativity) > 7 && parseInt(attention) > 6) {
            message.className += ' bg-success bg-opacity-10';
            message.innerHTML = '<strong>Optimal allocation for creative work!</strong> High creativity with solid attention creates ideal conditions for flow.';
        } else if (parseInt(creativity) < 5) {
            message.className += ' bg-warning bg-opacity-10';
            message.innerHTML = '<strong>Consider boosting creativity allocation.</strong> Creative work typically demands higher creative resources.';
        }
    } else if (activity === 'Problem-Solving') {
        if (parseInt(attention) > 7 && parseInt(willpower) > 6) {
            message.className += ' bg-success bg-opacity-10';
            message.innerHTML = '<strong>Excellent problem-solving setup!</strong> The combination of focused attention and willpower creates ideal conditions.';
        } else if (parseInt(attention) < 6) {
            message.className += ' bg-warning bg-opacity-10';
            message.innerHTML = '<strong>Consider increasing attention allocation.</strong> Problem-solving requires sustained focus.';
        }
    }
    // Add other activity type conditions as needed
    
    container.appendChild(header);
    container.appendChild(resourceAllocation);
    container.appendChild(message);
    
    const diagram = document.createElement('div');
    diagram.className = 'mt-4 p-3 border rounded position-relative';
    diagram.style.height = '150px';
    diagram.innerHTML = '<small class="text-muted position-absolute top-50 start-50 translate-middle text-center">Flow state diagram based on your selected parameters<br>(Interactive diagram would appear here)</small>';
    
    container.appendChild(diagram);
    canvas.appendChild(container);
    
    // Save to data manager
    if (window.dataManager) {
        let flowStates = window.dataManager.getData('flowStates') || [];
        flowStates.push({
            activity,
            attention,
            energy,
            willpower,
            creativity,
            timestamp: new Date().toISOString()
        });
        window.dataManager.saveData('flowStates', flowStates);
    }
}

/**
 * Initialize Sora image containers
 */
function initSoraContainers() {
    const soraContainers = document.querySelectorAll('.sora-container');
    
    soraContainers.forEach(container => {
        // Add hover effect
        container.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        container.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        // Animation observer to trigger animation when scrolled into view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    container.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(container);
    });
}

/**
 * Track progress for the module
 */
function trackProgress() {
    // Update progress indicators
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        // Set to 45% for module 2.2 (5th module out of 9)
        const progressValue = 45; // This is set in the HTML already
        
        // Check if completed before
        if (window.dataManager && window.dataManager.isModuleCompleted('module2-2')) {
            // If already completed, mark as 100% for this module
            progressBar.style.width = '100%';
            progressBar.setAttribute('aria-valuenow', '100');
            progressText.textContent = '100% Complete';
        }
    }
}
