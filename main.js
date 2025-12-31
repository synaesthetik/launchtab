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

// Security: Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Ticket management functions
function addTicketForm() {
    ticketCounter++;
    const container = document.getElementById('ticketsContainer');
    const ticketCard = document.createElement('div');
    ticketCard.className = 'ticket-card';
    ticketCard.id = `ticket-${ticketCounter}`;
    
    // Build with DOM methods instead of innerHTML
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-ticket';
    removeBtn.onclick = () => removeTicket(ticketCounter);
    removeBtn.title = 'Remove ticket';
    removeBtn.textContent = '×';
    
    const ticketNum = document.createElement('span');
    ticketNum.className = 'ticket-number';
    ticketNum.textContent = `Ticket #${ticketCounter}`;
    
    const titleGroup = document.createElement('div');
    titleGroup.className = 'input-group';
    const titleLabel = document.createElement('label');
    titleLabel.htmlFor = `ticket-title-${ticketCounter}`;
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
    descLabel.htmlFor = `ticket-desc-${ticketCounter}`;
    descLabel.textContent = 'Description:';
    const descTextarea = document.createElement('textarea');
    descTextarea.id = `ticket-desc-${ticketCounter}`;
    descTextarea.rows = 4;
    descTextarea.placeholder = 'What needs to be done, why, and any relevant context...';
    descGroup.appendChild(descLabel);
    descGroup.appendChild(descTextarea);
    
    ticketCard.appendChild(removeBtn);
    ticketCard.appendChild(ticketNum);
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
    console.log('completeStep called with:', stepNum);
    
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
            console.log('Step 5 - collecting tickets');
            projectData.tickets = collectTickets();
            console.log('Collected tickets:', projectData.tickets);
            if (projectData.tickets.length === 0) {
                alert('Please add at least one ticket.');
                return;
            }
            console.log('Calling generateFinalBrief');
            try {
                generateFinalBrief();
                console.log('generateFinalBrief completed');
            } catch (error) {
                console.error('Error in generateFinalBrief:', error);
                alert('Error generating brief: ' + error.message);
            }
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
    const el = document.getElementById('problemSummary');
    el.innerHTML = '';
    
    const h4 = document.createElement('h4');
    h4.textContent = '📋 Your Problem Statement';
    
    const problemP = document.createElement('p');
    const problemStrong = document.createElement('strong');
    problemStrong.textContent = 'Problem: ';
    problemP.appendChild(problemStrong);
    problemP.appendChild(document.createTextNode(projectData.problem));
    
    const successP = document.createElement('p');
    const successStrong = document.createElement('strong');
    successStrong.textContent = 'Success Looks Like: ';
    successP.appendChild(successStrong);
    successP.appendChild(document.createTextNode(projectData.success));
    
    el.appendChild(h4);
    el.appendChild(problemP);
    el.appendChild(successP);
}

function displayComponentsSummary() {
    const el = document.getElementById('componentsSummary');
    el.innerHTML = '';
    
    const h4 = document.createElement('h4');
    h4.textContent = `🏗️ Your Major Components (${projectData.decompositionType} approach)`;
    
    const ul = document.createElement('ul');
    projectData.components.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        ul.appendChild(li);
    });
    
    el.appendChild(h4);
    el.appendChild(ul);
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
    guidanceEl.textContent = ''; // Clear previous content
    if (guidance) {
        guidanceEl.appendChild(guidance);
        guidanceEl.classList.add('open');
    }
}

