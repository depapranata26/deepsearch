const express = require('express');
const https = require('https');
const http = require('http');

// ============================================
// PLATFORM DATABASE
// ============================================

const platforms = [
  // SOCIAL
  { name: "Twitter/X", url: "https://x.com/{}", cat: "social" },
  { name: "Instagram", url: "https://www.instagram.com/{}/", cat: "social" },
  { name: "Facebook", url: "https://www.facebook.com/{}", cat: "social" },
  { name: "TikTok", url: "https://www.tiktok.com/@{}", cat: "social" },
  { name: "YouTube", url: "https://www.youtube.com/{}", cat: "social" },
  { name: "Threads", url: "https://www.threads.net/@{}", cat: "social" },
  { name: "Snapchat", url: "https://www.snapchat.com/add/{}", cat: "social" },
  { name: "Pinterest", url: "https://www.pinterest.com/{}/", cat: "social" },
  { name: "Reddit", url: "https://www.reddit.com/user/{}/", cat: "social" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/{}", cat: "social" },
  { name: "Mastodon", url: "https://mastodon.social/@{}", cat: "social" },
  { name: "Bluesky", url: "https://bsky.app/profile/{}.bsky.social", cat: "social" },
  { name: "Tumblr", url: "https://{}.tumblr.com", cat: "social" },
  { name: "VK", url: "https://vk.com/{}", cat: "social" },
  // GAMING
  { name: "Twitch", url: "https://www.twitch.tv/{}", cat: "gaming" },
  { name: "Steam", url: "https://steamcommunity.com/id/{}", cat: "gaming" },
  { name: "Roblox", url: "https://www.roblox.com/user.aspx?username={}", cat: "gaming" },
  { name: "Minecraft (NameMC)", url: "https://namemc.com/profile/{}", cat: "gaming" },
  { name: "Itch.io", url: "https://{}.itch.io", cat: "gaming" },
  { name: "Newgrounds", url: "https://{}.newgrounds.com", cat: "gaming" },
  // DEV
  { name: "GitHub", url: "https://github.com/{}", cat: "dev" },
  { name: "GitLab", url: "https://gitlab.com/{}", cat: "dev" },
  { name: "CodePen", url: "https://codepen.io/{}", cat: "dev" },
  { name: "Replit", url: "https://replit.com/@{}", cat: "dev" },
  { name: "Glitch", url: "https://glitch.com/@{}", cat: "dev" },
  { name: "Dev.to", url: "https://dev.to/{}", cat: "dev" },
  { name: "HackerRank", url: "https://www.hackerrank.com/{}", cat: "dev" },
  { name: "LeetCode", url: "https://leetcode.com/{}", cat: "dev" },
  { name: "Codewars", url: "https://www.codewars.com/users/{}", cat: "dev" },
  { name: "npm", url: "https://www.npmjs.com/~{}", cat: "dev" },
  { name: "PyPI", url: "https://pypi.org/user/{}/", cat: "dev" },
  { name: "Keybase", url: "https://keybase.io/{}", cat: "dev" },
  { name: "Bitbucket", url: "https://bitbucket.org/{}/", cat: "dev" },
  { name: "Vercel", url: "https://vercel.com/{}", cat: "dev" },
  { name: "Netlify", url: "https://app.netlify.com/teams/{}/", cat: "dev" },
  { name: "Stack Overflow", url: "https://stackoverflow.com/users/?tab=Accounts", cat: "dev" },
  { name: "HackerOne", url: "https://hackerone.com/{}", cat: "dev" },
  // MUSIC
  { name: "Spotify", url: "https://open.spotify.com/user/{}", cat: "music" },
  { name: "SoundCloud", url: "https://soundcloud.com/{}", cat: "music" },
  { name: "Bandcamp", url: "https://{}.bandcamp.com", cat: "music" },
  { name: "Last.fm", url: "https://www.last.fm/user/{}", cat: "music" },
  { name: "Deezer", url: "https://www.deezer.com/profile/{}", cat: "music" },
  { name: "Genius", url: "https://genius.com/artists/{}", cat: "music" },
  // DESIGN
  { name: "Dribbble", url: "https://dribbble.com/{}", cat: "design" },
  { name: "Behance", url: "https://www.behance.net/{}", cat: "design" },
  { name: "DeviantArt", url: "https://www.deviantart.com/{}", cat: "design" },
  { name: "ArtStation", url: "https://www.artstation.com/{}", cat: "design" },
  { name: "Figma", url: "https://www.figma.com/@{}", cat: "design" },
  { name: "Flickr", url: "https://www.flickr.com/people/{}", cat: "design" },
  { name: "500px", url: "https://500px.com/p/{}", cat: "design" },
  // BUSINESS
  { name: "Medium", url: "https://medium.com/@{}", cat: "business" },
  { name: "Substack", url: "https://{}.substack.com", cat: "business" },
  { name: "Patreon", url: "https://www.patreon.com/{}", cat: "business" },
  { name: "Ko-fi", url: "https://ko-fi.com/{}", cat: "business" },
  { name: "ProductHunt", url: "https://www.producthunt.com/@{}", cat: "business" },
  { name: "AngelList", url: "https://angel.co/u/{}", cat: "business" },
  // FORUM
  { name: "Quora", url: "https://www.quora.com/profile/{}", cat: "forum" },
  { name: "Hacker News", url: "https://news.ycombinator.com/user?id={}", cat: "forum" },
  // READING
  { name: "Goodreads", url: "https://www.goodreads.com/user/show/", cat: "reading" },
  { name: "Wattpad", url: "https://www.wattpad.com/user/{}", cat: "reading" },
  { name: "Letterboxd", url: "https://letterboxd.com/{}", cat: "reading" },
  { name: "MyAnimeList", url: "https://myanimelist.net/profile/{}", cat: "reading" },
  { name: "AniList", url: "https://anilist.co/user/{}", cat: "reading" },
  // OTHER
  { name: "About.me", url: "https://about.me/{}", cat: "other" },
  { name: "Linktree", url: "https://linktr.ee/{}", cat: "other" },
  { name: "Carrd", url: "https://{}.carrd.co", cat: "other" },
  { name: "Buy Me a Coffee", url: "https://buymeacoffee.com/{}", cat: "other" },
  { name: "Gravatar", url: "https://gravatar.com/{}", cat: "other" },
  { name: "Chess.com", url: "https://www.chess.com/member/{}", cat: "other" },
  { name: "Lichess", url: "https://lichess.org/@/{}", cat: "other" },
  { name: "Scratch", url: "https://scratch.mit.edu/users/{}", cat: "other" },
  { name: "Strava", url: "https://www.strava.com/athletes/{}", cat: "other" },
  { name: "Unsplash", url: "https://unsplash.com/@{}", cat: "other" },
  { name: "Imgur", url: "https://imgur.com/user/{}", cat: "other" },
  { name: "Giphy", url: "https://giphy.com/{}", cat: "other" },
  { name: "Pexels", url: "https://www.pexels.com/@{}/", cat: "other" },
  { name: "Pixabay", url: "https://pixabay.com/users/{}/", cat: "other" },
  { name: "AllMyLinks", url: "https://allmylinks.com/{}", cat: "other" },
  { name: "Beacons", url: "https://beacons.ai/{}", cat: "other" },
  { name: "Mixcloud", url: "https://www.mixcloud.com/{}", cat: "other" },
  { name: "Reverbnation", url: "https://www.reverbnation.com/{}", cat: "other" },
];

// ============================================
// HTTP GET
// ============================================
function httpGet(url, timeout = 2000) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
    }, (res) => {
      res.resume();
      resolve({ status: res.statusCode });
    });
    req.on('error', () => resolve({ status: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0 }); });
  });
}

