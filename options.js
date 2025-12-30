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

        // Test API connection by fetching user info
        const auth = btoa(`${settings.jiraEmail}:${settings.jiraToken}`);
        const response = await fetch(`https://${settings.jiraDomain}/rest/api/3/myself`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        showStatus('testStatus', `✓ Connected successfully as ${data.displayName}`, 'success');
    } catch (error) {
        showStatus('testStatus', `✗ Connection failed: ${error.message}`, 'error');
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = 'Test JIRA Connection';
    }
});

function showStatus(elementId, message, type) {
    const statusEl = document.getElementById(elementId);
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}
