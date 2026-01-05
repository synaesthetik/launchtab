// JIRA API utilities for the extension

// Firefox/Chrome compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : (typeof chrome !== 'undefined' ? chrome : null);

if (!browserAPI) {
    console.error('Extension API not available. browser:', typeof browser, 'chrome:', typeof chrome);
}

async function getJiraSettings() {
    if (!browserAPI) {
        throw new Error('Extension API not available');
    }
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

    // Clean up domain (remove https:// if present)
    const domain = settings.jiraDomain.replace(/^https?:\/\//, '');

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

    try {
        const response = await fetch(`https://${domain}/rest/api/3/issue`, {
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

        const result = await response.json();
        
        // Return formatted result with domain and key
        return {
            key: result.key,
            id: result.id,
            domain: domain,
            baseUrl: `https://${domain}`
        };
    } catch (error) {
        // Provide more helpful error messages
        if (error.message.includes('NetworkError') || error.name === 'TypeError') {
            throw new Error(`Cannot reach ${domain}. Check domain and network.`);
        }
        throw error;
    }
}

async function createMultipleJiraTickets(tickets, onProgress) {
    const results = [];
    
    for (let i = 0; i < tickets.length; i++) {
        try {
            const result = await createJiraTicket(tickets[i].title, tickets[i].description);
            results.push({ 
                success: true, 
                key: result.key,
                domain: result.domain,
                baseUrl: result.baseUrl,
                ticket: tickets[i] 
            });
            if (onProgress) onProgress(i + 1, tickets.length, result);
        } catch (error) {
            results.push({ success: false, error: error.message, ticket: tickets[i] });
            if (onProgress) onProgress(i + 1, tickets.length, null, error);
        }
    }
    
    return results;
}
