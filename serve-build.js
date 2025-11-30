const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/adathplus')));

// Handle Angular routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/adathplus/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Production server running at http://localhost:${port}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'dist/adathplus')}`);
});