function getStrategyGuidance(strategy) {
    const createGuidance = (emoji, title, origin, howTo, example, why) => {
        const container = document.createElement('div');
        container.className = 'admonition tip';
        
        const h4 = document.createElement('h4');
        h4.textContent = `${emoji} ${title}`;
        container.appendChild(h4);
        
        const originP = document.createElement('p');
        const originStrong = document.createElement('strong');
        originStrong.textContent = `From ${origin}:`;
        originP.appendChild(originStrong);
        originP.appendChild(document.createTextNode(' ' + howTo.quote));
        container.appendChild(originP);
        
        const howToP = document.createElement('p');
        const howToStrong = document.createElement('strong');
        howToStrong.textContent = howTo.title;
        howToP.appendChild(howToStrong);
        container.appendChild(howToP);
        
        const ul = document.createElement('ul');
        howTo.items.forEach(item => {
            const li = document.createElement('li');
            const strong = document.createElement('strong');
            strong.textContent = item.label + ':';
            li.appendChild(strong);
            li.appendChild(document.createTextNode(' ' + item.text));
            ul.appendChild(li);
        });
        container.appendChild(ul);
        
        const exampleP = document.createElement('p');
        const exampleStrong = document.createElement('strong');
        exampleStrong.textContent = 'Example:';
        exampleP.appendChild(exampleStrong);
        exampleP.appendChild(document.createTextNode(' ' + example));
        container.appendChild(exampleP);
        
        const whyP = document.createElement('p');
        const whyStrong = document.createElement('strong');
        whyStrong.textContent = 'Why this works:';
        whyP.appendChild(whyStrong);
        whyP.appendChild(document.createTextNode(' ' + why));
        container.appendChild(whyP);
        
        return container;
    };
    
    const guides = {
        spike: createGuidance(
            '🔬',
            'Spike: Reduce Uncertainty',
            'XP (Extreme Programming)',
            {
                quote: '"A spike solution is a very simple program to explore potential solutions."',
                title: 'How to run a spike:',
                items: [
                    { label: 'Time-box it', text: '2-4 hours max. Set a timer.' },
                    { label: 'Define the question', text: 'What specifically are you trying to learn?' },
                    { label: 'Throw away the code', text: 'It\'s research, not production.' },
                    { label: 'Document findings', text: 'What did you learn? What\'s the recommendation?' }
                ]
            },
            '"Can we sync Zendesk tickets to JIRA in near real-time? (3 hours)"',
            'Prevents building elaborate solutions to the wrong problem. Research shows teams waste 30-50% of effort on unnecessary features (Standish Group).'
        ),
        skeleton: createGuidance(
            '🦴',
            'Walking Skeleton: Prove It Early',
            'Alistair Cockburn',
            {
                quote: '"A Walking Skeleton is a tiny implementation of the system that performs a small end-to-end function."',
                title: 'How to build one:',
                items: [
                    { label: 'Simplest path', text: 'Pick one user story, implement minimally end-to-end' },
                    { label: 'Real infrastructure', text: 'Use actual APIs, databases, deployment—no mocks' },
                    { label: 'Ugly is fine', text: 'Hardcode values, skip validation, ignore edge cases' },
                    { label: 'Deploy it', text: 'Get it running in a real environment' }
                ]
            },
            '"Display one hardcoded ticket from JIRA on a dashboard page"',
            'De-risks technical decisions early. Studies show projects that validate architecture early have 2-3x higher success rates (Boehm\'s Cone of Uncertainty).'
        ),
        risk: createGuidance(
            '⚠️',
            'Risk-First: Attack Uncertainty',
            'Tom Gilb\'s Risk-Driven Development',
            {
                quote: '"If you don\'t actively attack the risks, the risks will actively attack you."',
                title: 'How to identify the riskiest part:',
                items: [
                    { label: 'Ask', text: 'What keeps me up at night about this project?' },
                    { label: 'Technical risk', text: '"I\'ve never integrated with this API before"' },
                    { label: 'Unknowns', text: '"I don\'t know if this architecture will scale"' },
                    { label: 'Dependencies', text: '"This relies on another team\'s unstable service"' }
                ]
            },
            '"Build proof-of-concept for real-time webhook processing at scale"',
            'Delays increase the cost of failure exponentially. Finding a fundamental problem in week 1 vs week 10 saves massive rework (Barry Boehm\'s research shows 100x cost increase for late-stage fixes).'
        )
    };
    return guides[strategy] || null;
}

