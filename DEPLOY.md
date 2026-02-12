# Deploy to Render — 3 Steps

Your app is ready. Do these 3 things to get a link you can share:

---

## Step 1: Create a GitHub repo

1. Go to **https://github.com/new**
2. Name it: `mood-recipes` (or anything)
3. Leave it **empty** (no README, no .gitignore)
4. Click **Create repository**

---

## Step 2: Push your code

Copy the commands GitHub shows you. They’ll look like this (use YOUR repo URL):

```bash
cd "/Users/anut/Cursor test"
git remote add origin https://github.com/YOUR_USERNAME/mood-recipes.git
git branch -M main
git push -u origin main
```

Paste and run them in your terminal. You’ll be asked to sign in to GitHub if needed.

---

## Step 3: Deploy on Render

1. Go to **https://render.com** and sign up (free)
2. Click **New +** → **Web Service**
3. Connect your GitHub and select the `mood-recipes` repo
4. Render will detect everything automatically — just click **Create Web Service**
5. Wait 2–3 minutes for the build to finish

---

## Done

Render will give you a URL like:

**https://mood-recipes-xxxx.onrender.com**

Share that link. Anyone can use it from anywhere.
