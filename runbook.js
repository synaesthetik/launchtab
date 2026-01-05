// LaunchTab - Project Planning Runbook - Main JavaScript

// State management
const projectData = {
    problem: '',
    success: '',
    challenges: [],
    decompositionType: '',
    components: [],
    strategy: '',
    tickets: []
};

let currentStep = 0;
let ticketCounter = 0;

// Ticket management functions
function addTicketForm() {
    ticketCounter++;
    const container = document.getElementById('ticketsContainer');
    const ticketCard = document.createElement('div');
    ticketCard.className = 'ticket-card';
    ticketCard.id = `ticket-${ticketCounter}`;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-ticket';
    removeBtn.title = 'Remove ticket';
    removeBtn.textContent = '×';
    removeBtn.onclick = () => removeTicket(ticketCounter);
    
    const ticketNumber = document.createElement('span');
    ticketNumber.className = 'ticket-number';
    ticketNumber.textContent = `Ticket #${ticketCounter}`;
    
    const titleGroup = document.createElement('div');
    titleGroup.className = 'input-group';
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', `ticket-title-${ticketCounter}`);
    titleLabel.textContent = 'Title:';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = `ticket-title-${ticketCounter}`;
    titleInput.placeholder = 'Brief, action-oriented title...';
    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);
    
    const descGroup = document.createElement('div');
    descGroup.className = 'input-group';
    const descLabel = document.createElement('label');
    descLabel.setAttribute('for', `ticket-desc-${ticketCounter}`);
    descLabel.textContent = 'Description:';
    const descTextarea = document.createElement('textarea');
    descTextarea.id = `ticket-desc-${ticketCounter}`;
    descTextarea.rows = 4;
    descTextarea.placeholder = 'What needs to be done, why, and any relevant context...';
    descGroup.appendChild(descLabel);
    descGroup.appendChild(descTextarea);
    
    ticketCard.appendChild(removeBtn);
    ticketCard.appendChild(ticketNumber);
    ticketCard.appendChild(titleGroup);
    ticketCard.appendChild(descGroup);
    
    container.appendChild(ticketCard);
}

function removeTicket(ticketId) {
    const ticket = document.getElementById(`ticket-${ticketId}`);
    if (ticket) {
        ticket.remove();
    }
}

function collectTickets() {
    const tickets = [];
    const ticketCards = document.querySelectorAll('.ticket-card');
    ticketCards.forEach(card => {
        const ticketId = card.id.split('-')[1];
        const title = document.getElementById(`ticket-title-${ticketId}`).value.trim();
        const description = document.getElementById(`ticket-desc-${ticketId}`).value.trim();
        if (title || description) {
            tickets.push({ title, description });
        }
    });
    return tickets;
}

// Understanding check functions
function answerUnderstanding(answer) {
    const needInfoPath = document.getElementById('needInfoPath');
    const proceedPath = document.getElementById('proceedToStep1');
    
    if (answer === 'yes') {
        needInfoPath.classList.remove('open');
        proceedPath.classList.add('open');
        // Auto-proceed after a brief moment to show the success message
        setTimeout(() => {
            proceedFromUnderstanding();
        }, 800);
    } else {
        proceedPath.classList.remove('open');
        needInfoPath.classList.add('open');
    }
}

function answerKnowWhere(answer) {
    const informationPath = document.getElementById('informationPath');
    if (answer === 'yes') {
        informationPath.innerHTML = '<p style="color: var(--success); font-weight: 500;">✅ Great! Go gather that information, then come back to start planning.</p>';
    } else {
        informationPath.innerHTML = '<p style="color: var(--warning);">💡 <strong>Tip:</strong> Talk to your tech lead, check similar past projects, or schedule a quick sync with someone who has context.</p>';
    }
}