function generateFinalBrief() {
    const date = new Date().toLocaleDateString();
    const componentsFormatted = projectData.components.map((c, i) => `${i + 1}. ${c}`).join('\n');
    
    const briefContainer = document.getElementById('finalBrief');
    briefContainer.textContent = ''; // Clear existing content
    
    // Title
    const h3 = document.createElement('h3');
    h3.textContent = '🎯 Project Planning Brief';
    briefContainer.appendChild(h3);
    
    // Problem Statement
    const h4Problem = document.createElement('h4');
    h4Problem.textContent = 'Problem Statement';
    briefContainer.appendChild(h4Problem);
    const pProblem = document.createElement('p');
    pProblem.textContent = projectData.problem;
    briefContainer.appendChild(pProblem);
    
    // Success Criteria
    const h4Success = document.createElement('h4');
    h4Success.textContent = 'Success Criteria';
    briefContainer.appendChild(h4Success);
    const pSuccess = document.createElement('p');
    pSuccess.textContent = projectData.success;
    briefContainer.appendChild(pSuccess);
    
    // Key Challenges
    const h4Challenges = document.createElement('h4');
    h4Challenges.textContent = 'Key Challenges';
    briefContainer.appendChild(h4Challenges);
    const olChallenges = document.createElement('ol');
    projectData.challenges.forEach(challenge => {
        const li = document.createElement('li');
        li.textContent = challenge;
        olChallenges.appendChild(li);
    });
    briefContainer.appendChild(olChallenges);
    
    // Major Components
    const h4Components = document.createElement('h4');
    h4Components.textContent = `Major Components (${projectData.decompositionType} decomposition)`;
    briefContainer.appendChild(h4Components);
    const preComponents = document.createElement('pre');
    preComponents.textContent = componentsFormatted;
    briefContainer.appendChild(preComponents);
    
    // Starting Strategy
    const h4Strategy = document.createElement('h4');
    h4Strategy.textContent = `Starting Strategy: ${capitalizeStrategy(projectData.strategy)}`;
    briefContainer.appendChild(h4Strategy);
    const pStrategy = document.createElement('p');
    pStrategy.textContent = getStrategyDescription(projectData.strategy);
    briefContainer.appendChild(pStrategy);
    
    // Initial JIRA Tickets
    const h4Tickets = document.createElement('h4');
    h4Tickets.textContent = 'Initial JIRA Tickets to Create';
    briefContainer.appendChild(h4Tickets);
    
    projectData.tickets.forEach((ticket, i) => {
        const ticketCard = document.createElement('div');
        ticketCard.className = 'ticket-card';
        ticketCard.id = `ticket-${i}`;
        ticketCard.style.cssText = 'margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-tertiary); border-left: 3px solid var(--teal); border-radius: 0.25rem; position: relative;';
        
        const h4Ticket = document.createElement('h4');
        h4Ticket.style.cssText = 'margin-top: 0; color: var(--teal-light);';
        h4Ticket.textContent = `🎫 ${ticket.title || 'Untitled Ticket'}`;
        ticketCard.appendChild(h4Ticket);
        
        const pTicket = document.createElement('p');
        pTicket.style.cssText = 'margin: 0.5rem 0 1rem 0; color: var(--text-secondary);';
        pTicket.textContent = ticket.description || 'No description provided';
        ticketCard.appendChild(pTicket);
        
        const btnCreate = document.createElement('button');
        btnCreate.className = 'jira-create-btn';
        btnCreate.style.cssText = 'padding: 0.5rem 1rem; background: var(--teal); color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; transition: all 0.2s;';
        btnCreate.textContent = 'Create in JIRA';
        btnCreate.onclick = () => createTicketInJira(i);
        ticketCard.appendChild(btnCreate);
        
        const spanStatus = document.createElement('span');
        spanStatus.id = `status-${i}`;
        spanStatus.style.cssText = 'margin-left: 0.5rem; font-size: 0.875rem;';
        ticketCard.appendChild(spanStatus);
        
        briefContainer.appendChild(ticketCard);
    });
    
    // Create All Button
    const btnCreateAll = document.createElement('button');
    btnCreateAll.id = 'create-all-btn';
    btnCreateAll.style.cssText = 'margin: 1rem 0; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.2s;';
    btnCreateAll.textContent = '🚀 Create All Tickets in JIRA';
    btnCreateAll.onclick = createAllTickets;
    briefContainer.appendChild(btnCreateAll);
    
    const divBatchStatus = document.createElement('div');
    divBatchStatus.id = 'batch-status';
    divBatchStatus.style.cssText = 'margin: 1rem 0; font-size: 0.875rem;';
    briefContainer.appendChild(divBatchStatus);
    
    // Next Actions
    const divAdmonition = document.createElement('div');
    divAdmonition.className = 'admonition';
    const h4Actions = document.createElement('h4');
    h4Actions.textContent = '📅 Next Actions';
    divAdmonition.appendChild(h4Actions);
    const ulChecklist = document.createElement('ul');
    ulChecklist.className = 'checklist';
    ['Copy this and clean it up with AI', 'Create these tickets in JIRA', 'Talk it through with someone', 'Start the first task', 'Update as you learn more'].forEach(action => {
        const li = document.createElement('li');
        li.textContent = action;
        ulChecklist.appendChild(li);
    });
    divAdmonition.appendChild(ulChecklist);
    briefContainer.appendChild(divAdmonition);
    
    // Generated timestamp
    const pGenerated = document.createElement('p');
    pGenerated.style.cssText = 'margin-top: 2rem; color: var(--text-secondary); font-size: 0.875rem;';
    const emGenerated = document.createElement('em');
    emGenerated.textContent = `Generated: ${date}`;
    pGenerated.appendChild(emGenerated);
    briefContainer.appendChild(pGenerated);
}

