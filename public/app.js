/* ============================================
   DeepSearch — Frontend Logic (Streaming)
   ============================================ */

let allResults = [];
let currentCategory = 'all';

// Platform icons
const platformIcons = {
  'Twitter/X': '🐦', 'Instagram': '📸', 'Facebook': '👤', 'TikTok': '🎵',
  'YouTube': '▶️', 'GitHub': '🐙', 'Reddit': '🔴', 'LinkedIn': '💼',
  'Spotify': '🎧', 'Twitch': '🎮', 'Discord': '💬', 'Telegram': '✈️',
  'Snapchat': '👻', 'Pinterest': '📌', 'Threads': '🧵', 'Steam': '🎮',
  'GitLab': '🦊', 'SoundCloud': '☁️', 'DeviantArt': '🎨', 'Dribbble': '🏀',
  'Behance': '🅱️', 'Medium': '📝', 'Quora': '❓', 'Mastodon': '🐘',
  'Bluesky': '🦋', 'Last.fm': '🎵', 'Bandcamp': '🎸', 'ArtStation': '🎨',
  'About.me': '👤', 'Gravatar': '🟣', 'Keybase': '🔑', 'CodePen': '✏️',
  'Replit': '⚡', 'Glitch': '🟩', 'Chess.com': '♟️', 'Lichess': '♟️',
  'Letterboxd': '🎬', 'Goodreads': '📚', 'Wattpad': '📝', 'Strava': '🏃',
  'Duolingo': '🦉', 'Kaggle': '📊', 'Figma': '🎨', 'Notion': '📋',
  'Linktree': '🌿', 'CoinMarketCap': '💰', 'OpenSea': '🖼️',
  'Roblox': '🎯', 'Minecraft (NameMC)': '⛏️', 'Itch.io': '🎮',
  'Newgrounds': '🌐', 'Dev.to': '📝', 'HackerRank': '🏅', 'LeetCode': '🧩',
  'Codewars': '⚔️', 'npm': '📦', 'PyPI': '🐍', 'Bitbucket': '🪣',
  'Vercel': '▲', 'Netlify': '◆', 'Stack Overflow': '📋', 'HackerOne': '🐛',
  'Deezer': '🎶', 'Genius': '🎤', '500px': '📷', 'ProductHunt': '🚀',
  'AngelList': '💡', 'Hacker News': '🟠', 'MyAnimeList': '📺',
  'AniList': '🅰️', 'Scratch': '🐱', 'Unsplash': '🌅', 'Imgur': '🖼️',
  'Giphy': '🎞️', 'Pexels': '📷', 'Pixabay': '🏞️', 'AllMyLinks': '🔗',
  'Beacons': '📡', 'Mixcloud': '☁️', 'Reverbnation': '🎶',
  'Substack': '✉️', 'Patreon': '🎭', 'Ko-fi': '☕', 'Carrd': '🃏',
  'Buy Me a Coffee': '☕', 'VK': '🔵', 'Tumblr': '📝',
};

const categoryLabels = {
  social: 'Social', gaming: 'Gaming', dev: 'Dev', music: 'Music',
  design: 'Design', business: 'Business', forum: 'Forum',
  reading: 'Reading', other: 'Other',
};

// DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('resultsGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const noResultsState = document.getElementById('noResultsState');
const statsBar = document.getElementById('statsBar');
const filtersSection = document.getElementById('filtersSection');
const loadingProgress = document.getElementById('loadingProgress');

searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

function quickSearch(u) { searchInput.value = u; doSearch(); }

