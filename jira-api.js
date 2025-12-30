// JIRA API utilities for the extension

// Firefox/Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

async function getJiraSettings() {
    return await browserAPI.storage.sync.get([
        'jiraDomain',
        'jiraEmail',
        'jiraToken',
        'jiraProject',
        'jiraIssueType'
    ]);
}

async function createJiraTicket(title, description) {
    const settings = await getJiraSettings();
    
    if (!settings.jiraDomain || !settings.jiraEmail || !settings.jiraToken || !settings.jiraProject) {
        throw new Error('JIRA not configured. Please go to Settings.');
    }

    const auth = btoa(`${settings.jiraEmail}:${settings.jiraToken}`);
    const issueType = settings.jiraIssueType || 'Task';

    const issueData = {
        fields: {
            project: {
                key: settings.jiraProject
            },
            summary: title,
            description: {
                type: 'doc',
                version: 1,
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: description || 'No description provided'
                            }
                        ]
                    }
                ]
            },
            issuetype: {
                name: issueType
            }
        }
    };

    const response = await fetch(`https://${settings.jiraDomain}/rest/api/3/issue`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessages?.join(', ') || `API error: ${response.status}`);
    }

    return await response.json();
}

async function createMultipleJiraTickets(tickets, onProgress) {
    const results = [];
    
    for (let i = 0; i < tickets.length; i++) {
        try {
            const result = await createJiraTicket(tickets[i].title, tickets[i].description);
            results.push({ success: true, data: result, ticket: tickets[i] });
            if (onProgress) onProgress(i + 1, tickets.length, result);
        } catch (error) {
            results.push({ success: false, error: error.message, ticket: tickets[i] });
            if (onProgress) onProgress(i + 1, tickets.length, null, error);
        }
    }
    
    return results;
}
