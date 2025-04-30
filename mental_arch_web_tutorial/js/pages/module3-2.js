/**
 * Module 3.2 - High-Leverage Points and Optimization
 * JavaScript for interactive elements
 */

// Initialize once DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initLeverageCalculator();
    initLeveragePointIdentifier();
    initResourceBalanceSheet();
    animateSoraPlaceholders();
    initProgressTracking();
});

/**
 * Animation for SORA placeholder elements
 */
function animateSoraPlaceholders() {
    const placeholders = document.querySelectorAll('.sora-image-container');
    
    placeholders.forEach(placeholder => {
        const delay = placeholder.dataset.delay || 0;
        placeholder.style.setProperty('--delay', delay + 's');
    });
}

/**
 * Initialize the system leverage calculator
 */
function initLeverageCalculator() {
    const calculateBtn = document.getElementById('calculateLeverage');
    const leverageSelect = document.getElementById('leverageTypeSelect');
    const impactMeter = document.getElementById('impactMeter');
    const resultDiv = document.getElementById('leverageImpactResult');
    
    if (!calculateBtn) return;
    
    // Mapping leverage types to impact percentages and descriptions
    const leverageData = {
        parameters: {
            impact: 10,
            description: 'Changing constants and parameters typically has minimal leverage. For example, trying to manage your mood by simply doing more of an activity you enjoy might help, but won't address root causes.'
        },
        buffers: {
            impact: 20,
            description: 'Adjusting buffer sizes (like sleep reserves or energy management) creates some impact, but is still relatively low leverage compared to deeper system changes.'
        },
        structure: {
            impact: 30,
            description: 'Modifying system structure by changing how mental resources connect can create moderate impact. This might include reorganizing your work environment or information flows.'
        },
        delays: {
            impact: 40,
            description: 'Addressing delays in your system's response time can be surprisingly effective. For example, reducing the lag between an intention and action, or shortening feedback loops.'
        },
        balancing: {
            impact: 50,
            description: 'Adding or strengthening balancing feedback loops helps stabilize your mental system. These could include reflection practices or accountability structures.'
        },
        reinforcing: {
            impact: 60,
            description: 'Targeting reinforcing feedback loops helps amplify desired outcomes. This could include habit stacking or creating virtuous cycles of improvement.'
        },
        information: {
            impact: 70,
            description: 'Changing information flows can transform system behavior. This involves modifying what you pay attention to and how information reaches different parts of your mental architecture.'
        },
        rules: {
            impact: 75,
            description: 'Changing the rules that govern your mental system has significant impact. This includes modifying your decision criteria or personal policies.'
        },
        organization: {
            impact: 80,
            description: 'Enhancing your system's capacity for self-organization is powerful. This might involve developing metacognition or creating conditions for mental flexibility.'
        },
        goals: {
            impact: 85,
            description: 'Shifting your system's goals is one of the highest-leverage interventions. Changing what your mental architecture is optimizing for transforms everything downstream.'
        },
        paradigms: {
            impact: 95,
            description: 'Changing your paradigms or mental models produces massive effects throughout your system. This involves fundamentally shifting how you perceive and interpret reality.'
        },
        transcending: {
            impact: 100,
            description: 'The highest leverage comes from transcending paradigms altogether—developing the flexibility to move between different mental models as needed rather than being fixed in any single framework.'
        }
    };
    
    calculateBtn.addEventListener('click', function() {
        const selectedLeverage = leverageSelect.value;
        const data = leverageData[selectedLeverage];
        
        if (data) {
            // Update impact meter with animation
            impactMeter.style.width = data.impact + '%';
            
            // Update color based on impact level
            if (data.impact < 40) {
                impactMeter.className = 'progress-bar bg-info';
            } else if (data.impact < 70) {
                impactMeter.className = 'progress-bar bg-warning';
            } else {
                impactMeter.className = 'progress-bar bg-success';
            }
            
            // Display impact description
            resultDiv.innerHTML = `
                <h6>Impact Level: ${data.impact}%</h6>
                <p>${data.description}</p>
                <div class="alert alert-primary mt-2">
                    <i class="bi bi-lightbulb me-2"></i>
                    <strong>Application:</strong> Think about how this type of intervention could address challenges in your mental resource map.
                </div>
            `;
        }
    });
}

/**
 * Initialize the personal leverage point identifier
 */
