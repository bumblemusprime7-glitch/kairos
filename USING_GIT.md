# Using Git — The Basics

This is a quick guide to the Git workflow we'll use on this project. It assumes you've never used Git before, so it starts from the very beginning.

## What is Git, actually?

Git tracks changes to files over time. GitHub is just a website that hosts a copy of your Git project ("repository", or "repo" for short) so a team can share it.

Think of it like this:
- Your **repo** is the whole project folder, with its full history of changes.
- A **commit** is a saved snapshot of the project at a point in time, with a message describing what changed.
- A **branch** is an independent line of work — a copy of the project you can edit without touching anyone else's work.
- A **pull request** (sometimes called a "merge request") is a request to merge your branch's changes into the main project, so someone can review it first.

## One-time setup

Tell Git who you are (only needed once per computer):

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## Getting the project (cloning)

You only do this once, to get a local copy of the repo:

```bash
git clone https://github.com/bumblemusprime7-glitch/kairos.git
cd kairos
```

## The everyday workflow

### 1. Make sure you're up to date

Before starting any new work, get the latest changes from GitHub:

```bash
git checkout main
git pull
```

### 2. Create a new branch for your work

Never work directly on `main`. Always make a branch for whatever feature or fix you're working on:

```bash
git checkout -b feature/chat-window
```

Naming tip: use short, descriptive branch names like `feature/login-page`, `fix/socket-disconnect-bug`, `chore/cleanup-css`.

### 3. Make your changes

Edit files as normal in your editor. Git notices what's changed but does nothing until you tell it to.

Check what you've changed at any time with:

```bash
git status
```

### 4. Stage and commit your changes

"Staging" means picking which changed files you want to include in your next commit.

```bash
git add .
```

`.` means "everything I changed". You can also stage individual files, e.g. `git add index.html`.

Then save a snapshot with a message describing what you did:

```bash
git commit -m "Add chat window UI"
```

Write commit messages in the present tense, like an instruction: "Add X", "Fix Y", "Update Z".

### 5. Push your branch to GitHub

This uploads your branch (and its commits) to GitHub so others can see it:

```bash
git push -u origin feature/chat-window
```

The `-u` is only needed the first time you push a new branch — after that, `git push` alone is enough.

### 6. Open a Pull Request (PR)

On GitHub:
1. Go to the repo page — it will usually show a banner "Compare & pull request" for your recently pushed branch. Click it.
2. Write a short title and description of what your branch does.
3. Click **Create pull request**.

Your collaborator (or you, reviewing theirs) can then look over the code, leave comments, and once it looks good, click **Merge pull request**. This brings your branch's changes into `main`.

### 7. Clean up

After your PR is merged, switch back to `main`, pull the merged changes, and delete the old branch:

```bash
git checkout main
git pull
git branch -d feature/chat-window
```

## A few things that will save you pain

- **Commit often.** Small commits are easier to understand and undo than one giant commit.
- **Pull before you push.** If someone else merged changes to `main` while you were working, get those changes into your branch before pushing:
  ```bash
  git checkout main
  git pull
  git checkout feature/chat-window
  git merge main
  ```
- **Never commit secrets.** API keys, passwords, `.env` files — don't add these to Git. If unsure, ask first.
- **If you see a merge conflict**, don't panic — it just means Git couldn't automatically combine two changes to the same lines. Git will mark the conflicting section in the file like this:
  ```
  <<<<<<< HEAD
  your version
  =======
  their version
  >>>>>>> main
  ```
  Edit the file to keep the correct version (or a combination), remove the `<<<<<<<`, `=======`, `>>>>>>>` markers, then `git add` the file and `git commit` to finish the merge.

## Quick reference

| Command | What it does |
|---|---|
| `git status` | Shows what's changed, staged, or untracked |
| `git add .` | Stages all changed files |
| `git commit -m "message"` | Saves a snapshot with a message |
| `git push` | Uploads your commits to GitHub |
| `git pull` | Downloads the latest changes from GitHub |
| `git checkout -b name` | Creates and switches to a new branch |
| `git checkout name` | Switches to an existing branch |
| `git branch` | Lists your local branches |
| `git log` | Shows commit history |

When in doubt, `git status` is your friend — run it often to see where you stand.
