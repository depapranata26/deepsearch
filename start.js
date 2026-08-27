const app = require('./api/index');
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`DeepSearch running on http://localhost:${PORT}`);
});