function initLeveragePointIdentifier() {
    const analyzeFlowBtn = document.getElementById('analyzeFlowBtn');
    const analyzeStructureBtn = document.getElementById('analyzeStructureBtn');
    const analyzeCycleBtn = document.getElementById('analyzeCycleBtn');
    const resultsDiv = document.getElementById('leveragePointResults');
    
    if (!analyzeFlowBtn || !analyzeStructureBtn || !analyzeCycleBtn) return;
    
    // Flow analysis responses
    const flowAnalysisData = {
        attention: {
            title: 'Attention Flow Analysis',
            insights: [
                'Your attention is diverted by digital distractions, creating a significant bottleneck',
                'Task-switching creates high attention costs with minimal returns',
                'Deep work sessions amplify your attention resources significantly'
            ]
        },
        energy: {
            title: 'Energy Flow Analysis',
            insights: [
                'Morning routines create an energy amplifier effect',
                'Afternoon energy dips could be redirected to low-demand but valuable tasks',
                'Social interactions with certain individuals create energy drains'
            ]
        },
        willpower: {
            title: 'Willpower Flow Analysis',
            insights: [
                'Decision fatigue creates a willpower bottleneck in late afternoons',
                'Environmental design can reduce willpower demands',
                'Implementation intentions serve as willpower amplifiers'
            ]
        },
        creativity: {
            title: 'Creativity Flow Analysis',
            insights: [
                'Input variety (reading, experiences) serves as a creativity amplifier',
                'Critical self-judgment creates a creativity bottleneck',
                'Walking and movement appear to release creative blocks'
            ]
        }
    };
    
    // Structural analysis responses
    const structuralAnalysisData = {
        nodes: {
            title: 'Central Nodes Analysis',
            insights: [
                'Your "self-talk" mental process acts as a highly central node',
                'Your morning routine connects to multiple downstream processes',
                'Your information capture system influences many mental resources'
            ]
        },
        bridges: {
            title: 'Bridge Components Analysis',
            insights: [
                'Journaling bridges your emotional and analytical mental regions',
                'Mind-body practices connect your conscious and subconscious processes',
                'Your planning system bridges intentions and actions'
            ]
        },
        redundancies: {
            title: 'Redundancies Analysis',
            insights: [
                'Multiple worry processes perform similar functions',
                'Overlapping planning systems create confusion',
                'Duplicate information storage creates maintenance costs'
            ]
        },
        gaps: {
            title: 'Structural Gaps Analysis',
            insights: [
                'Lack of connection between goal-setting and daily actions',
                'Insufficient structure between learning and application',
                'Missing feedback loops for personal development'
            ]
        }
    };
    
    // Cycle analysis responses
    const cycleAnalysisData = {
        reinforcing: {
            title: 'Self-reinforcing Loops Analysis',
            insights: [
                'Anxiety → avoidance → increased anxiety cycle',
                'Learning → confidence → more learning cycle',
                'Productivity → satisfaction → motivation → more productivity cycle'
            ]
        },
        balancing: {
            title: 'Balancing Loops with Delays',
            insights: [
                'Rest → recovery → performance → fatigue → rest cycle',
                'Exploration → skill development → exploitation → diminishing returns → exploration',
                'Focus → accomplishment → relaxation → renewed focus'
            ]
        },
        competing: {
            title: 'Competing Loops Analysis',
            insights: [
                'Short-term pleasure seeking vs. long-term goal pursuit',
                'Need for novelty vs. need for consistency',
                'Self-improvement vs. self-acceptance'
            ]
        },
        unrecognized: {
            title: 'Unrecognized Loops Analysis',
            insights: [
                'Subtle comparison → self-criticism → compensation loop',
                'Information consumption → overwhelm → seeking more information',
                'Perfectionism → procrastination → time pressure → cutting corners'
            ]
        }
    };
    
    // Event handlers for analysis buttons
    analyzeFlowBtn.addEventListener('click', function() {
        const selectedFlow = document.getElementById('flowSelect').value;
        const data = flowAnalysisData[selectedFlow];
        
        if (data) {
            displayAnalysisResults(data.title, data.insights);
        }
    });
    
    analyzeStructureBtn.addEventListener('click', function() {
        const selectedStructure = document.getElementById('structureSelect').value;
        const data = structuralAnalysisData[selectedStructure];
        
        if (data) {
            displayAnalysisResults(data.title, data.insights);
        }
    });
    
    analyzeCycleBtn.addEventListener('click', function() {
        const selectedCycle = document.getElementById('cycleSelect').value;
        const data = cycleAnalysisData[selectedCycle];
        
        if (data) {
            displayAnalysisResults(data.title, data.insights);
        }
    });
    
    // Helper function to display analysis results
    function displayAnalysisResults(title, insights) {
        let insightsList = '';
        insights.forEach(insight => {
            insightsList += `<li class="mb-2">${insight}</li>`;
        });
        
        resultsDiv.innerHTML = `
            <div class="analysis-result-card p-3 border rounded mb-3">
                <h5>${title}</h5>
                <ul class="mt-3">
                    ${insightsList}
                </ul>
                <div class="mt-3">
                    <button type="button" class="btn btn-sm btn-outline-primary" id="saveInsightBtn">
                        <i class="bi bi-bookmark-plus me-1"></i> Save to Insights
                    </button>
                </div>
            </div>
            <div class="sora-image-container fade-in-up" data-delay="0.3">
                <div class="sora-placeholder">
                    <i class="bi bi-graph-up-arrow placeholder-icon"></i>
                </div>
                <div class="sora-caption">
                    <h4>Analysis Visualization</h4>
                    <p>Diagram showing how different analysis types reveal different types of leverage points</p>
                </div>
            </div>
        `;
        
        // Add event listener for the save insight button
        document.getElementById('saveInsightBtn').addEventListener('click', function() {
            alert('Insight saved to your personal blueprint!');
        });
    }
}

