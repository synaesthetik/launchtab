# Project Management Runbook

A practical guide for breaking down work, prioritizing effectively, and executing successfully.

## Table of Contents

- [Core Principles](#core-principles)
- [Breaking Down Work](#breaking-down-work)
- [Determining What to Start With](#determining-what-to-start-with)
- [Execution Framework](#execution-framework)
- [Progress Tracking](#progress-tracking)
- [Common Pitfalls](#common-pitfalls)
- [References](#references)

---

## Core Principles

### 1. **Start with the End in Mind**

- Define clear success criteria before beginning work
- Understand the "why" behind every project
- Identify stakeholders and their needs early

### 2. **Make Work Visible**

- Track tasks explicitly (todo lists, kanban boards, issue trackers)
- Maintain a single source of truth
- Update status frequently and honestly

### 3. **Minimize Work in Progress (WIP)**

- Focus on completing items rather than starting many
- Limit concurrent tasks to 1-3 active items
- Finish before you start something new

### 4. **Iterate and Adapt**

- Plan to learn, not to be right the first time
- Gather feedback early and often
- Be willing to adjust course based on new information

---

## Breaking Down Work

### The Decomposition Hierarchy

```
Initiative/Epic
    ↓
User Stories / Features
    ↓
Tasks / Subtasks
    ↓
Implementation Steps
```

### Step 1: Understand the Complete Scope

**Questions to Ask:**

- What problem are we solving?
- Who benefits and how?
- What does "done" look like?
- What are the constraints (time, resources, dependencies)?
- What are the risks?

**Output:** A clear project brief or initiative description.

### Step 2: Identify Major Components (Epics/Features)

Break the initiative into 3-8 major logical pieces.

**Techniques:**

- **Domain decomposition**: By system component (frontend, backend, database, etc.)
- **Capability decomposition**: By user-facing feature
- **Technical layer decomposition**: By architectural layer
- **Workflow decomposition**: By process steps

**Example:**

```
Initiative: Implement user authentication system
├── Feature: User registration
├── Feature: Login/logout
├── Feature: Password reset
├── Feature: Session management
└── Feature: Security monitoring
```

### Step 3: Break Features into User Stories

Use the format: **"As a [user], I want [capability], so that [benefit]"**

**Characteristics of Good Stories (INVEST):**

- **I**ndependent: Can be worked on separately
- **N**egotiable: Details can be discussed
- **V**aluable: Delivers value to users
- **E**stimable: Team can estimate effort
- **S**mall: Completable in one iteration
- **T**estable: Clear acceptance criteria

### Step 4: Decompose into Tasks

Break each story into concrete, actionable tasks (2-8 hours each).

**Task Decomposition Pattern:**

1. **Research/Discovery** - Understand existing code, APIs, constraints
2. **Design** - Create technical design, API contracts, data models
3. **Implementation** - Write core functionality
4. **Testing** - Unit tests, integration tests
5. **Documentation** - Update docs, add comments
6. **Review/Refinement** - Code review, address feedback

**Example:**

```
Story: As a user, I want to register an account

Tasks:
- [ ] Research existing user table schema and validation patterns
- [ ] Design registration API endpoint specification
- [ ] Implement user model with validation
- [ ] Create registration endpoint
- [ ] Add password hashing and security
- [ ] Write unit tests for user model
- [ ] Write integration tests for registration flow
- [ ] Add rate limiting to prevent abuse
- [ ] Update API documentation
- [ ] Add monitoring/logging for registrations
```

### Step 5: Identify Dependencies

Map out what must happen before other work can start.

**Dependency Types:**

- **Finish-to-Start (FS)**: Task A must finish before B starts
- **Technical dependencies**: Shared code, APIs, infrastructure
- **Knowledge dependencies**: Learning required before implementation
- **External dependencies**: Third-party services, other teams

---

## Determining What to Start With

### Prioritization Framework: RICE Score

**RICE = (Reach × Impact × Confidence) / Effort**

- **Reach**: How many users/systems affected? (number)
- **Impact**: How much impact per user? (3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal)
- **Confidence**: How sure are you? (100%=high, 80%=medium, 50%=low)
- **Effort**: How much work? (person-months or story points)

Calculate RICE for each feature/story, then prioritize by highest score.

### The "First Things First" Decision Tree

```
START HERE
    ↓
Is there blocking uncertainty? ──YES──> Do spike/research first
    ↓ NO

Is there a critical dependency? ──YES──> Build foundation first
    ↓ NO

Can you deliver value early? ──YES──> Build vertical slice (MVP)
    ↓ NO

Does it reduce future risk? ──YES──> Prioritize it
    ↓ NO

Is it high value + low effort? ──YES──> Quick win - do it early
    ↓ NO

Follow RICE prioritization
```

### Key Starting Strategies

#### 1. **Spike for Unknowns**

When facing significant uncertainty, do a time-boxed investigation first.

- Time-box: 2-4 hours or 1-2 days max
- Deliverable: Decision document or proof-of-concept
- Goal: Reduce uncertainty enough to estimate properly

#### 2. **Walking Skeleton / Vertical Slice**

Build the thinnest possible end-to-end implementation early.

- Proves architecture works
- Identifies integration issues
- Enables early feedback
- Example: Simple "Hello World" through entire stack

#### 3. **Dependency-First Approach**

Start with work that unblocks the most other work.

- Build shared libraries/utilities first
- Set up infrastructure and CI/CD
- Define API contracts
- Create data models

#### 4. **Risk-First Approach**

Tackle the scariest/most uncertain parts early.

- Reduces project risk
- Allows time for course correction
- Builds team confidence

#### 5. **Value-First Approach**

Start with what delivers user value soonest.

- Gets feedback quickly
- Proves business value
- Builds stakeholder confidence

### Which Strategy to Use?

| Situation                                    | Recommended Approach    |
| -------------------------------------------- | ----------------------- |
| High uncertainty, unclear technical approach | **Spike**               |
| New project, unproven architecture           | **Walking Skeleton**    |
| Complex dependencies between components      | **Dependency-First**    |
| High-risk technical challenges               | **Risk-First**          |
| Need to prove value to stakeholders          | **Value-First**         |
| Balanced, well-understood project            | **RICE prioritization** |

---

## Execution Framework

### Daily Workflow

1. **Start of Day**

   - Review your todo list
   - Mark ONE item as in-progress
   - Ensure you have all context needed

2. **During Work**

   - Focus on completing the current item
   - Update status when blocked or need help
   - Document decisions and learnings

3. **End of Day**
   - Mark completed items as done
   - Update progress/blockers
   - Plan tomorrow's first task

### The "Definition of Done" Checklist

A task is complete when:

- [ ] Code is written and functions correctly
- [ ] Tests are written and passing
- [ ] Code is reviewed and approved
- [ ] Documentation is updated
- [ ] Changes are merged to main branch
- [ ] Feature is deployed/verified in target environment

_(Adjust based on your project standards)_

### Dealing with Blockers

When blocked:

1. **Document the blocker** clearly (what, why, who can help)
2. **Attempt self-unblocking** (15-30 min research)
3. **Ask for help** if still blocked
4. **Switch to another task** while waiting
5. **Follow up** to ensure blocker gets resolved

---

## Progress Tracking

### Metrics That Matter

1. **Velocity**: Work completed per time period

   - Track for estimation improvement
   - Don't use for individual performance measurement

2. **Cycle Time**: Time from starting to completing work

   - Shorter is better
   - Identifies bottlenecks

3. **Work in Progress (WIP)**: Current active tasks

   - Lower is better
   - Limit based on team size (often 1-2 per person)

4. **Completion Rate**: % of planned work completed
   - Indicates estimation accuracy
   - Helps with planning future iterations

### Update Cadence

- **Tasks**: Update when status changes (started, blocked, completed)
- **Daily**: Quick standup or async update
- **Weekly**: Review progress, adjust priorities
- **Per iteration/sprint**: Retrospect and plan next cycle

---

## Common Pitfalls

### ❌ **Starting Too Many Things**

**Problem**: Nothing gets finished, context switching kills productivity
**Solution**: Limit WIP to 1-3 items, finish before starting

### ❌ **Tasks Too Large**

**Problem**: No sense of progress, hard to track
**Solution**: Break down until tasks are <1 day of work

### ❌ **No Clear Acceptance Criteria**

**Problem**: Scope creep, unclear when "done"
**Solution**: Define success criteria upfront for every task

### ❌ **Skipping Research/Design**

**Problem**: Rework, wrong solution built
**Solution**: Spend 10-20% of time on design before coding

### ❌ **Perfectionism**

**Problem**: Over-engineering, never shipping
**Solution**: Define "good enough", iterate later

### ❌ **Ignoring Dependencies**

**Problem**: Blocked work, wasted effort
**Solution**: Map dependencies, start with foundational work

### ❌ **No Retrospection**

**Problem**: Repeating same mistakes
**Solution**: Regular retrospectives to improve process

---

## References

### Methodologies

- **Agile/Scrum**: Iterative development, sprints, user stories
- **Getting Things Done (GTD)**: Task management, context-based organization
- **Kanban**: Visualize workflow, limit WIP, continuous flow
- **Shape Up**: 6-week cycles, appetite-based planning, hill charts

### Books

- _The Lean Startup_ - Eric Ries (MVP, validated learning)
- _Getting Things Done_ - David Allen (Task management)
- _The Mythical Man-Month_ - Fred Brooks (Software project management classics)
- _Accelerate_ - Forsgren, Humble, Kim (DevOps and delivery metrics)
- _Shape Up_ - Ryan Singer (Product development cycles)

### Frameworks

- **MoSCoW Prioritization**: Must have, Should have, Could have, Won't have
- **Eisenhower Matrix**: Urgent/Important quadrant prioritization
- **RICE Scoring**: Reach, Impact, Confidence, Effort
- **Kano Model**: Feature satisfaction vs implementation
- **Value vs Effort Matrix**: 2×2 grid for quick prioritization

### Key Principles

- **YAGNI** (You Aren't Gonna Need It): Don't build what you don't need now
- **KISS** (Keep It Simple, Stupid): Simplest solution that works
- **DRY** (Don't Repeat Yourself): Avoid duplication
- **Pareto Principle**: 80% of value from 20% of features
- **Iterative Development**: Build → Measure → Learn → Repeat

---

## Quick Start Template

Use this when starting any new project:

### 1. Project Brief

```
Project: [Name]
Goal: [What success looks like]
Why: [Business/user value]
Timeline: [Target completion]
Stakeholders: [Who cares]
Constraints: [Limitations]
```

### 2. Initial Breakdown

```
Major Components:
1. [Component A]
2. [Component B]
3. [Component C]

Dependencies:
- [What must be done first]

Risks:
- [What could go wrong]
```

### 3. First Tasks

```
Immediate Next Steps:
[ ] [Research/spike task if needed]
[ ] [Set up basic infrastructure]
[ ] [Define MVP scope]
[ ] [Create detailed breakdown]
[ ] [Start first vertical slice]
```

---

## Adapting This Guide

This runbook is intentionally general. Adapt it to your context:

- Scale up/down based on project size
- Adjust terminology to match your team
- Add project-specific checklists
- Refine based on what works for you

**Remember**: The best process is the one your team will actually follow. Start simple, iterate, and improve.

---

_Last Updated: December 29, 2025_
