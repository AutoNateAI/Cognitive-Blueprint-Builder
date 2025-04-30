/**
 * Module 1.1 JavaScript
 * Handles functionality specific to the "Welcome to Mental Architecture" module
 */

$(document).ready(function() {
    // Load any saved responses when the page loads
    loadSavedResponses();
    
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
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    saveBtn.removeClass('saved');
                    saveBtn.html('Save Response');
                }, 1000);
            }
        }, 1000); // Wait 1 second after user stops typing
    });
    
    // Mark module as complete when bottom "Next" button is clicked
    $('.module-navigation .btn-primary').on('click', function() {
        DataManager.completeCurrentModule();
    });
    
    // Function to load saved responses from local storage
    function loadSavedResponses() {
        const responses = DataManager.getModuleResponses('module1-1');
        
        for (const [id, value] of Object.entries(responses)) {
            $(`#${id}`).val(value);
        }
    }
    
    // Display progress based on completed sections
    function updateModuleProgress() {
        const responses = DataManager.getModuleResponses('module1-1');
        const sectionCount = $('.response-area').length;
        let completedSections = 0;
        
        // Count non-empty responses
        for (const value of Object.values(responses)) {
            if (value && value.trim() !== '') {
                completedSections++;
            }
        }
        
        // Calculate and update progress
        if (sectionCount > 0) {
            const progress = Math.round((completedSections / sectionCount) * 100);
            $('.module-header .progress-bar').css('width', `${progress}%`);
            $('.module-header .progress-bar').attr('aria-valuenow', progress);
        }
    }
    
    // Update progress on page load
    updateModuleProgress();
    
    // Check if module is already completed
    if (DataManager.isModuleCompleted('module1-1')) {
        $('.completion-card').addClass('visible');
    }
    
    // Create a simple mind map visualization using SVG
    function initMindMapVisualization() {
        const container = document.getElementById('mindMapVisualization');
        if (!container) return;
        
        // Create SVG element
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 800 400");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        container.appendChild(svg);
        
        // Create central node (Mental Architecture)
        const centralNode = document.createElementNS(svgNS, "circle");
        centralNode.setAttribute("cx", "400");
        centralNode.setAttribute("cy", "200");
        centralNode.setAttribute("r", "50");
        centralNode.setAttribute("fill", "#4b6cb7");
        svg.appendChild(centralNode);
        
        // Create central node text
        const centralText = document.createElementNS(svgNS, "text");
        centralText.setAttribute("x", "400");
        centralText.setAttribute("y", "200");
        centralText.setAttribute("text-anchor", "middle");
        centralText.setAttribute("alignment-baseline", "central");
        centralText.setAttribute("fill", "white");
        centralText.setAttribute("font-size", "12");
        centralText.textContent = "Mental Architecture";
        svg.appendChild(centralText);
        
        // Create branches
        const branches = [
            { name: "Beliefs", x: 250, y: 100, color: "#ff9d00" },
            { name: "Mental Models", x: 550, y: 100, color: "#ff6b6b" },
            { name: "Habits", x: 250, y: 300, color: "#38b2ac" },
            { name: "Processes", x: 550, y: 300, color: "#805ad5" }
        ];
        
        branches.forEach(branch => {
            // Create connection line
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", "400");
            line.setAttribute("y1", "200");
            line.setAttribute("x2", branch.x);
            line.setAttribute("y2", branch.y);
            line.setAttribute("stroke", branch.color);
            line.setAttribute("stroke-width", "3");
            svg.appendChild(line);
            
            // Create node
            const node = document.createElementNS(svgNS, "circle");
            node.setAttribute("cx", branch.x);
            node.setAttribute("cy", branch.y);
            node.setAttribute("r", "35");
            node.setAttribute("fill", branch.color);
            svg.appendChild(node);
            
            // Create text
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", branch.x);
            text.setAttribute("y", branch.y);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("alignment-baseline", "central");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "12");
            text.textContent = branch.name;
            svg.appendChild(text);
        });
        
        // Add animation to the nodes
        document.querySelectorAll('circle').forEach(circle => {
            let originalR = parseFloat(circle.getAttribute('r'));
            
            // Pulsing animation using GSAP
            gsap.to(circle, {
                r: originalR * 1.1,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        });
    }
    
    // Initialize visualizations
    initMindMapVisualization();
});