/**
 * Initialize the resource balance sheet
 */
function initResourceBalanceSheet() {
    // This would typically load user data and populate the balance sheet
    // For demo purposes, we just have static data visualized
    
    // For a real implementation, we would add event listeners to tabs
    // and populate data based on user inputs or saved data
    
    const energyTab = document.getElementById('energy-tab');
    const willpowerTab = document.getElementById('willpower-tab');
    
    if (!energyTab || !willpowerTab) return;
    
    // Add event listeners to tabs to update content when clicked
    energyTab.addEventListener('click', function() {
        document.getElementById('energy-balance').innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h5>Top Energy Consumers</h5>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Complex decision making</span>
                        <span class="badge bg-danger">High</span>
                    </div>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Emotional processing</span>
                        <span class="badge bg-danger">High</span>
                    </div>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Context switching</span>
                        <span class="badge bg-warning">Medium</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5>Top Energy Producers</h5>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Quality sleep</span>
                        <span class="badge bg-success">High</span>
                    </div>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Physical exercise</span>
                        <span class="badge bg-success">High</span>
                    </div>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Nutritious food</span>
                        <span class="badge bg-success">High</span>
                    </div>
                </div>
            </div>
            
            <div class="resource-balance-chart mt-4">
                <h5>Energy Balance</h5>
                <div class="progress" style="height: 25px;">
                    <div class="progress-bar bg-danger" role="progressbar" style="width: 55%" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100">55% Consumption</div>
                    <div class="progress-bar bg-success" role="progressbar" style="width: 45%" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">45% Production</div>
                </div>
                <div class="balance-analysis mt-2">
                    <p><strong>Net Position:</strong> <span class="text-danger">Deficit (-10%)</span></p>
                    <p>Your energy consumption slightly exceeds production, potentially leading to fatigue over time.</p>
                </div>
            </div>
        `;
    });
    
    willpowerTab.addEventListener('click', function() {
        document.getElementById('willpower-balance').innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h5>Top Willpower Consumers</h5>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Resisting temptations</span>
                        <span class="badge bg-danger">High</span>
                    </div>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Completing boring tasks</span>
                        <span class="badge bg-danger">High</span>
                    </div>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Task initiation</span>
                        <span class="badge bg-warning">Medium</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5>Top Willpower Producers</h5>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Implementation intentions</span>
                        <span class="badge bg-success">High</span>
                    </div>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Environmental design</span>
                        <span class="badge bg-success">High</span>
                    </div>
                    <div class="resource-item d-flex justify-content-between mb-2">
                        <span>Habit formation</span>
                        <span class="badge bg-success">High</span>
                    </div>
                </div>
            </div>
            
            <div class="resource-balance-chart mt-4">
                <h5>Willpower Balance</h5>
                <div class="progress" style="height: 25px;">
                    <div class="progress-bar bg-danger" role="progressbar" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">70% Consumption</div>
                    <div class="progress-bar bg-success" role="progressbar" style="width: 30%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">30% Production</div>
                </div>
                <div class="balance-analysis mt-2">
                    <p><strong>Net Position:</strong> <span class="text-danger">Deficit (-40%)</span></p>
                    <p>You're heavily depleting your willpower reserves. This creates a significant leverage opportunity through willpower-reducing interventions like habit building and environmental design.</p>
                </div>
            </div>
        `;
    });
}

/**
 * Initialize progress tracking for the module
 */
function initProgressTracking() {
    // Used to track user progress through the module
    let moduleProgress = {
        completedSections: [],
        insights: [],
        analysesRun: 0
    };
    
    // Saving progress on module exit
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('module3_2_progress', JSON.stringify(moduleProgress));
    });
    
    // Load any existing progress
    const savedProgress = localStorage.getItem('module3_2_progress');
    if (savedProgress) {
        moduleProgress = JSON.parse(savedProgress);
    }
}
