# Git deployment script for shared hosting
# Only if your host supports Git deployment

# 1. Initialize git in your project (if not done)
git init

# 2. Add deployment files
git add dist/adathplus/browser/*

# 3. Commit changes
git commit -m "Production build for deployment"

# 4. Add your hosting remote (replace with your host's Git URL)
# git remote add production https://yourusername@yourhost.com/git/yourapp.git

# 5. Push to production
# git push production main

# Note: Many shared hosts use different Git workflows
# Check your hosting provider's documentation