function answerKnowPerson(answer) {
    const personPath = document.getElementById('personPath');
    if (answer === 'yes') {
        personPath.innerHTML = '<p style="color: var(--success); font-weight: 500;">✅ Perfect! Reach out to them. Once you have clarity, come back to continue planning.</p>';
    } else {
        personPath.innerHTML = '<p style="color: var(--warning);">💡 <strong>Suggestion:</strong> Post in your team Slack/chat asking "Who has context on [problem area]?" or ask your manager for a pointer.</p>';
    }
}

function proceedFromUnderstanding() {
    document.getElementById('step0').classList.remove('active');
    document.getElementById('step0').classList.add('completed');
    document.getElementById('step1').classList.add('active');
    document.getElementById('step1').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    currentStep = 1;
}

// Step management
function completeStep(stepNum) {
    // Collect data from current step
    switch(stepNum) {
        case 1:
            projectData.problem = document.getElementById('problemStatement').value;
            projectData.success = document.getElementById('successCriteria').value;
            if (!projectData.problem || !projectData.success) {
                alert('Please fill in both fields before continuing.');
                return;
            }
            displayProblemSummary();
            break;
        case 2:
            projectData.challenges = [
                document.getElementById('challenge1').value.trim(),
                document.getElementById('challenge2').value.trim(),
                document.getElementById('challenge3').value.trim()
            ].filter(c => c); // Remove empty challenges
            if (projectData.challenges.length === 0) {
                alert('Please list at least one challenge.');
                return;
            }
            break;
        case 3:
            const componentsText = document.getElementById('components').value;
            projectData.components = componentsText.split('\n').filter(c => c.trim());
            if (projectData.components.length < 2) {
                alert('Please list at least 2 components.');
                return;
            }
            displayComponentsSummary();
            break;
        case 4:
            if (!projectData.strategy) {
                alert('Please select a starting strategy.');
                return;
            }
            break;
        case 5:
            projectData.tickets = collectTickets();
            if (projectData.tickets.length === 0) {
                alert('Please add at least one ticket.');
                return;
            }
            generateFinalBrief();
            break;
    }

    // Mark current step as completed
    document.getElementById('step' + stepNum).classList.remove('active');
    document.getElementById('step' + stepNum).classList.add('completed');

    // Activate next step
    const nextStepId = 'step' + (stepNum + 1);
    
    if (document.getElementById(nextStepId)) {
        document.getElementById(nextStepId).classList.add('active');
        document.getElementById(nextStepId).scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        currentStep = stepNum + 1;
    }
}

function displayProblemSummary() {
    const summaryEl = document.getElementById('problemSummary');
    summaryEl.innerHTML = '';
    
    const h4 = document.createElement('h4');
    h4.textContent = '📋 Your Problem Statement';
    summaryEl.appendChild(h4);
    
    const problemP = document.createElement('p');
    const strongProblem = document.createElement('strong');
    strongProblem.textContent = 'Problem: ';
    problemP.appendChild(strongProblem);
    problemP.appendChild(document.createTextNode(projectData.problem));
    summaryEl.appendChild(problemP);
    
    const successP = document.createElement('p');
    const strongSuccess = document.createElement('strong');
    strongSuccess.textContent = 'Success Looks Like: ';
    successP.appendChild(strongSuccess);
    successP.appendChild(document.createTextNode(projectData.success));
    summaryEl.appendChild(successP);
}

function displayComponentsSummary() {
    const summaryEl = document.getElementById('componentsSummary');
    summaryEl.innerHTML = '';
    
    const h4 = document.createElement('h4');
    h4.textContent = `🏗️ Your Major Components (${projectData.decompositionType} approach)`;
    summaryEl.appendChild(h4);
    
    const ul = document.createElement('ul');
    projectData.components.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        ul.appendChild(li);
    });
    summaryEl.appendChild(ul);
}

function selectDecomposition(type) {
    projectData.decompositionType = type;
    
    // Visual feedback
    document.querySelectorAll('#step3 .option-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');

    // Show component input
    document.getElementById('componentInput').classList.add('open');
}