async function checkPlatform(platform, username) {
  const url = platform.url.replace('{}', username);
  try {
    const { status } = await httpGet(url, 2500);
    const found = [200, 301, 302, 303].includes(status);
    return { name: platform.name, url, found, status, cat: platform.cat };
  } catch {
    return { name: platform.name, url, found: false, status: 0, cat: platform.cat };
  }
}

// ============================================
// EXPRESS APP — API only (no static, no SPA)
// ============================================
const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// --- Stats ---
app.get('/api/stats', (req, res) => {
  const categories = {};
  platforms.forEach(p => { categories[p.cat] = (categories[p.cat] || 0) + 1; });
  res.json({ totalPlatforms: platforms.length, categories });
});

// --- Search (POST) ---
app.post('/api/search', async (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }
  const clean = username.trim().toLowerCase();
  if (clean.length < 1 || clean.length > 50) {
    return res.status(400).json({ error: 'Username must be 1-50 characters' });
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(clean)) {
    return res.status(400).json({ error: 'Invalid characters' });
  }

  const results = [];
  const BATCH = 20;
  for (let i = 0; i < platforms.length; i += BATCH) {
    const batch = platforms.slice(i, i + BATCH);
    const batchResults = await Promise.all(batch.map(p => checkPlatform(p, clean)));
    results.push(...batchResults);
  }

  results.sort((a, b) => {
    if (a.found !== b.found) return b.found - a.found;
    return a.name.localeCompare(b.name);
  });

  const found = results.filter(r => r.found).length;
  res.json({ username: clean, total: results.length, found, notFound: results.length - found, results, timestamp: new Date().toISOString() });
});

// --- Search (SSE Stream) ---
app.get('/api/search/stream', async (req, res) => {
  const username = (req.query.username || '').trim().toLowerCase();
  if (!username || !/^[a-zA-Z0-9._-]+$/.test(username) || username.length > 50) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  send('start', { username, total: platforms.length });
  const found = [];
  let checked = 0;
  const BATCH = 20;

  for (let i = 0; i < platforms.length; i += BATCH) {
    const batch = platforms.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(p => checkPlatform(p, username)));
    for (const r of results) {
      checked++;
      if (r.found) { found.push(r); send('found', r); }
    }
    send('progress', { checked, total: platforms.length, foundCount: found.length });
  }

  send('done', { username, total: platforms.length, found: found.length, notFound: platforms.length - found.length, results: found });
  res.end();
});

module.exports = app;
