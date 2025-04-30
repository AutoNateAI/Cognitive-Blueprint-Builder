/**
 * Data Manager Component - Handles storage and retrieval of user data
 */

// Self-executing function to create a module pattern with private methods
const DataManager = (function() {
    // Private methods and variables
    const storageAvailable = function(type) {
        try {
            const storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return false;
        }
    };
    
    const isLocalStorageAvailable = storageAvailable('localStorage');
    
    // Data structure for user progress and responses
    const defaultUserData = {
        lastActivity: null,
        currentModule: 'index.html',
        completedModules: [],
        progress: 0,
        responses: {}
    };
    
    // Module name mapping
    const moduleMap = {
        'index.html': { id: 'intro', next: 'module1-1.html' },
        'module1-1.html': { id: 'module1-1', next: 'module1-2.html', phase: 1, order: 1 },
        'module1-2.html': { id: 'module1-2', next: 'module1-3.html', phase: 1, order: 2 },
        'module1-3.html': { id: 'module1-3', next: 'module2-1.html', phase: 1, order: 3 },
        'module2-1.html': { id: 'module2-1', next: 'module2-2.html', phase: 2, order: 1 },
        'module2-2.html': { id: 'module2-2', next: 'module2-3.html', phase: 2, order: 2 },
        'module2-3.html': { id: 'module2-3', next: 'module3-1.html', phase: 2, order: 3 },
        'module3-1.html': { id: 'module3-1', next: 'module3-2.html', phase: 3, order: 1 },
        'module3-2.html': { id: 'module3-2', next: 'module3-3.html', phase: 3, order: 2 },
        'module3-3.html': { id: 'module3-3', next: 'conclusion.html', phase: 3, order: 3 },
        'conclusion.html': { id: 'conclusion', next: null }
    };

    // Initialize user data
    const initUserData = function() {
        if (!isLocalStorageAvailable) {
            console.warn('LocalStorage is not available. User data will not be saved.');
            return defaultUserData;
        }
        
        const savedData = localStorage.getItem('cbbUserData');
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error('Error parsing saved user data:', e);
                return defaultUserData;
            }
        }
        
        // No saved data, initialize with defaults
        localStorage.setItem('cbbUserData', JSON.stringify(defaultUserData));
        return defaultUserData;
    };
    
    // Save user data
    const saveUserData = function(userData) {
        if (!isLocalStorageAvailable) return;
        
        // Update last activity timestamp
        userData.lastActivity = new Date().toISOString();
        
        localStorage.setItem('cbbUserData', JSON.stringify(userData));
    };
    
    // Public API
    return {
        // Initialize the data manager
        init: function() {
            const userData = initUserData();
            
            // Update current module based on current page
            const currentPath = window.location.pathname;
            const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
            
            if (moduleMap[filename]) {
                userData.currentModule = filename;
                saveUserData(userData);
            }
            
            return userData;
        },
        
        // Get user data
        getUserData: function() {
            return initUserData();
        },
        
        // Save a response for the current module
        saveResponse: function(questionId, response) {
            if (!isLocalStorageAvailable) return;
            
            const userData = initUserData();
            const currentPath = window.location.pathname;
            const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
            
            if (moduleMap[filename]) {
                const moduleId = moduleMap[filename].id;
                
                // Initialize module responses if needed
                if (!userData.responses[moduleId]) {
                    userData.responses[moduleId] = {};
                }
                
                // Save the response
                userData.responses[moduleId][questionId] = response;
                saveUserData(userData);
                
                return true;
            }
            
            return false;
        },
        
        // Get responses for a specific module
        getModuleResponses: function(moduleId) {
            const userData = initUserData();
            
            if (userData.responses[moduleId]) {
                return userData.responses[moduleId];
            }
            
            return {};
        },
        
        // Mark the current module as completed
        completeCurrentModule: function() {
            if (!isLocalStorageAvailable) return;
            
            const userData = initUserData();
            const currentPath = window.location.pathname;
            const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
            
            if (moduleMap[filename]) {
                const moduleId = moduleMap[filename].id;
                
                // Add to completed modules if not already there
                if (!userData.completedModules.includes(moduleId)) {
                    userData.completedModules.push(moduleId);
                }
                
                // Calculate progress (excluding intro and conclusion)
                const totalModules = Object.keys(moduleMap).length - 2; // Subtract intro and conclusion
                userData.progress = Math.round((userData.completedModules.length / totalModules) * 100);
                
                // Save the updated data
                saveUserData(userData);
                
                // Update progress bar if navigation component is available
                if (window.navigationComponent && window.navigationComponent.updateProgress) {
                    window.navigationComponent.updateProgress();
                }
                
                return true;
            }
            
            return false;
        },
        
        // Check if a module is completed
        isModuleCompleted: function(moduleId) {
            const userData = initUserData();
            return userData.completedModules.includes(moduleId);
        },
        
        // Get the next module in sequence
        getNextModule: function() {
            const userData = initUserData();
            const currentModule = userData.currentModule;
            
            if (moduleMap[currentModule] && moduleMap[currentModule].next) {
                return moduleMap[currentModule].next;
            }
            
            return null;
        },
        
        // Clear all user data (for restart)
        clearAllData: function() {
            if (!isLocalStorageAvailable) return;
            
            // Save theme preference
            const theme = localStorage.getItem('theme');
            
            // Clear all data
            localStorage.removeItem('cbbUserData');
            
            // Re-initialize with defaults
            const userData = initUserData();
            
            // Restore theme
            if (theme) {
                localStorage.setItem('theme', theme);
            }
            
            return userData;
        },
        
        // Check if localStorage is available
        isStorageAvailable: function() {
            return isLocalStorageAvailable;
        },
        
        // Get module info
        getModuleInfo: function(moduleId) {
            // Find module by ID
            for (const [filename, info] of Object.entries(moduleMap)) {
                if (info.id === moduleId) {
                    return {
                        filename,
                        ...info
                    };
                }
            }
            
            return null;
        }
    };
})();

// Initialize on page load
$(document).ready(function() {
    // Initialize data manager
    DataManager.init();
    
    // Make DataManager globally available
    window.DataManager = DataManager;
});