function selectStrategy(strategy) {
    projectData.strategy = strategy;
    
    // Visual feedback
    document.querySelectorAll('#step4 .option-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.option-card').classList.add('selected');

    // Show guidance
    const guidance = getStrategyGuidance(strategy);
    const guidanceEl = document.getElementById('strategyGuidance');
    guidanceEl.innerHTML = '';
    guidanceEl.insertAdjacentHTML('beforeend', guidance);
    guidanceEl.classList.add('open');
}

function getStrategyGuidance(strategy) {
    const guides = {
        skeleton: `
            <div class="admonition tip">
                <h4>🦴 Walking Skeleton Approach</h4>
                <blockquote style="border-left: 3px solid var(--primary); padding-left: 1rem; margin: 1rem 0; color: var(--text-secondary); font-style: italic;">
                    "A Walking Skeleton is a tiny implementation of the system that performs a small end-to-end function. It need not use the final architecture, but it should link together the main architectural components."
                    <br>— Alistair Cockburn, Growing Object-Oriented Software
                </blockquote>
                <p><strong>First task:</strong> Build the simplest end-to-end flow that touches all major components.</p>
                <p><strong>Goal:</strong> Prove the architecture works before adding features. Identify integration issues early.</p>
                <p><strong>Example:</strong> "Create minimal dashboard that fetches one ticket from the API and displays it"</p>
            </div>
        `,
        risk: `
            <div class="admonition tip">
                <h4>⚠️ Risk-First Approach</h4>
                <blockquote style="border-left: 3px solid var(--primary); padding-left: 1rem; margin: 1rem 0; color: var(--text-secondary); font-style: italic;">
                    "If you tackle the riskiest things first, you maximize the chance that you'll know about big problems when there's still time to deal with them."
                    <br>— Kent Beck, Extreme Programming Explained
                </blockquote>
                <p><strong>First task:</strong> Tackle the component with the most uncertainty or technical risk.</p>
                <p><strong>Why:</strong> Fail fast if it won't work, or build confidence early if it will.</p>
                <p><strong>Example:</strong> "Prototype real-time sync between two systems to prove latency is acceptable"</p>
            </div>
        `,
        value: `
            <div class="admonition tip">
                <h4>💎 Value-First Approach</h4>
                <blockquote style="border-left: 3px solid var(--primary); padding-left: 1rem; margin: 1rem 0; color: var(--text-secondary); font-style: italic;">
                    "The minimum viable product is that version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort."
                    <br>— Eric Ries, The Lean Startup
                </blockquote>
                <p><strong>First task:</strong> Build the smallest feature that delivers immediate user value.</p>
                <p><strong>Benefit:</strong> Quick wins, early user feedback, stakeholder confidence, faster learning.</p>
                <p><strong>Example:</strong> "Manual ticket import button - gets them unblocked today, automate later"</p>
            </div>
        `
    };
    return guides[strategy] || '';
}

