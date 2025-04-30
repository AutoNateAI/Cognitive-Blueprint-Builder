/**
 * Module 2.1: Understanding Mental Resources
 * JavaScript functionality for interactive elements
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initFlipCards();
    initResourceTracking();
    initSoraContainers();
    trackProgress();
    
    // Update ranges to show values
    const attentionRange = document.getElementById('attentionRange');
    const energyRange = document.getElementById('energyRange');
    
    if (attentionRange) {
        attentionRange.addEventListener('input', function() {
            updateRangeValue(this);
        });
        // Initialize
        updateRangeValue(attentionRange);
    }
    
    if (energyRange) {
        energyRange.addEventListener('input', function() {
            updateRangeValue(this);
        });
        // Initialize
        updateRangeValue(energyRange);
    }
    
    // Save Entry button functionality
    const saveEntryBtn = document.querySelector('.tracking-tool button');
    if (saveEntryBtn) {
        saveEntryBtn.addEventListener('click', saveResourceEntry);
    }
    
    // Save data when module is completed
    const nextModuleBtn = document.querySelector('a[href="module2-2.html"]');
    if (nextModuleBtn) {
        nextModuleBtn.addEventListener('click', function(e) {
            // Save completion status
            if (window.dataManager) {
                window.dataManager.markModuleCompleted('module2-1');
                window.dataManager.saveData();
            }
        });
    }
});

/**
 * Initialize flip cards with click events
 */
function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
}

/**
 * Update range input display value
 */
function updateRangeValue(rangeInput) {
    // You could add a visual indicator here if needed
    const value = rangeInput.value;
    const parent = rangeInput.closest('.range-slider');
    
    if (parent) {
        let valueDisplay = parent.querySelector('.range-value');
        if (!valueDisplay) {
            valueDisplay = document.createElement('div');
            valueDisplay.className = 'range-value';
            parent.appendChild(valueDisplay);
        }
        
        valueDisplay.textContent = value + '/10';
        
        // Position it above the thumb
        const percent = ((value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
        valueDisplay.style.left = `calc(${percent}% - 15px)`;
    }
}

/**
 * Initialize resource tracking functionality
 */
function initResourceTracking() {
    // Resource bars animation
    const resourceBars = document.querySelectorAll('.resource-indicator .fill');
    
    resourceBars.forEach(bar => {
        // Initial width is set in HTML with inline styles
        // For animation on scroll:
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Slight delay for visual effect
                    setTimeout(() => {
                        bar.style.width = bar.style.width;
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(bar);
    });
}

/**
 * Save resource tracking entry
 */
function saveResourceEntry() {
    const timeOfDay = document.getElementById('timeOfDay').value;
    const attentionLevel = document.getElementById('attentionRange').value;
    const energyLevel = document.getElementById('energyRange').value;
    const activity = document.getElementById('currentActivity').value;
    const notes = document.getElementById('notes').value;
    
    // Validation
    if (timeOfDay === 'Select time...' || !activity) {
        // Show error
        const form = document.querySelector('.tracking-tool form');
        let alert = form.querySelector('.alert-danger');
        
        if (!alert) {
            alert = document.createElement('div');
            alert.className = 'alert alert-danger mt-3';
            alert.innerHTML = 'Please select a time and describe your activity.';
            form.appendChild(alert);
        }
        
        return;
    }
    
    // Create entry object
    const entry = {
        timeOfDay,
        attentionLevel,
        energyLevel,
        activity,
        notes,
        timestamp: new Date().toISOString()
    };
    
    // Save to data manager
    if (window.dataManager) {
        let resourceData = window.dataManager.getData('resourceTracking') || [];
        resourceData.push(entry);
        window.dataManager.saveData('resourceTracking', resourceData);
    }
    
    // Feedback and reset
    const form = document.querySelector('.tracking-tool form');
    let successAlert = form.querySelector('.alert-success');
    
    if (form.querySelector('.alert-danger')) {
        form.querySelector('.alert-danger').remove();
    }
    
    if (!successAlert) {
        successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success mt-3';
        form.appendChild(successAlert);
    }
    
    successAlert.innerHTML = 'Entry saved! <a href="#" class="view-entries">View all entries</a>';
    document.querySelector('.view-entries').addEventListener('click', function(e) {
        e.preventDefault();
        showAllEntries();
    });
    
    // Reset form
    document.getElementById('timeOfDay').selectedIndex = 0;
    document.getElementById('attentionRange').value = 5;
    document.getElementById('energyRange').value = 5;
    document.getElementById('currentActivity').value = '';
    document.getElementById('notes').value = '';
    updateRangeValue(document.getElementById('attentionRange'));
    updateRangeValue(document.getElementById('energyRange'));
    
    setTimeout(() => {
        if (successAlert) {
            successAlert.classList.add('fade-out');
            setTimeout(() => successAlert.remove(), 500);
        }
    }, 3000);
}

/**
 * Show all saved resource tracking entries
 */
function showAllEntries() {
    // Get data
    if (!window.dataManager) return;
    
    const resourceData = window.dataManager.getData('resourceTracking') || [];
    if (resourceData.length === 0) {
        alert('No entries found yet!');
        return;
    }
    
    // Create modal if doesn't exist
    let entriesModal = document.getElementById('entriesModal');
    if (!entriesModal) {
        entriesModal = document.createElement('div');
        entriesModal.className = 'modal fade';
        entriesModal.id = 'entriesModal';
        entriesModal.tabIndex = '-1';
        entriesModal.setAttribute('aria-labelledby', 'entriesModalLabel');
        entriesModal.setAttribute('aria-hidden', 'true');
        
        entriesModal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="entriesModalLabel">Your Resource Tracking Entries</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="entries-list"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(entriesModal);
    }
    
    // Populate entries
    const entriesList = entriesModal.querySelector('.entries-list');
    entriesList.innerHTML = '';
    
    resourceData.forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        
        card.innerHTML = `
            <div class="card-header d-flex justify-content-between">
                <strong>${entry.timeOfDay}</strong>
                <small class="text-muted">${new Date(entry.timestamp).toLocaleString()}</small>
            </div>
            <div class="card-body">
                <h5 class="card-title">${entry.activity}</h5>
                <div class="row mb-3">
                    <div class="col-6">
                        <div class="resource-indicator attention mb-2">
                            <div class="label">Attention</div>
                            <div class="bar">
                                <div class="fill" style="width: ${entry.attentionLevel * 10}%"></div>
                            </div>
                            <div class="value">${entry.attentionLevel}/10</div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="resource-indicator energy mb-2">
                            <div class="label">Energy</div>
                            <div class="bar">
                                <div class="fill" style="width: ${entry.energyLevel * 10}%"></div>
                            </div>
                            <div class="value">${entry.energyLevel}/10</div>
                        </div>
                    </div>
                </div>
                ${entry.notes ? `<p class="card-text"><small>${entry.notes}</small></p>` : ''}
            </div>
        `;
        
        entriesList.appendChild(card);
    });
    
    // Show modal
    const modal = new bootstrap.Modal(entriesModal);
    modal.show();
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
        // Set to 40% for module 2.1 (4th module out of 9)
        const progressValue = 40; // This is set in the HTML already
        
        // Check if completed before
        if (window.dataManager && window.dataManager.isModuleCompleted('module2-1')) {
            // If already completed, mark as 100% for this module
            progressBar.style.width = '100%';
            progressBar.setAttribute('aria-valuenow', '100');
            progressText.textContent = '100% Complete';
        }
    }
}
