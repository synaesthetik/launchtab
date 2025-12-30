// Firefox/Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Check JIRA configuration status
document.addEventListener('DOMContentLoaded', async () => {
    const settings = await browserAPI.storage.sync.get(['jiraDomain', 'jiraEmail', 'jiraToken']);
    const statusEl = document.getElementById('configStatus');
    
    if (settings.jiraDomain && settings.jiraEmail && settings.jiraToken) {
        statusEl.textContent = `✓ JIRA configured: ${settings.jiraDomain}`;
        statusEl.className = 'status configured';
    } else {
        statusEl.textContent = '⚠ JIRA not configured';
        statusEl.className = 'status not-configured';
    }
});

// Open new tab with planner
document.getElementById('openNewTab').addEventListener('click', () => {
    browserAPI.tabs.create({ url: 'project-management-runbook.html' });
});

// Open settings
document.getElementById('openSettings').addEventListener('click', () => {
    browserAPI.runtime.openOptionsPage();
});