// =====================
// SEARCH — SSE streaming
// =====================
async function doSearch() {
  const username = searchInput.value.trim();
  if (!username) return;

  // UI: loading
  searchBtn.disabled = true;
  document.querySelector('.btn-text').style.display = 'none';
  document.querySelector('.btn-loader').style.display = 'inline';
  loadingState.style.display = 'block';
  resultsGrid.innerHTML = '';
  emptyState.style.display = 'none';
  noResultsState.style.display = 'none';
  statsBar.style.display = 'none';
  filtersSection.style.display = 'none';
  allResults = [];

  const startTime = Date.now();

  try {
    const evtSource = new EventSource(`/api/search/stream?username=${encodeURIComponent(username)}`);

    evtSource.addEventListener('start', (e) => {
      const data = JSON.parse(e.data);
      loadingProgress.textContent = `0 / ${data.total}`;
    });

    evtSource.addEventListener('progress', (e) => {
      const data = JSON.parse(e.data);
      loadingProgress.textContent = `${data.checked} / ${data.total} — ${data.foundCount} found`;
    });

    evtSource.addEventListener('found', (e) => {
      const r = JSON.parse(e.data);
      allResults.push(r);
      // Add card immediately
      addResultCard(r, allResults.length - 1);
    });

    evtSource.addEventListener('done', (e) => {
      const data = JSON.parse(e.data);
      evtSource.close();

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      // Stats
      document.getElementById('statTotal').textContent = data.total;
      document.getElementById('statFound').textContent = data.found;
      document.getElementById('statNotFound').textContent = data.notFound;
      document.getElementById('statTime').textContent = elapsed + 's';
      statsBar.style.display = 'flex';

      // Category counts
      const counts = {};
      allResults.forEach(r => { counts[r.cat] = (counts[r.cat] || 0) + 1; });

      document.getElementById('countAll').textContent = data.total;
      document.getElementById('countSocial').textContent = counts.social || 0;
      document.getElementById('countGaming').textContent = counts.gaming || 0;
      document.getElementById('countDev').textContent = counts.dev || 0;
      document.getElementById('countMusic').textContent = counts.music || 0;
      document.getElementById('countDesign').textContent = counts.design || 0;
      document.getElementById('countBusiness').textContent = counts.business || 0;

      filtersSection.style.display = 'flex';
      loadingState.style.display = 'none';

      if (data.found === 0) {
        noResultsState.style.display = 'block';
      }
    });

    evtSource.addEventListener('error', () => {
      evtSource.close();
      loadingState.style.display = 'none';
      if (allResults.length === 0) {
        alert('Search failed. Please try again.');
      }
    });

  } catch (err) {
    console.error(err);
    loadingState.style.display = 'none';
    alert('Search failed. Please try again.');
  } finally {
    searchBtn.disabled = false;
    document.querySelector('.btn-text').style.display = 'inline';
    document.querySelector('.btn-loader').style.display = 'none';
  }
}

// Add single card in real-time
function addResultCard(r, idx) {
  const card = document.createElement('div');
  card.className = 'result-card found';
  card.style.animationDelay = `${Math.min(idx * 0.02, 0.5)}s`;

  const icon = platformIcons[r.name] || '🔗';
  const catLabel = categoryLabels[r.cat] || r.cat;

  card.innerHTML = `
    <div class="result-icon">${icon}</div>
    <div class="result-info">
      <div class="result-name">${r.name}</div>
      <div class="result-category">${catLabel}</div>
    </div>
    <div class="result-status">✓ FOUND</div>
  `;

  card.style.cursor = 'pointer';
  card.addEventListener('click', () => window.open(r.url, '_blank', 'noopener'));

  resultsGrid.appendChild(card);
}

// Filter
function filterCategory(category, btn) {
  currentCategory = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  let filtered;
  if (category === 'all') {
    filtered = allResults;
  } else if (category === 'found') {
    filtered = allResults;
  } else {
    filtered = allResults.filter(r => r.cat === category);
  }

  resultsGrid.innerHTML = '';
  filtered.forEach((r, i) => addResultCard(r, i));
}

// Load stats
fetch('/api/stats')
  .then(r => r.json())
  .then(d => { document.getElementById('platformCount').textContent = d.totalPlatforms; })
  .catch(() => {});

setTimeout(() => searchInput.focus(), 100);
