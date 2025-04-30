/**
 * Module 3.3 - From Map to Action
 * JavaScript for interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations and interactive elements
    initAnimations();
    initActionPlanBuilder();
    initResourceAllocation();
    initTimelineAnimation();
    initImplementationRehearsal();
    initFinalMapInteraction();
    initCTASection();
    initResourceButtons();
});

/**
 * Initialize animations for various elements
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
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-right');
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
 * Initialize the Action Plan Builder functionality
 */
function initActionPlanBuilder() {
    const startActionPlanBtn = document.getElementById('startActionPlanBtn');
    const actionPlanSection = document.getElementById('action-plan-section');
    const customizeStepBtns = document.querySelectorAll('[data-action="customize-step"]');
    
    if (startActionPlanBtn && actionPlanSection) {
        startActionPlanBtn.addEventListener('click', function() {
            // Smooth scroll to the action plan section
            actionPlanSection.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight the section briefly
            actionPlanSection.classList.add('highlight-section');
            setTimeout(() => {
                actionPlanSection.classList.remove('highlight-section');
            }, 1500);
        });
    }
    
    // Add event listeners for customization buttons
    customizeStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const stepNumber = this.dataset.step;
            showCustomizationModal(stepNumber);
        });
    });
    
    // Function to show customization modal (simulated)
    function showCustomizationModal(stepNumber) {
        alert(`This would open a modal to customize Step ${stepNumber} for your specific mental architecture.\n\nIn the full application, you would be able to add, edit, or remove specific interventions based on your unique blueprint.`);
    }
}

/**
 * Initialize the Resource Allocation visualization
 */
function initResourceAllocation() {
    const customizeAllocationBtn = document.getElementById('customizeAllocationBtn');
    const resourceFills = document.querySelectorAll('.resource-fill');
    
    if (customizeAllocationBtn) {
        customizeAllocationBtn.addEventListener('click', function() {
            showResourceAllocationModal();
        });
    }
    
    // Animate resource meters when they come into view
    if (resourceFills.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger width animation by briefly setting to 0 then to the target width
                    const targetWidth = entry.target.style.width;
                    entry.target.style.width = '0%';
                    
                    setTimeout(() => {
                        entry.target.style.width = targetWidth;
                    }, 50);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        resourceFills.forEach(fill => {
            observer.observe(fill);
        });
    }
    
    // Function to show resource allocation customization modal (simulated)
    function showResourceAllocationModal() {
        alert('This would open a modal to customize your resource allocation based on your specific mental architecture and priorities.\n\nYou would be able to adjust the percentages for each category to fit your implementation strategy.');
    }
}

/**
 * Initialize the Timeline animation
 */
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add class with a delay based on position
                    const index = Array.from(timelineItems).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('item-visible');
                    }, index * 300); // Stagger the animations
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
}

/**
 * Initialize the Implementation Rehearsal interactive experience
 */
function initImplementationRehearsal() {
    const scenarioCards = document.querySelectorAll('.scenario-card');
    const choiceOptions = document.querySelectorAll('.choice-option');
    const rehearsalOutcome = document.getElementById('rehearsalOutcome');
    
    // Scenario selection
    scenarioCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            scenarioCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
            
            // In a full implementation, this would update the rehearsal content
            // For this demo, we'll just show a notification
            const scenario = this.dataset.scenario;
            alert(`In the full application, this would load the specific mental rehearsal for the "${scenario}" scenario.\n\nYou would see a guided visualization specific to implementing changes in this area of your mental architecture.`);
        });
    });
    
    // Choice selection
    if (choiceOptions.length > 0 && rehearsalOutcome) {
        choiceOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove any existing active classes
                choiceOptions.forEach(o => o.classList.remove('active'));
                // Add active class to clicked option
                this.classList.add('active');
                
                // Show outcome based on selection
                const outcome = this.dataset.outcome;
                rehearsalOutcome.classList.remove('d-none');
                
                // Different content based on selected outcome
                let outcomeContent = '';
                switch(outcome) {
                    case 'flexible':
                        outcomeContent = `
                            <div class="alert alert-success">
                                <h5><i class="bi bi-check-circle-fill me-2"></i>Flexible Adaptation Selected</h5>
                                <p>This demonstrates ecological intelligence—you're able to modify your approach without abandoning your goals.</p>
                                <p>When implementing mental architecture changes, flexibility is crucial because it:</p>
                                <ul>
                                    <li>Prevents the all-or-nothing thinking that often derails change efforts</li>
                                    <li>Allows your system to learn the minimal viable implementation</li>
                                    <li>Creates sustainable patterns that can survive fluctuations in resources</li>
                                </ul>
                            </div>
                        `;
                        break;
                    case 'motivational':
                        outcomeContent = `
                            <div class="alert alert-success">
                                <h5><i class="bi bi-check-circle-fill me-2"></i>Motivational Reconnection Selected</h5>
                                <p>This demonstrates reflective intelligence—you're addressing the deeper motivation rather than just the behavior.</p>
                                <p>Reconnecting with purpose is powerful because it:</p>
                                <ul>
                                    <li>Addresses the root cause of resistance rather than the symptom</li>
                                    <li>Reinforces the original intention behind the architecture change</li>
                                    <li>Strengthens the self-regulatory feedback loop in your system</li>
                                </ul>
                            </div>
                        `;
                        break;
                    case 'consistency':
                        outcomeContent = `
                            <div class="alert alert-warning">
                                <h5><i class="bi bi-exclamation-triangle-fill me-2"></i>Consistency Focus Selected</h5>
                                <p>This demonstrates determination, but be careful—forcing consistency without addressing resistance often creates backlash in complex systems like your mind.</p>
                                <p>Consider combining this with:</p>
                                <ul>
                                    <li>A temporary reduction in scope to make consistency more manageable</li>
                                    <li>Adding a feedback mechanism to better understand the source of resistance</li>
                                    <li>Creating a more sustainable implementation rhythm</li>
                                </ul>
                            </div>
                        `;
                        break;
                }
                
                rehearsalOutcome.innerHTML = outcomeContent;
            });
        });
    }
}

