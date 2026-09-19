# JARVIS AI Backend Server

Private Node.js AI backend for the JARVIS mobile voice assistant, powered by Google Gemini API.

## Features
- Ultra-low latency responses (~2-3s) using Google Gemini 3.6 Flash.
- Supports colloquial Tamil (Indian and Sri Lankan) and English.
- JWT Bearer Authentication for secure communication.
- Docker & Cloud-ready (Render, Railway, Fly.io).

---

## 🚀 1-Click Cloud Deployment (Render.com)

You can host this server **24/7 for FREE** on Render.com without keeping your laptop on.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/hackingk921-hue/jarvis-backend)

### Manual Steps on Render.com:
1. Log into [Render.com](https://render.com) using your GitHub account (`hackingk921-hue`).
2. Click **New +** → **Web Service**.
3. Connect the `jarvis-backend` repository.
4. Set the following details:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run prod`
   - **Plan**: `Free`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API Key
   - `GEMINI_MODEL`: `gemini-3.6-flash`
   - `JARVIS_LOGIN_ID`: `jarvis@owner.ai`
   - `JARVIS_PASSWORD_HASH`: `03260ecd502b591c86128ab247dbf384:22e8ddd224363b5a1d2c4139ae7b187db258effc0bf6ee0811cd1aedcf38e270c321481d8c06885403967ab32220fd1c1b7f4b226e5aacbe36d63d388ecb199d`
   - `TOKEN_SECRET`: `ca61bee63863a5027795ad145832bcc4e5c68312969f1279b89e73cc33cb1524`
   - `PORT`: `10000`
   - `ALLOWED_ORIGIN`: `*`
6. Click **Deploy Web Service**!
7. Render will provide a permanent URL, e.g.: `https://jarvis-api-xxxx.onrender.com`.

---

## ⚡ Railway Deployment

1. Go to [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select `jarvis-backend`.
4. Add the same Environment Variables listed above.
5. In Settings → Networking, click **Generate Domain** to get your public URL.

---

## 📱 Connecting to JARVIS Mobile App

1. Open JARVIS on your phone.
2. Tap the **Logout** icon at the top right (or on the Login screen).
3. In the **Server URL** box, paste your cloud URL:
   `https://jarvis-api-xxxx.onrender.com`
4. Enter credentials:
   - **ID**: `jarvis@owner.ai`
   - **Password**: `admin`
5. Tap **ENTER JARVIS**.

Your app is now 100% connected to the cloud 24/7!
