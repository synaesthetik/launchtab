#!/bin/bash

# Package LaunchTab extension for Mozilla submission

echo "🎁 Packaging LaunchTab extension..."

# Check if icons exist
if [ ! -f "icons/icon16.png" ] || [ ! -f "icons/icon48.png" ] || [ ! -f "icons/icon128.png" ]; then
    echo "⚠️  Warning: Icon files not found!"
    echo "Please generate icons first:"
    echo "1. Open icons/generate-icons.html in your browser"
    echo "2. Download all three icon files"
    echo "3. Save them in the icons/ directory"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Remove old package if exists
rm -f launchtab.zip

# Create ZIP package
zip -r launchtab.zip \
  manifest.json \
  project-management-runbook.html \
  options.html \
  options.js \
  popup.html \
  popup.js \
  jira-api.js \
  README.md \
  icons/*.png 2>/dev/null

echo "✅ Package created: launchtab.zip"
echo ""
echo "Next steps:"
echo "1. Go to https://addons.mozilla.org/developers/addon/submit/distribution"
echo "2. Choose 'On your own' (self-distributed)"
echo "3. Upload launchtab.zip"
echo "4. Wait for automatic signing (~5-15 minutes)"
echo "5. Download and install the signed .xpi file"
echo ""
echo "See SUBMISSION_GUIDE.md for detailed instructions."
