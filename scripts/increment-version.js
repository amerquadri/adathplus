const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../public/config.json');

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Parse version (format: 1.0.12.4)
  const versionParts = (config.version || '1.0.0.0').split('.').map(Number);
  
  // Ensure we have 4 parts
  while (versionParts.length < 4) {
    versionParts.push(0);
  }
  
  // Increment the last part (build number)
  versionParts[3] = (versionParts[3] || 0) + 1;
  
  config.version = versionParts.join('.');
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  
  console.log(`✓ Version incremented to ${config.version}`);
} catch (err) {
  console.error('Error incrementing version:', err.message);
  process.exit(1);
}
