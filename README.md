# 🔍 DeepSearch — OSINT Username Search

Find anyone across 80+ platforms instantly. Real-time streaming results.

## Features

- 🔎 **81 Platforms** — Social, Gaming, Dev, Music, Design, Business, and more
- ⚡ **Real-Time Streaming** — Results appear instantly via SSE (Server-Sent Events)
- 🏷️ **Category Filters** — Filter by Social, Dev, Gaming, etc.
- 📊 **Stats Dashboard** — Total, found, not found, search time
- 🎯 **Click to Visit** — Click any found result to open the profile
- 🎨 **Dark OSINT Theme** — Futuristic, responsive UI

## Tech Stack

- **Backend:** Express.js + Node.js
- **Frontend:** Vanilla JS + Custom CSS
- **Streaming:** Server-Sent Events (SSE)
- **Hosting:** Vercel (serverless functions + static)

## Deploy

### Via Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project
3. Import your GitHub repo
4. **Framework Preset:** Other
5. **Build Command:** *(leave empty)*
6. **Output Directory:** *(leave empty)*
7. Deploy

### Local Development

```bash
npm install
npm start
# Open http://localhost:3000
```

## Project Structure

```
├── api/index.js          # Backend: 81 platform checker + SSE streaming
├── server.js             # Express server (local dev)
├── public/
│   ├── index.html        # UI
│   ├── styles.css        # Dark theme
│   └── app.js            # Frontend logic (streaming)
├── vercel.json           # Vercel config
└── package.json
```

## License

MIT
