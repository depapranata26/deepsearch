const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Import API routes
const apiRoutes = require('./api/index');

app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, 'public')));

// SPA fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔍 DeepSearch running on http://localhost:${PORT}`);
});