function generateFinalBrief() {
    const date = new Date().toLocaleDateString();
    const componentsFormatted = projectData.components.map((c, i) => `${i + 1}. ${c}`).join('\n');
    
    const finalBriefEl = document.getElementById('finalBrief');
    finalBriefEl.innerHTML = '';
    
    // Title
    const h3 = document.createElement('h3');
    h3.textContent = '🎯 Project Planning Brief';
    finalBriefEl.appendChild(h3);
    
    // Problem Statement
    const h4Problem = document.createElement('h4');
    h4Problem.textContent = 'Problem Statement';
    finalBriefEl.appendChild(h4Problem);
    const pProblem = document.createElement('p');
    pProblem.textContent = projectData.problem;
    finalBriefEl.appendChild(pProblem);
    
    // Success Criteria
    const h4Success = document.createElement('h4');
    h4Success.textContent = 'Success Criteria';
    finalBriefEl.appendChild(h4Success);
    const pSuccess = document.createElement('p');
    pSuccess.textContent = projectData.success;
    finalBriefEl.appendChild(pSuccess);
    
    // Key Challenges
    const h4Challenges = document.createElement('h4');
    h4Challenges.textContent = 'Key Challenges';
    finalBriefEl.appendChild(h4Challenges);
    const olChallenges = document.createElement('ol');
    projectData.challenges.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        olChallenges.appendChild(li);
    });
    finalBriefEl.appendChild(olChallenges);
    
    // Major Components
    const h4Components = document.createElement('h4');
    h4Components.textContent = `Major Components (${projectData.decompositionType} decomposition)`;
    finalBriefEl.appendChild(h4Components);
    const preComponents = document.createElement('pre');
    preComponents.textContent = componentsFormatted;
    finalBriefEl.appendChild(preComponents);
    
    // Strategy
    const h4Strategy = document.createElement('h4');
    h4Strategy.textContent = `Starting Strategy: ${capitalizeStrategy(projectData.strategy)}`;
    finalBriefEl.appendChild(h4Strategy);
    const pStrategy = document.createElement('p');
    pStrategy.textContent = getStrategyDescription(projectData.strategy);
    finalBriefEl.appendChild(pStrategy);
    
    // Tickets
    const h4Tickets = document.createElement('h4');
    h4Tickets.textContent = 'Initial JIRA Tickets to Create';
    finalBriefEl.appendChild(h4Tickets);
    
    projectData.tickets.forEach((ticket, i) => {
        const ticketCard = document.createElement('div');
        ticketCard.className = 'ticket-card';
        ticketCard.id = `ticket-${i}`;
        ticketCard.style.cssText = 'margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-tertiary); border-left: 3px solid var(--teal); border-radius: 0.25rem; position: relative;';
        
        const h4Ticket = document.createElement('h4');
        h4Ticket.style.cssText = 'margin-top: 0; color: var(--teal-light);';
        h4Ticket.textContent = `🎫 ${ticket.title || 'Untitled Ticket'}`;
        ticketCard.appendChild(h4Ticket);
        
        const pDesc = document.createElement('p');
        pDesc.style.cssText = 'margin: 0.5rem 0 1rem 0; color: var(--text-secondary);';
        pDesc.textContent = ticket.description || 'No description provided';
        ticketCard.appendChild(pDesc);
        
        const statusSpan = document.createElement('span');
        statusSpan.id = `status-${i}`;
        statusSpan.style.cssText = 'margin-left: 0.5rem; font-size: 0.875rem;';
        ticketCard.appendChild(statusSpan);
        
        finalBriefEl.appendChild(ticketCard);
    });
    
    // Create all button
    const createAllBtn = document.createElement('button');
    createAllBtn.id = 'create-all-btn';
    createAllBtn.style.cssText = 'margin: 1rem 0; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.2s;';
    createAllBtn.textContent = '🚀 Create in JIRA';
    createAllBtn.onclick = createAllTickets;
    finalBriefEl.appendChild(createAllBtn);
    
    const batchStatus = document.createElement('div');
    batchStatus.id = 'batch-status';
    batchStatus.style.cssText = 'margin: 1rem 0; font-size: 0.875rem;';
    finalBriefEl.appendChild(batchStatus);
    
    // Generated date
    const pDate = document.createElement('p');
    pDate.style.cssText = 'margin-top: 2rem; color: var(--text-secondary); font-size: 0.875rem;';
    const em = document.createElement('em');
    em.textContent = `Generated: ${date}`;
    pDate.appendChild(em);
    finalBriefEl.appendChild(pDate);
}

function capitalizeStrategy(strategy) {
    const names = {
        spike: 'Investigation First',
        skeleton: 'Proof of Concept',
        dependency: 'Foundation First',
        risk: 'Highest Impact First',
        value: 'Quick Win First',
        rice: 'Impact Scoring'
    };
    return names[strategy] || strategy;
}

