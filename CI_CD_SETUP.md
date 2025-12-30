# CI/CD Setup for Mozilla Add-on

This guide explains how to set up automated releases for your Firefox extension using GitHub Actions.

## Prerequisites

1. Your extension must be submitted to Mozilla at least once manually
2. You need API credentials from Mozilla

## Getting API Credentials

### 1. Generate API Keys from Mozilla
1. Go to https://addons.mozilla.org/developers/addon/api/key/
2. Click "Generate new credentials"
3. Copy the **JWT issuer** (this is your API key)
4. Copy the **JWT secret** (this is your API secret)
5. **Save these somewhere secure** - you won't be able to see the secret again

### 2. Add Secrets to GitHub
1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Add two new repository secrets:
   - `WEB_EXT_API_KEY` = Your JWT issuer
   - `WEB_EXT_API_SECRET` = Your JWT secret

## Workflow Files

Two GitHub Actions workflows have been created:

### 1. `validate.yml` (Runs on every push/PR)
- Lints the extension for errors
- Builds the extension package
- Uploads unsigned build as artifact
- Helps catch issues before release

### 2. `release.yml` (Runs on version tags)
- Builds and signs the extension
- Submits to Mozilla for auto-approval
- Creates GitHub release with signed .xpi file
- Only triggers when you push a version tag

## Release Process

### Manual Release (Current)
```bash
# 1. Update version in manifest.json
vim manifest.json  # Change "version": "1.0.0" to "1.0.1"

# 2. Commit the change
git add manifest.json
git commit -m "Bump version to 1.0.1"

# 3. Create and push tag
git tag v1.0.1
git push origin v1.0.1

# 4. GitHub Actions automatically:
#    - Builds extension
#    - Submits to Mozilla
#    - Gets it signed
#    - Creates GitHub release with .xpi file
```

### Automated Release (Future Enhancement)
You could add a tool like `release-please` or `semantic-release` to:
- Auto-increment version based on commit messages
- Generate changelogs
- Create tags automatically

## Channel Options

In `release.yml`, you can choose:

### Unlisted (Current Setting)
```yaml
--channel=unlisted
```
- Extension is not listed publicly on addons.mozilla.org
- You distribute the .xpi file yourself (via GitHub releases)
- Auto-approved by Mozilla (5-15 minutes)
- Best for personal/private tools

### Listed (Public)
```yaml
--channel=listed
```
- Extension appears in public Mozilla add-ons directory
- Users can find and install it from addons.mozilla.org
- May require manual review for major updates
- Better for tools you want to share widely

## Local Testing with web-ext

Install web-ext locally for testing:

```bash
npm install -g web-ext
```

Useful commands:

```bash
# Run extension in temporary Firefox profile
web-ext run

# Lint for errors
web-ext lint

# Build package
web-ext build

# Sign and submit (requires API keys)
web-ext sign --api-key=YOUR_KEY --api-secret=YOUR_SECRET
```

## Troubleshooting

**"Extension validation failed"**
- Run `web-ext lint` locally to catch errors before pushing
- Check the GitHub Actions logs for specific validation errors

**"API key invalid"**
- Verify secrets are set correctly in GitHub
- Make sure you copied the full JWT issuer and secret
- Regenerate credentials if needed at https://addons.mozilla.org/developers/addon/api/key/

**"Extension not found"**
- First submission must be manual through the website
- API can only be used for updates to existing extensions

**"Build failed - icons missing"**
- Ensure icons are committed to the repo
- Icons should be in `icons/` directory before building

## Version Numbering

Follow semantic versioning:
- **1.0.0** → **1.0.1**: Bug fixes
- **1.0.0** → **1.1.0**: New features (backwards compatible)
- **1.0.0** → **2.0.0**: Breaking changes

## Notes

- Mozilla auto-approves updates that pass automated validation
- Typical approval time: 5-15 minutes for unlisted
- Listed updates may take longer if flagged for manual review
- Always test locally with `web-ext run` before tagging a release
- The signed .xpi is automatically added to GitHub releases