/**
 * Initialize the Final Map Interaction panel
 */
function initFinalMapInteraction() {
    const mapLayerToggles = document.querySelectorAll('.map-layer-toggle');
    const mapContainer = document.querySelector('.final-map-container .sora-image-container');
    
    if (mapLayerToggles.length > 0 && mapContainer) {
        // Track current active layer
        let activeLayer = 'complete';
        
        mapLayerToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const layer = this.dataset.layer;
                
                // Remove active state from all toggles
                mapLayerToggles.forEach(t => t.classList.remove('active'));
                // Add active state to clicked toggle
                this.classList.add('active');
                
                // Update map visualization (in a full implementation)
                // For this demo, we'll just update the icon in the placeholder
                updateMapVisualization(layer);
                
                // Update active layer
                activeLayer = layer;
            });
        });
        
        // Function to update map visualization
        function updateMapVisualization(layer) {
            // Placeholder icon based on layer
            const icon = mapContainer.querySelector('.placeholder-icon');
            if (icon) {
                // Change icon based on selected layer
                switch(layer) {
                    case 'components':
                        icon.className = 'bi bi-grid-3x3 placeholder-icon';
                        break;
                    case 'flows':
                        icon.className = 'bi bi-arrow-left-right placeholder-icon';
                        break;
                    case 'cycles':
                        icon.className = 'bi bi-arrow-repeat placeholder-icon';
                        break;
                    case 'leverage':
                        icon.className = 'bi bi-lightning-charge placeholder-icon';
                        break;
                    case 'actions':
                        icon.className = 'bi bi-check2-square placeholder-icon';
                        break;
                    case 'complete':
                    default:
                        icon.className = 'bi bi-map placeholder-icon';
                        break;
                }
                
                // Add a pulse animation
                icon.classList.add('pulse-animation');
                setTimeout(() => {
                    icon.classList.remove('pulse-animation');
                }, 500);
            }
            
            // In a complete implementation, this would switch between different
            // visualizations or layers of the mental architecture map
        }
    }
}

/**
 * Initialize the Call to Action section
 */
function initCTASection() {
    const downloadBtn = document.getElementById('downloadBlueprintBtn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('In the full application, this would generate and download a personalized PDF of your complete mental architecture blueprint with all components, flows, and your customized action plan.\n\nThis would give you a reference document to guide your implementation process.');
        });
    }
}

/**
 * Initialize resource access buttons in the Next Steps section
 */
function initResourceButtons() {
    const resourceButtons = [
        document.getElementById('viewWorksheetsBtn'),
        document.getElementById('viewGuideBtn'),
        document.getElementById('viewLibraryBtn'),
        document.getElementById('joinCommunityBtn')
    ];
    
    resourceButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                const resourceId = this.id;
                let resourceMessage = '';
                
                switch(resourceId) {
                    case 'viewWorksheetsBtn':
                        resourceMessage = 'This would provide access to downloadable weekly worksheets for ongoing mental architecture mapping and optimization.\n\nThese structured templates would help you continue refining your mental blueprint.';
                        break;
                    case 'viewGuideBtn':
                        resourceMessage = 'This would provide access to the detailed implementation guide with step-by-step protocols for each type of mental architecture intervention.\n\nThe guide would include instructions, examples, and troubleshooting tips.';
                        break;
                    case 'viewLibraryBtn':
                        resourceMessage = 'This would open the resource library with expanded explanations of key concepts, techniques, and theoretical foundations.\n\nThe library would include articles, research references, and additional learning resources.';
                        break;
                    case 'joinCommunityBtn':
                        resourceMessage = 'This would connect you with the community of fellow consciousness engineers.\n\nYou would gain access to discussion forums, implementation support, and opportunities to share insights and experiences.';
                        break;
                }
                
                alert(resourceMessage);
            });
        }
    });
}