function getStrategyDescription(strategy) {
    const descriptions = {
        skeleton: 'Build the simplest end-to-end implementation to prove the architecture works.',
        risk: 'Tackle the biggest technical uncertainty or risk first to fail fast or build confidence.',
        value: 'Deliver the smallest feature that provides immediate value to users.'
    };
    return descriptions[strategy] || '';
}

async function createTicketInJira(index) {
    const ticket = projectData.tickets[index];
    const statusEl = document.getElementById(`status-${index}`);
    const btnEl = document.querySelector(`#ticket-${index} .jira-create-btn`);
    
    if (!ticket.title) {
        statusEl.textContent = '⚠️ Title required';
        statusEl.style.color = 'var(--danger)';
        return;
    }
    
    statusEl.textContent = '⏳ Opening JIRA...';
    statusEl.style.color = 'var(--text-secondary)';
    btnEl.disabled = true;
    btnEl.style.opacity = '0.5';
    
    try {
        // Get JIRA settings
        const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
        const settings = await browserAPI.storage.sync.get(['jiraDomain', 'jiraProject', 'jiraIssueType']);
        
        if (!settings.jiraDomain || !settings.jiraProject) {
            throw new Error('JIRA settings not configured. Please configure in extension options.');
        }
        
        // Clean domain (remove https:// if present)
        const domain = settings.jiraDomain.replace(/^https?:\/\//, '');
        
        // Build JIRA create URL with pre-filled data
        const params = new URLSearchParams();
        params.append('pid', settings.jiraProject);
        
        if (settings.jiraIssueType) {
            params.append('issuetype', settings.jiraIssueType);
        }
        
        params.append('summary', ticket.title);
        
        if (ticket.description) {
            params.append('description', ticket.description);
        }
        
        // Open JIRA create issue page in new tab
        const jiraUrl = `https://${domain}/secure/CreateIssueDetails!init.jspa?${params.toString()}`;
        await browserAPI.tabs.create({ url: jiraUrl });
        
        statusEl.textContent = '✅ Opened in JIRA';
        statusEl.style.color = 'var(--success)';
        btnEl.textContent = 'Opened!';
        btnEl.style.background = 'var(--success)';
    } catch (error) {
        console.error('Failed to open JIRA:', error);
        statusEl.textContent = `❌ ${error.message}`;
        statusEl.style.color = 'var(--danger)';
        btnEl.disabled = false;
        btnEl.style.opacity = '1';
    }
}

async function createAllTickets() {
    const btnEl = document.getElementById('create-all-btn');
    const statusEl = document.getElementById('batch-status');
    
    if (projectData.tickets.length === 0) {
        statusEl.textContent = '⚠️ No tickets to create';
        statusEl.style.color = 'var(--danger)';
        return;
    }
    
    btnEl.disabled = true;
    btnEl.style.opacity = '0.5';
    statusEl.textContent = '⏳ Opening JIRA for each ticket...';
    statusEl.style.color = 'var(--text-secondary)';
    
    try {
        // Get JIRA settings
        const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
        const settings = await browserAPI.storage.sync.get(['jiraDomain', 'jiraProject', 'jiraIssueType']);
        
        if (!settings.jiraDomain || !settings.jiraProject) {
            throw new Error('JIRA settings not configured. Please configure in extension options.');
        }
        
        // Clean domain (remove https:// if present)
        const domain = settings.jiraDomain.replace(/^https?:\/\//, '');
        
        // Open a JIRA tab for each ticket
        for (let i = 0; i < projectData.tickets.length; i++) {
            const ticket = projectData.tickets[i];
            
            const params = new URLSearchParams();
            params.append('pid', settings.jiraProject);
            
            if (settings.jiraIssueType) {
                params.append('issuetype', settings.jiraIssueType);
            }
            
            params.append('summary', ticket.title);
            
            if (ticket.description) {
                params.append('description', ticket.description);
            }
            
            const jiraUrl = `https://${domain}/secure/CreateIssueDetails!init.jspa?${params.toString()}`;
            await browserAPI.tabs.create({ url: jiraUrl, active: i === 0 });
            
            // Update individual ticket status
            const statusSpan = document.getElementById(`status-${i}`);
            const btnElement = document.querySelector(`#ticket-${i} .jira-create-btn`);
            
            if (statusSpan && btnElement) {
                statusSpan.textContent = '✅ Opened in JIRA';
                statusSpan.style.color = 'var(--success)';
                btnElement.textContent = 'Opened!';
                btnElement.style.background = 'var(--success)';
                btnElement.disabled = true;
            }
            
            // Small delay between opening tabs to avoid browser blocking
            if (i < projectData.tickets.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        statusEl.textContent = `✅ Opened ${projectData.tickets.length} JIRA tabs!`;
        statusEl.style.color = 'var(--success)';
        btnEl.textContent = 'All Opened!';
        btnEl.style.background = 'var(--success)';
    } catch (error) {
        console.error('Failed to open JIRA tickets:', error);
        statusEl.textContent = `❌ ${error.message}`;
        statusEl.style.color = 'var(--danger)';
        btnEl.disabled = false;
        btnEl.style.opacity = '1';
    }
}

function downloadBrief() {
    const markdown = generateMarkdownBrief();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().split('T')[0];
    a.download = `project-brief-${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateMarkdownBrief() {
    const date = new Date().toLocaleDateString();
    const componentsFormatted = projectData.components.map((c, i) => `${i + 1}. ${c}`).join('\n');
    const challengesFormatted = projectData.challenges.map((c, i) => `${i + 1}. ${c}`).join('\n');
    const ticketsFormatted = projectData.tickets.map((ticket, i) => 
        `### Ticket ${i + 1}: ${ticket.title || 'Untitled'}\n${ticket.description || 'No description'}\n`
    ).join('\n');
    
    return `# Project Planning Brief

## Problem Statement
${projectData.problem}

## Success Criteria
${projectData.success}

## Key Challenges
${challengesFormatted}

## Major Components (${projectData.decompositionType} decomposition)
${componentsFormatted}

## Starting Strategy: ${capitalizeStrategy(projectData.strategy)}
${getStrategyDescription(projectData.strategy)}

## Initial JIRA Tickets to Create
${ticketsFormatted}

---
*Generated: ${date}*
`;
}

function resetWizard() {
    if (confirm('Are you sure you want to start over? This will clear all your inputs.')) {
        location.reload();
    }
}

function showReference(topic) {
    alert('Reference sections coming soon! For now, check out the markdown version for full details.');
}

// Landing Page: Time Display and Navigation
function initLandingPage() {
    const landingPage = document.getElementById('landingPage');
    const planningWizard = document.getElementById('planningWizard');
    const dayDisplay = document.getElementById('dayDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    const newProjectBtn = document.getElementById('newProjectBtn');
    const keepWorkingBtn = document.getElementById('keepWorkingBtn');
    const workLinksBox = document.getElementById('workLinksBox');

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        
        // Update day display with full date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayName = days[now.getDay()];
        const monthName = months[now.getMonth()];
        const date = now.getDate();
        const year = now.getFullYear();
        
        // Add ordinal suffix (st, nd, rd, th)
        let suffix = 'th';
        if (date % 10 === 1 && date !== 11) suffix = 'st';
        else if (date % 10 === 2 && date !== 12) suffix = 'nd';
        else if (date % 10 === 3 && date !== 13) suffix = 'rd';
        
        dayDisplay.textContent = `${dayName} ${monthName} ${date}${suffix} ${year}`;
    }

    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);

    // Handle New Project button click
    newProjectBtn.addEventListener('click', () => {
        landingPage.classList.add('hidden');
        planningWizard.classList.remove('hidden');
    });

    // Handle Back to Home button click
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    backToHomeBtn.addEventListener('click', () => {
        planningWizard.classList.add('hidden');
        landingPage.classList.remove('hidden');
    });

    // Handle Keep Working button click
    keepWorkingBtn.addEventListener('click', () => {
        workLinksBox.classList.toggle('visible');
    });
}

// Handle Priorities
function initPriorities() {
    const prioritiesForm = document.getElementById('prioritiesForm');
    const pinnedPriorities = document.getElementById('pinnedPriorities');
    const prioritiesList = document.getElementById('prioritiesList');
    const unpinBtn = document.getElementById('unpinBtn');

    // Load saved priorities on page load
    function loadPriorities() {
        const saved = localStorage.getItem('todaysPriorities');
        if (saved) {
            const priorities = JSON.parse(saved);
            const savedDate = localStorage.getItem('prioritiesDate');
            const today = new Date().toDateString();
            
            // Only show if they're from today
            if (savedDate === today) {
                displayPriorities(priorities);
                // Pre-fill form
                document.getElementById('priority1').value = priorities[0] || '';
                document.getElementById('priority2').value = priorities[1] || '';
                document.getElementById('priority3').value = priorities[2] || '';
            }
        }
    }

    function displayPriorities(priorities) {
        prioritiesList.innerHTML = '';
        priorities.forEach(priority => {
            if (priority.trim()) {
                const li = document.createElement('li');
                li.textContent = priority;
                prioritiesList.appendChild(li);
            }
        });
        pinnedPriorities.classList.add('visible');
    }

    prioritiesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const priorities = [
            document.getElementById('priority1').value.trim(),
            document.getElementById('priority2').value.trim(),
            document.getElementById('priority3').value.trim()
        ];
        
        // Save to localStorage
        localStorage.setItem('todaysPriorities', JSON.stringify(priorities));
        localStorage.setItem('prioritiesDate', new Date().toDateString());
        
        displayPriorities(priorities);
        document.getElementById('workLinksBox').classList.remove('visible');
    });

    unpinBtn.addEventListener('click', () => {
        pinnedPriorities.classList.remove('visible');
        localStorage.removeItem('todaysPriorities');
        localStorage.removeItem('prioritiesDate');
    });

    // Load priorities on page load
    loadPriorities();
}

