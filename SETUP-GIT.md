# Git Repository Setup

## Initial Setup

If you haven't initialized Git in this project directory yet, follow these steps:

### 1. Initialize Git Repository

```bash
git init
```

### 2. Add All Files

```bash
git add .
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: VRS Specialists website"
```

### 4. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `vrs-specialists` (or your preferred name)
4. **Do NOT** check "Initialize with README" (we already have files)
5. Click "Create repository"

### 5. Connect to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/vrs-specialists.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Future Updates

After making changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## Important Notes

- Never commit `.env.local` files (they're in `.gitignore`)
- Always test locally before pushing: `npm run build`
- Use descriptive commit messages

## Troubleshooting

**If you get "fatal: remote origin already exists"**:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/vrs-specialists.git
```

**If you need to check your current status**:
```bash
git status
```

**To see what files are tracked**:
```bash
git ls-files
```
