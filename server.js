const express = require('express');
const path = require('path');
const apiApp = require('./api/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Mount API
app.use(apiApp);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback — use middleware instead of route pattern
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DeepSearch running on http://localhost:${PORT}`);
});
