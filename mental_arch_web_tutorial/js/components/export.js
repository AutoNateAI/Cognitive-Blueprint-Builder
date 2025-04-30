/**
 * Export Component - Handles PDF export functionality and restart confirmation
 */

$(document).ready(function() {
    // Open export modal
    $('#exportBtn').on('click', function() {
        $('#exportModal').modal('show');
    });

    // Open restart confirmation modal
    $('#restartBtn').on('click', function() {
        $('#restartModal').modal('show');
    });

    // Handle export confirmation
    $('#confirmExport').on('click', function() {
        // Get selected export option
        const exportOption = $('input[name="exportOption"]:checked').val();
        
        // Show loading state
        const $exportBtn = $(this);
        const originalText = $exportBtn.html();
        $exportBtn.html('<span class="export-loading"></span> Generating PDF...');
        $exportBtn.prop('disabled', true);
        
        // Simulate PDF generation (would be replaced with actual PDF generation logic)
        setTimeout(function() {
            // Reset button state
            $exportBtn.html('<i class="bi bi-check-circle export-success"></i> ' + originalText);
            $exportBtn.prop('disabled', false);
            
            // After a delay, close the modal and reset the button
            setTimeout(function() {
                $('#exportModal').modal('hide');
                
                // After modal closes, reset the button text
                setTimeout(function() {
                    $exportBtn.html(originalText);
                }, 300);
                
            }, 1000);
            
            // Switch based on export type
            switch(exportOption) {
                case 'current':
                    exportCurrentModule();
                    break;
                case 'all':
                    exportAllModules();
                    break;
                case 'ai':
                    exportAIPrompts();
                    break;
            }
        }, 1500);
    });

    // Handle restart confirmation
    $('#confirmRestart').on('click', function() {
        // Show loading state
        const $restartBtn = $(this);
        const originalText = $restartBtn.html();
        $restartBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Restarting...');
        $restartBtn.prop('disabled', true);
        
        // Clear all data in localStorage
        if (window.localStorage) {
            // Keep theme preference, but clear tutorial data
            const theme = localStorage.getItem('theme');
            localStorage.clear();
            if (theme) {
                localStorage.setItem('theme', theme);
            }
        }
        
        // Update progress indicator
        if (window.navigationComponent && window.navigationComponent.updateProgress) {
            window.navigationComponent.updateProgress();
        }
        
        // After a delay, redirect to the introduction page
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1000);
    });

    // Export current module function
    function exportCurrentModule() {
        const currentPath = window.location.pathname;
        const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        
        // Generate filename based on current module
        let exportFilename = 'CBB_Introduction.pdf';
        
        if (filename !== '' && filename !== 'index.html') {
            // Extract module number from filename (e.g., module1-1.html -> Module 1.1)
            const moduleMatch = filename.match(/module(\d)-(\d)\.html/);
            if (moduleMatch) {
                const phase = moduleMatch[1];
                const module = moduleMatch[2];
                exportFilename = `CBB_Module${phase}.${module}.pdf`;
            }
        }
        
        // In a real implementation, this would generate a PDF
        // For now, we'll simulate a download
        simulateDownload(exportFilename);
    }

    // Export all completed modules function
    function exportAllModules() {
        // In a real implementation, this would gather all completed module data
        // and generate a comprehensive PDF
        simulateDownload('CBB_Complete_Blueprint.pdf');
    }

    // Export AI prompts function
    function exportAIPrompts() {
        // In a real implementation, this would generate a PDF with AI prompts
        // tailored to the user's completed data
        simulateDownload('CBB_AI_Prompts.pdf');
    }

    // Simulate file download
    function simulateDownload(filename) {
        console.log(`Exporting: ${filename}`);
        
        // This is a placeholder - in a real implementation, 
        // we'd generate a PDF and trigger a download
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent('This is a sample PDF export'));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
    }
    
    // Export functions for use by other components
    window.exportComponent = {
        exportCurrentModule: exportCurrentModule,
        exportAllModules: exportAllModules,
        exportAIPrompts: exportAIPrompts
    };
});
