/**
 * Module 1.2 JavaScript
 * Handles functionality specific to the "Creating Your Mental Taxonomy" module
 */

$(document).ready(function() {
    // Initialize taxonomy data structure
    let taxonomyData = {
        name: "Mental Taxonomy",
        children: []
    };
    
    // Component collector variables
    let timerInterval;
    let timeLeft = 600; // 10 minutes in seconds
    let componentCounts = {
        thoughts: 0,
        emotions: 0,
        beliefs: 0
    };
    
    // Component collector timer functionality
    $('#startTimer').on('click', function() {
        if (!timerInterval) {
            startComponentTimer();
            $(this).text('Pause');
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            $(this).text('Resume');
        }
    });
    
    $('#resetTimer').on('click', function() {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = 600;
        updateTimerDisplay();
        $('#startTimer').text('Start');
        
        // Reset component counts if user confirms
        if (confirm('Reset your component counts as well?')) {
            componentCounts = {
                thoughts: 0,
                emotions: 0,
                beliefs: 0
            };
            updateComponentCounters();
        }
    });
    
    // Load any saved taxonomy data
    loadSavedTaxonomy();
    
    // Load any saved responses
    loadSavedResponses();
    
    // Handle adding new categories
    $('#addCategoryBtn').on('click', function() {
        addCategory();
    });
    
    // Also handle Enter key in the input field
    $('#taxonomyCategory').keypress(function(e) {
        if (e.which === 13) { // Enter key
            addCategory();
        }
    });
    
    // Function to add a new category
    function addCategory() {
        const categoryName = $('#taxonomyCategory').val().trim();
        
        if (categoryName) {
            // Add to data structure
            taxonomyData.children.push({
                name: categoryName,
                children: []
            });
            
            // Clear input
            $('#taxonomyCategory').val('');
            
            // Redraw visualization
            drawTaxonomyTree();
            
            // Save to local storage
            saveTaxonomyData();
        }
    }
    
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
            
            // Extract categories from response and add to taxonomy
            if (questionId === 'mentalCategoriesResponse') {
                extractCategoriesFromResponse(response);
            }
            
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
                
                // Extract categories if appropriate
                if (questionId === 'mentalCategoriesResponse') {
                    extractCategoriesFromResponse(response);
                }
                
                // Reset button after 1 second
                setTimeout(() => {
                    saveBtn.removeClass('saved');
                    saveBtn.html('Save Response');
                }, 1000);
            }
        }, 1000);
    });
    
    // Extract categories from text response
    function extractCategoriesFromResponse(response) {
        // Split by newlines, commas, or semicolons
        const lines = response.split(/[\n,;]+/);
        
        lines.forEach(line => {
            const category = line.trim();
            if (category && !categoryExists(category)) {
                taxonomyData.children.push({
                    name: category,
                    children: []
                });
            }
        });
        
        // Redraw visualization and save
        drawTaxonomyTree();
        saveTaxonomyData();
    }
    
    // Check if category already exists
    function categoryExists(categoryName) {
        return taxonomyData.children.some(category => 
            category.name.toLowerCase() === categoryName.toLowerCase()
        );
    }
    
    // Mark module as complete when bottom "Next" button is clicked
    $('.module-navigation .btn-primary').on('click', function() {
        DataManager.completeCurrentModule();
    });
    
    // Save taxonomy data to local storage
    function saveTaxonomyData() {
        DataManager.saveResponse('taxonomyData', taxonomyData);
    }
    
    // Load taxonomy data from local storage
    function loadSavedTaxonomy() {
        const responses = DataManager.getModuleResponses('module1-2');
        
        if (responses && responses.taxonomyData) {
            taxonomyData = responses.taxonomyData;
            drawTaxonomyTree();
        }
    }
    
    // Function to load saved responses from local storage
    function loadSavedResponses() {
        const responses = DataManager.getModuleResponses('module1-2');
        
        for (const [id, value] of Object.entries(responses)) {
            // Skip the taxonomy data as it's handled separately
            if (id !== 'taxonomyData') {
                $(`#${id}`).val(value);
            }
        }
    }
    
    // Draw the taxonomy tree visualization
    function drawTaxonomyTree() {
        const container = document.getElementById('taxonomyVisualization');
        if (!container) return;
        
        // Clear previous visualization
        container.innerHTML = '';
        
        // Create SVG element
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 800 400");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        container.appendChild(svg);
        
        // Create central node
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
        centralText.setAttribute("alignment-baseline", "middle");
        centralText.setAttribute("fill", "white");
        centralText.setAttribute("font-size", "12");
        centralText.textContent = taxonomyData.name;
        svg.appendChild(centralText);
        
        // Draw child categories
        const numChildren = taxonomyData.children.length;
        
        if (numChildren > 0) {
            // Calculate position for each child node
            const radius = 150; // Distance from center
            const angleStep = (2 * Math.PI) / numChildren;
            
            taxonomyData.children.forEach((child, index) => {
                const angle = index * angleStep;
                const x = 400 + radius * Math.cos(angle);
                const y = 200 + radius * Math.sin(angle);
                
                // Create connection line
                const line = document.createElementNS(svgNS, "line");
                line.setAttribute("x1", "400");
                line.setAttribute("y1", "200");
                line.setAttribute("x2", x);
                line.setAttribute("y2", y);
                line.setAttribute("stroke", getColorForIndex(index));
                line.setAttribute("stroke-width", "3");
                svg.appendChild(line);
                
                // Create node
                const node = document.createElementNS(svgNS, "circle");
                node.setAttribute("cx", x);
                node.setAttribute("cy", y);
                node.setAttribute("r", "35");
                node.setAttribute("fill", getColorForIndex(index));
                node.setAttribute("data-index", index);
                node.addEventListener("click", function() {
                    // Could add functionality to edit/delete categories
                    console.log("Clicked on category:", child.name);
                });
                svg.appendChild(node);
                
                // Create text
                const text = document.createElementNS(svgNS, "text");
                text.setAttribute("x", x);
                text.setAttribute("y", y);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("alignment-baseline", "middle");
                text.setAttribute("fill", "white");
                text.setAttribute("font-size", "10");
                // Handle long text by truncating
                text.textContent = child.name.length > 12 ? child.name.substring(0, 10) + "..." : child.name;
                svg.appendChild(text);
                
                // Add a tooltip for long names
                if (child.name.length > 12) {
                    const title = document.createElementNS(svgNS, "title");
                    title.textContent = child.name;
                    node.appendChild(title);
                }
            });
        }
        
        // Add animation to the nodes
        document.querySelectorAll('circle').forEach(circle => {
            let originalR = parseFloat(circle.getAttribute('r'));
            
            // Pulsing animation using GSAP
            gsap.to(circle, {
                r: originalR * 1.05,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        });
    }
    
    // Get color for category based on index
    function getColorForIndex(index) {
        const colors = [
            "#ff9d00", "#ff6b6b", "#38b2ac", "#805ad5", 
            "#4299e1", "#0bc5ea", "#68d391", "#f6ad55"
        ];
        
        return colors[index % colors.length];
    }
    
    // Display progress based on completed sections
    function updateModuleProgress() {
        const responses = DataManager.getModuleResponses('module1-2');
        let progress = 0;
        
        // Check if taxonomy has items
        if (taxonomyData && taxonomyData.children && taxonomyData.children.length > 0) {
            progress += 50; // 50% for creating taxonomy
        }
        
        // Check if text response is completed
        if (responses && responses.mentalCategoriesResponse && responses.mentalCategoriesResponse.trim().length > 0) {
            progress += 50; // 50% for written reflection
        }
        
        // Update progress bar
        $('.module-header .progress-bar').css('width', `${progress}%`);
        $('.module-header .progress-bar').attr('aria-valuenow', progress);
    }
    
    // Update progress on page load
    updateModuleProgress();
    
    // Check if module is already completed
    if (DataManager.isModuleCompleted('module1-2')) {
        $('.completion-card').addClass('visible');
    }
    
    // Initialize visualization
    drawTaxonomyTree();
    
    // Initialize Sora image containers with animation
    initSoraContainers();
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Mock component addition buttons (for demonstration purposes)
    // These would normally be connected to the drag-and-drop interface
    $('.component-type.thoughts').on('click', function() {
        incrementComponent('thoughts');
    });
    
    $('.component-type.emotions').on('click', function() {
        incrementComponent('emotions');
    });
    
    $('.component-type.beliefs').on('click', function() {
        incrementComponent('beliefs');
    });
    
    // Timer functions
    function startComponentTimer() {
        timerInterval = setInterval(function() {
            timeLeft--;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                $('#startTimer').text('Time's Up!').prop('disabled', true);
                
                // Show completion message
                const totalComponents = componentCounts.thoughts + componentCounts.emotions + componentCounts.beliefs;
                let message = `<div class="alert alert-success"><strong>Great job!</strong> You identified ${totalComponents} mental components:</div>`;
                message += `<ul>
                    <li>${componentCounts.thoughts} thoughts</li>
                    <li>${componentCounts.emotions} emotions</li>
                    <li>${componentCounts.beliefs} beliefs</li>
                </ul>`;
                
                // Insert completion message after the timer card
                $('#timerDisplay').closest('.card').after(message);
            }
            
            updateTimerDisplay();
        }, 1000);
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        $('#timerDisplay').text(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }
    
    function incrementComponent(type) {
        if (componentCounts.hasOwnProperty(type)) {
            componentCounts[type]++;
            updateComponentCounters();
            
            // Provide visual feedback
            const card = $(`#${type}Count`).closest('.card');
            card.addClass('pulse-animation');
            setTimeout(() => {
                card.removeClass('pulse-animation');
            }, 500);
        }
    }
    
    function updateComponentCounters() {
        $('#thoughtCount').text(componentCounts.thoughts);
        $('#emotionCount').text(componentCounts.emotions);
        $('#beliefCount').text(componentCounts.beliefs);
    }
    
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
        $(window).trigger('scroll');
    }
});
