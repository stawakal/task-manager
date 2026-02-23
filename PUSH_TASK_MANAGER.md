# Push Task Manager to GitHub

Run these commands in Terminal (from the task-manager folder):

```bash
cd /Users/shahedatawakalyar/cs-portfolio/projects/task-manager

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Upgrade to modern React app with Kanban, Calendar, auth"

# Connect to GitHub (if first time)
git remote remove origin 2>/dev/null
git remote add origin https://github.com/stawakal/task-manager.git

# Push
git branch -M main
git push -u origin main
```

If you get "failed to push" because the remote has different history, use:
```bash
git push -u origin main --force
```
(Only use --force if you're sure you want to overwrite what's on GitHub)
