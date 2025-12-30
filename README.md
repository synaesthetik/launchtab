# LaunchTab - Browser Extension

A browser extension that helps you plan projects and create JIRA tickets directly from your new tab page.

## Features

- 🎯 Stream-of-consciousness project planning wizard
- 📋 Structured JIRA ticket creation
- 🔗 Direct JIRA API integration
- 💾 Secure credential storage
- 🌓 Dark theme interface
- ⏰ Time and date display
- ✅ Daily priorities tracker

## Installation

### Chrome/Edge

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `launchtab` folder
5. The extension will appear in your extensions list

### Firefox

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the `pm-guidebook` folder and select `manifest.json`
4. The extension will be loaded temporarily (until Firefox restarts)

## Configuration

1. Click the extension icon in your browser toolbar
2. Click "Configure JIRA"
3. Enter your JIRA credentials:
   - **JIRA Domain**: Your Atlassian domain (e.g., `yourcompany.atlassian.net`)
   - **Email**: Your Atlassian account email
   - **API Token**: Generate one at [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - **Project Key**: Default project for tickets (e.g., `DS`, `ENG`)
   - **Issue Type**: Default type (Task, Story, Bug)
4. Click "Test JIRA Connection" to verify
5. Save your settings

## Usage

### New Tab Page

Every new tab will open the LaunchTab planner.

### Planning Wizard

1. **Step 0**: Check if you have enough context
2. **Step 1**: Describe the problem and success criteria
3. **Step 2**: List your 3 biggest challenges
4. **Step 3**: Break down into components
5. **Step 4**: Choose your starting strategy
6. **Step 5**: Create JIRA tickets with title and description
7. **Step 6**: Review and export your plan

### Creating JIRA Tickets

After completing the wizard:
- Each ticket has a "Create in JIRA" button
- Click to create the ticket directly in your configured JIRA project
- Tickets are created with the title and description you provided
- View the created ticket link after successful creation

## Security

- Credentials are stored securely in Chrome's sync storage
- API tokens are never exposed in the UI (password field)
- All API calls use HTTPS
- No data is sent to third-party servers (direct JIRA API calls only)

## Files Structure

```
launchtab/
├── manifest.json                    # Extension configuration
├── project-management-runbook.html  # Main planner page (new tab)
├── options.html                     # Settings page
├── options.js                       # Settings logic
├── popup.html                       # Extension popup
├── popup.js                         # Popup logic
├── jira-api.js                      # JIRA API utilities
└── icons/                           # Extension icons (16, 48, 128px)
```

## TODO

- [ ] Add proper extension icons
- [ ] Add ticket status tracking
- [ ] Support for multiple JIRA projects
- [ ] Export/import planning templates

## Development

### Local Development

To modify the extension:

1. Make your changes to the files
2. Go to `chrome://extensions/` or `about:debugging` in Firefox
3. Click the refresh icon on the LaunchTab extension
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

**JIRA connection fails:**
- Verify your API token is correct
- Check that your email matches your Atlassian account
- Ensure your domain is correct (without `https://`)
- Confirm you have permission to create issues in the project

**Extension doesn't load:**
- Check the browser console for errors
- Verify all files are present in the folder
- Try removing and re-adding the extension

## License

Personal use project