// Define quick ticket creation handler as a function to call after jira-api.js loads
function initQuickTicketForm() {
    const quickTicketForm = document.getElementById('quickTicketForm');
    quickTicketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const statusEl = document.getElementById('quickTicketStatus');
        const submitBtn = quickTicketForm.querySelector('button[type="submit"]');
        const title = document.getElementById('quickTicketTitle').value.trim();
        const description = document.getElementById('quickTicketDesc').value.trim();
        
        if (!title) {
            statusEl.textContent = '⚠️ Title required';
            statusEl.style.color = 'var(--danger)';
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Opening JIRA...';
        statusEl.textContent = '⏳ Opening JIRA...';
        statusEl.style.color = 'var(--text-secondary)';
        
        try {
            // Get JIRA settings
            const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
            const settings = await browserAPI.storage.sync.get(['jiraDomain', 'jiraProject', 'jiraIssueType']);
            
            if (!settings.jiraDomain || !settings.jiraProject) {
                throw new Error('JIRA settings not configured. Please configure in extension options.');
            }
            
            // Clean domain (remove https:// if present)
            const domain = settings.jiraDomain.replace(/^https?:\/\//, '');
            
            // Build JIRA create URL with pre-filled data
            // Using CreateIssueDetails which better supports pre-filling fields
            const params = new URLSearchParams();
            params.append('pid', settings.jiraProject);
            
            if (settings.jiraIssueType) {
                params.append('issuetype', settings.jiraIssueType);
            }
            
            params.append('summary', title);
            
            if (description) {
                params.append('description', description);
            }
            
            // Use CreateIssueDetails!init.jspa for better parameter support
            const jiraUrl = `https://${domain}/secure/CreateIssueDetails!init.jspa?${params.toString()}`;
            await browserAPI.tabs.create({ url: jiraUrl });
            
            // Show success
            statusEl.textContent = '✅ Opened JIRA in new tab';
            statusEl.style.color = 'var(--success)';
            
            // Reset form
            document.getElementById('quickTicketTitle').value = '';
            document.getElementById('quickTicketDesc').value = '';
            submitBtn.textContent = 'Create in JIRA';
            submitBtn.disabled = false;
            
            // Auto-hide status after 3 seconds
            setTimeout(() => {
                statusEl.textContent = '';
            }, 3000);
        } catch (error) {
            console.error('Failed to open JIRA:', error);
            statusEl.textContent = `❌ ${error.message}`;
            statusEl.style.color = 'var(--danger)';
            submitBtn.textContent = 'Create in JIRA';
            submitBtn.disabled = false;
        }
    });
}

