# LaunchTab - Browser Extension

A browser extension that helps you plan projects and create JIRA tickets directly from your new tab page.

## Features

- 🎯 Stream-of-consciousness project planning wizard
- 📋 Structured JIRA ticket creation
- 🔗 Opens pre-filled JIRA tickets in your browser
- 🧠 Research-backed planning strategies (Walking Skeleton, Risk-First, Value-First)
- 🌓 Dark theme interface
- ⏰ Time and date display
- 💾 Secure settings storage

## Design Philosophy: ADHD-Friendly Planning

LaunchTab is specifically designed to help overcome common ADHD obstacles in project planning:

### 🎯 Combat Decision Paralysis

- **Clear guidance at every step** - No blank pages to stare at
- **Concrete examples** - Shows you what "good enough" looks like
- **Time estimates** - Each step shows how long it should take (⏱️ 3-5 min)
- **Strategic reassurance** - Reminds you that you can adjust as you learn

### 💪 Build Momentum

- **Visual progress tracking** - Sticky progress bar shows completed steps with animations
- **Encouraging messages** - "🎯 Nice! You've got clarity on the problem"
- **Small wins celebrated** - Each completed step gives positive feedback
- **Quick start focus** - Only asks for 1-3 initial tickets, not the whole plan

### 🧠 Reduce Cognitive Load

- **Coaching questions** - "What's frustrating you?" instead of "Describe the problem"
- **Think-out-loud prompts** - Encourages brain dumping without editing
- **Problem-solving frameworks** - Asks "What does this problem need most?" to help you reason through it
- **Anti-perfectionism messaging** - "Messy is fine. Incomplete is fine."

### 🚀 Lower Activation Energy

- **Simplified decisions** - 3 clear strategy options with "when to pick this" guidance
- **Break complex into simple** - Forces you to chunk work into manageable pieces
- **Action-oriented language** - Focuses on next steps, not analysis paralysis
- **No rabbit holes** - Warns against disappearing into endless research

The language throughout the wizard acts as your thinking partner, helping you work through planning anxiety and turn overwhelm into concrete action.

## Installation

[Pick a version to install here](https://addons.mozilla.org/en-US/developers/addon/df93f9d509504555a47e/versions)

## Installation for debugging

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the root of this repo and select `manifest.json`
4. The extension will be loaded temporarily (until Firefox restarts)

## Configuration

1. Click the extension icon in your browser toolbar
2. Click "Configure JIRA"
3. Enter your JIRA settings:
   - **JIRA Domain**: Your Atlassian domain (e.g., `yourcompany.atlassian.net`)
   - **Project ID**: Numeric project ID (e.g., `11861`)
   - **Issue Type ID**: Numeric issue type ID (e.g., `3` for Task)
4. Save your settings

**Finding your Project ID and Issue Type ID:**

- Project ID: Go to Project Settings → Details, or check the URL when creating an issue (pid=11861)
- Issue Type ID: Go to Project Settings → Issue Types, or inspect the issue type in JIRA settings

## Usage

### New Tab Page

Every new tab will open the LaunchTab planner.

### Planning Wizard

1. **Step 0**: Check if you have enough context
2. **Step 1**: Define the problem with clear WHO/WHAT/WHY framework
3. **Step 2**: Identify constraints using Theory of Constraints
4. **Step 3**: Break down into components/actions/flow stages
5. **Step 4**: Choose your starting strategy (Walking Skeleton, Risk-First, or Value-First)
6. **Step 5**: Create actionable JIRA tickets with SMART criteria
7. **Step 6**: Review your plan and next steps

### Creating JIRA Tickets

After completing the wizard:

- Click the "🚀 Create in JIRA" button to open all tickets in your browser
- Each ticket opens in a new tab with pre-filled title and description
- Review and submit each ticket in your JIRA instance
- Works with SSO and Okta-protected JIRA instances

## Security

- Settings are stored locally in Firefox's storage API
- No API tokens or credentials required
- JIRA integration uses URL parameters to open pre-filled tickets
- You authenticate directly with your JIRA instance in your browser
- No data is sent to third-party servers

## Files Structure

```
launchtab/
├── manifest.json                    # Extension configuration
├── project-management-runbook.html  # Main planner page (new tab)
├── runbook.js                       # Main application logic
├── options.html                     # Settings page
├── options.js                       # Settings logic
├── popup.html                       # Extension popup
├── popup.js                         # Popup logic
├── jira-api.js                      # JIRA utilities
└── icons/                           # Extension icons (16, 48, 128px)
```

## TODO

- [ ] Support for multiple JIRA projects
- [ ] Export/import planning templates
- [ ] Keyboard shortcuts for common actions
- [ ] Auto-save wizard progress

## Development

### Local Development

To modify the extension:

1. Make your changes to the files
2. Go to `about:debugging#/runtime/this-firefox` in Firefox
3. Click the "Reload" button on the LaunchTab extension
4. Open a new tab to see your changes

### Releasing New Versions

LaunchTab uses GitHub Actions for automated releases to Mozilla Add-ons:

1. **Update version in manifest.json**:

   ```bash
   # Change "version": "1.0.0" to "1.0.1"
   vim manifest.json
   ```

2. **Commit and create version tag**:

   ```bash
   git add manifest.json
   git commit -m "Bump version to 1.0.1"
   git tag v1.0.1
   git push origin v1.0.1
   ```

3. **GitHub Actions automatically**:
   - Validates and builds the extension
   - Submits to Mozilla for signing (typically 5-15 minutes)
   - Creates a GitHub Release with the signed `.xpi` file
   - Users can install directly from GitHub Releases

### CI/CD Setup

For detailed CI/CD setup instructions (API credentials, workflow configuration, etc.), see [CI_CD_SETUP.md](CI_CD_SETUP.md).

**Requirements:**

- Mozilla Add-ons API credentials (get from https://addons.mozilla.org/developers/addon/api/key/)
- GitHub repository secrets: `WEB_EXT_API_KEY` and `WEB_EXT_API_SECRET`

**Workflows:**

- `validate.yml` - Runs on pull requests to validate the extension
- `release.yml` - Runs on version tags to build, sign, and release

## Troubleshooting

**JIRA tickets don't open correctly:**

- Verify your Project ID and Issue Type ID are numeric values
- Ensure your domain is correct (without `https://`)
- Make sure you're logged into your JIRA instance in Firefox
- Confirm you have permission to create issues in the project
- Check that pop-ups are allowed for your JIRA domain

**Extension doesn't load:**

- Check the browser console for errors
- Verify all files are present in the folder
- Try removing and re-adding the extension

## License

Personal use project
