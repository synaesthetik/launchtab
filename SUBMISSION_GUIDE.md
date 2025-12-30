# Mozilla Add-ons Submission Guide

## Pre-Submission Checklist

### 1. Generate Icons
1. Open `icons/generate-icons.html` in your browser
2. Click each "Download" button to save the three icon files
3. Save them in the `icons/` directory with the exact filenames:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

### 2. Create ZIP Package
Run this command from the `launchtab` directory:
```bash
zip -r launchtab.zip \
  manifest.json \
  project-management-runbook.html \
  options.html \
  options.js \
  popup.html \
  popup.js \
  jira-api.js \
  icons/icon16.png \
  icons/icon48.png \
  icons/icon128.png \
  README.md
```

Or use the included script:
```bash
chmod +x package.sh
./package.sh
```

## Mozilla Submission Process

### 1. Create Mozilla Account
- Go to https://addons.mozilla.org
- Sign up or log in

### 2. Submit Extension
1. Visit https://addons.mozilla.org/developers/addon/submit/distribution
2. Choose "On your own" (self-distributed, not listed publicly)
3. Upload `launchtab.zip`
4. Fill in the required information:
   - **Name**: LaunchTab
   - **Summary**: Project planning wizard with JIRA integration for your new tab
   - **Description**: Interactive stream-of-consciousness project planning tool that helps break down complex projects and create JIRA tickets directly from your browser.
   - **Categories**: Productivity, Developer Tools
   - **Support email**: your-email@example.com
   - **Privacy Policy**: This extension stores JIRA credentials locally using browser.storage.sync. No data is sent to any third party except your configured JIRA instance.

### 3. Automated Review
- Mozilla will automatically scan and sign your extension
- This typically takes 5-15 minutes
- You'll receive an email when it's ready

### 4. Download Signed Extension
- Once approved, download the signed `.xpi` file
- Install it in Firefox by dragging the `.xpi` file to `about:addons`

### 5. Updates
For future updates:
1. Increment the version in `manifest.json`
2. Re-package and re-submit
3. Mozilla will auto-approve if no issues detected

## Post-Installation

After installing the signed extension:
1. Open Firefox and create a new tab (your planner will appear)
2. Click the extension icon → "Configure JIRA"
3. Enter your JIRA credentials:
   - Domain: `yourcompany.atlassian.net` (without https://)
   - Email: your JIRA email
   - API Token: Get from https://id.atlassian.com/manage-profile/security/api-tokens
   - Project Key: e.g., "DS"
   - Issue Type: e.g., "Task" or "Story"
4. Click "Test JIRA Connection" to verify
5. Start planning!

## Troubleshooting

**Icons not showing**: Make sure all three PNG files are in the `icons/` directory before zipping

**ZIP validation fails**: Ensure manifest.json is at the root of the ZIP, not in a subdirectory

**Auto-signing rejected**: Check the email for specific issues (usually missing icons or invalid manifest)

**Already signed elsewhere**: If you need to update the extension ID, you can change it in manifest.json under `browser_specific_settings.gecko.id`