function capitalizeStrategy(strategy) {
    const names = {
        spike: 'Spike: Reduce Uncertainty',
        skeleton: 'Walking Skeleton: Prove It Early',
        risk: 'Risk-First: Attack Uncertainty'
    };
    return names[strategy] || strategy;
}

function getStrategyDescription(strategy) {
    const descriptions = {
        spike: 'Time-boxed investigation to answer key unknowns and validate the approach (XP Practice).',
        skeleton: 'Build the simplest end-to-end flow first, then add features (Cockburn\'s methodology).',
        risk: 'Tackle the scariest/most uncertain component first to fail fast or build confidence (Gilb\'s Risk-Driven Development).'
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
    
    statusEl.textContent = '⏳ Creating...';
    statusEl.style.color = 'var(--text-secondary)';
    btnEl.disabled = true;
    btnEl.style.opacity = '0.5';
    
    try {
        const result = await createJiraTicket(ticket.title, ticket.description);
        const ticketUrl = `https://${result.domain}/browse/${result.key}`;
        
        // Clear and rebuild status element with DOM methods
        statusEl.textContent = '✅ ';
        const link = document.createElement('a');
        link.href = ticketUrl;
        link.target = '_blank';
        link.style.cssText = 'color: var(--teal); text-decoration: underline;';
        link.textContent = result.key;
        statusEl.appendChild(link);
        
        btnEl.textContent = 'Created!';
        btnEl.style.background = 'var(--success)';
    } catch (error) {
        console.error('Failed to create ticket:', error);
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
    statusEl.textContent = '⏳ Creating tickets...';
    statusEl.style.color = 'var(--text-secondary)';
    
    try {
        const results = await createMultipleJiraTickets(
            projectData.tickets,
            (current, total) => {
                statusEl.textContent = `⏳ Creating ${current} of ${total} tickets...`;
            }
        );
        
        // Update individual ticket displays
        results.forEach((result, index) => {
            if (result.success) {
                const ticketUrl = `https://${result.domain}/browse/${result.key}`;
                const statusSpan = document.getElementById(`status-${index}`);
                const btnElement = document.querySelector(`#ticket-${index} .jira-create-btn`);
                
                if (statusSpan && btnElement) {
                    statusSpan.textContent = '✅ ';
                    const link = document.createElement('a');
                    link.href = ticketUrl;
                    link.target = '_blank';
                    link.style.cssText = 'color: var(--teal); text-decoration: underline;';
                    link.textContent = result.key;
                    statusSpan.appendChild(link);
                    btnElement.textContent = 'Created!';
                    btnElement.style.background = 'var(--success)';
                    btnElement.disabled = true;
                }
            }
        });
        
        const successCount = results.filter(r => r.success).length;
        statusEl.textContent = `✅ Created ${successCount} of ${projectData.tickets.length} tickets successfully!`;
        statusEl.style.color = 'var(--success)';
        btnEl.textContent = 'All Created!';
        btnEl.style.background = 'var(--success)';
    } catch (error) {
        console.error('Failed to create tickets:', error);
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

## Next Actions
- [ ] Copy this and clean it up with AI
- [ ] Create these tickets in JIRA
- [ ] Talk it through with someone
- [ ] Start the first task
- [ ] Update as you learn more

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
        // External links (http/https) will work normally
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

// Landing Page: Time Display and Navigation
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

// Handle Priorities
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
    workLinksBox.classList.remove('visible');
});

unpinBtn.addEventListener('click', () => {
    pinnedPriorities.classList.remove('visible');
    localStorage.removeItem('todaysPriorities');
    localStorage.removeItem('prioritiesDate');
});

// Load priorities on page load
loadPriorities();
