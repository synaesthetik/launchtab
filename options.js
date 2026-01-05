// Firefox/Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Load saved settings
document.addEventListener('DOMContentLoaded', async () => {
    const settings = await browserAPI.storage.sync.get([
        'jiraDomain',
        'jiraEmail',
        'jiraToken',
        'jiraProject',
        'jiraIssueType'
    ]);

    if (settings.jiraDomain) document.getElementById('jiraDomain').value = settings.jiraDomain;
    if (settings.jiraEmail) document.getElementById('jiraEmail').value = settings.jiraEmail;
    if (settings.jiraToken) document.getElementById('jiraToken').value = settings.jiraToken;
    if (settings.jiraProject) document.getElementById('jiraProject').value = settings.jiraProject;
    if (settings.jiraIssueType) document.getElementById('jiraIssueType').value = settings.jiraIssueType;
});

// Save settings
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const settings = {
        jiraDomain: document.getElementById('jiraDomain').value.trim(),
        jiraEmail: document.getElementById('jiraEmail').value.trim(),
        jiraToken: document.getElementById('jiraToken').value.trim(),
        jiraProject: document.getElementById('jiraProject').value.trim(),
        jiraIssueType: document.getElementById('jiraIssueType').value.trim()
    };

    try {
        await browserAPI.storage.sync.set(settings);
        showStatus('status', 'Settings saved successfully!', 'success');
    } catch (error) {
        showStatus('status', 'Error saving settings: ' + error.message, 'error');
    }
});

// Test connection
document.getElementById('testBtn').addEventListener('click', async () => {
    const testBtn = document.getElementById('testBtn');
    const statusEl = document.getElementById('testStatus');
    
    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';
    statusEl.style.display = 'none';

    try {
        const settings = await browserAPI.storage.sync.get([
            'jiraDomain',
            'jiraEmail',
            'jiraToken'
        ]);

        if (!settings.jiraDomain || !settings.jiraEmail || !settings.jiraToken) {
            throw new Error('Please save your settings first');
        }

        // Clean up domain (remove https:// if present)
        const domain = settings.jiraDomain.replace(/^https?:\/\//, '');

        // Test API connection by fetching user info
        const auth = btoa(`${settings.jiraEmail}:${settings.jiraToken}`);
        const testUrl = `https://${domain}/rest/api/3/myself`;
        
        showStatus('testStatus', `⏳ Testing connection to ${domain}...`, 'info');
        
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                let errorMsg = `API error: ${response.status} ${response.statusText}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.errorMessages && errorJson.errorMessages.length > 0) {
                        errorMsg += ` - ${errorJson.errorMessages.join(', ')}`;
                    }
                } catch (e) {
                    // If not JSON, include first 100 chars of error text
                    if (errorText) {
                        errorMsg += ` - ${errorText.substring(0, 100)}`;
                    }
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            showStatus('testStatus', `✓ Connected successfully as ${data.displayName} (${data.emailAddress})`, 'success');
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error(`Connection timed out after 10 seconds. Check:\n• Network/VPN connection\n• Domain is correct: ${domain}\n• No firewall blocking Atlassian`);
            }
            throw fetchError;
        }
    } catch (error) {
        let errorMsg = error.message;
        
        // Get domain safely (might not be available if we failed early)
        let errorDomain = 'your Atlassian domain';
        try {
            const settings = await browserAPI.storage.sync.get(['jiraDomain']);
            if (settings.jiraDomain) {
                errorDomain = settings.jiraDomain.replace(/^https?:\/\//, '');
            }
        } catch (e) {
            // Ignore if we can't get settings
        }
        
        // Provide helpful hints based on error type
        if (error.message.includes('NetworkError') || error.name === 'TypeError') {
            errorMsg = `Cannot reach ${errorDomain}. Check:\n• Domain is correct (e.g., company.atlassian.net)\n• Network/VPN connection\n• No firewall blocking`;
        } else if (error.message.includes('401')) {
            errorMsg = `Authentication failed (401). Check:\n• Email is correct\n• API token is valid (not expired)\n• Token has correct permissions`;
        } else if (error.message.includes('403')) {
            errorMsg = `Access forbidden (403). Check:\n• Your account has JIRA access\n• API token permissions`;
        }
        
        showStatus('testStatus', `✗ Connection failed:\n${errorMsg}`, 'error');
        console.error('JIRA connection test failed:', error);
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = 'Test JIRA Connection';
    }
});

function showStatus(elementId, message, type) {
    const statusEl = document.getElementById(elementId);
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.style.whiteSpace = 'pre-line'; // Allow newlines in error messages
    statusEl.className = `status ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}