// Initialize wizard event listeners (needed for CSP compliance - can't use onclick)
function initWizardEventListeners() {
    // Use event delegation for dynamically added elements
    document.body.addEventListener('click', (e) => {
        // Use closest() to find the element with data-action even if clicking on children
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        
        // Understanding yes/no buttons
        if (action === 'understand-yes') answerUnderstanding('yes');
        if (action === 'understand-no') answerUnderstanding('no');
        
        // Step completion buttons
        if (action === 'complete-step') {
            const step = parseInt(target.dataset.step);
            completeStep(step);
        }
        
        // Decomposition selection
        if (action === 'select-decomposition') {
            selectDecomposition(target.dataset.value);
        }
        
        // Strategy selection
        if (action === 'select-strategy') {
            selectStrategy(target.dataset.value);
        }
        
        // Add ticket form
        if (action === 'add-ticket') addTicketForm();
        
        // Remove ticket
        if (action === 'remove-ticket') {
            const index = parseInt(target.dataset.index);
            removeTicket(index);
        }
        
        // Create single ticket in JIRA
        if (action === 'create-ticket') {
            const index = parseInt(target.dataset.index);
            createTicketInJira(index);
        }
        
        // Create all tickets
        if (action === 'create-all') createAllTickets();
        
        // Download brief
        if (action === 'download-brief') downloadBrief();
        
        // Reset wizard
        if (action === 'reset-wizard') resetWizard();
        
        // Show reference
        if (action === 'show-reference') {
            showReference(target.dataset.value);
            e.preventDefault(); // Prevent default for anchor tags
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLandingPage();
    initPriorities();
    initQuickTicketForm();
    initWizardEventListeners();
    
    // Make functions globally accessible for onclick handlers (needed for CSP in extensions)
    window.addTicketForm = addTicketForm;
    window.removeTicket = removeTicket;
    window.answerUnderstanding = answerUnderstanding;
    window.answerKnowWhere = answerKnowWhere;
    window.answerKnowPerson = answerKnowPerson;
    window.proceedFromUnderstanding = proceedFromUnderstanding;
    window.completeStep = completeStep;
    window.selectDecomposition = selectDecomposition;
    window.selectStrategy = selectStrategy;
    window.createTicketInJira = createTicketInJira;
    window.createAllTickets = createAllTickets;
    window.downloadBrief = downloadBrief;
    window.resetWizard = resetWizard;
    window.showReference = showReference;
    
    // Smooth scroll and active nav highlighting
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    const backToTopButton = document.getElementById('backToTop');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only prevent default for internal anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    const content = document.querySelector('.content');
    if (content) {
        content.addEventListener('scroll', () => {
            if (content.scrollTop > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            if (content) {
                content.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
});
