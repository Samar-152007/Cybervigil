/**
 * ScamGuard Pro (CyberVigil AI) - Local Development & Mobile Preview Server
 * Native Node.js HTTP Server with full MIME support & multi-device preview
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = parseInt(process.env.PORT || '8080', 10);
const ROOT = process.cwd();

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.map': 'application/json'
};

function getLocalNetworkIp() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (e) {}
  return null;
}

const server = http.createServer((req, res) => {
  try {
    let cleanUrl = decodeURI(req.url.split('?')[0]);
    let safePath = path.normalize(path.join(ROOT, cleanUrl));

    // Prevent directory traversal attacks
    if (!safePath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
      safePath = path.join(safePath, 'index.html');
    }

    if (!fs.existsSync(safePath) || !fs.statSync(safePath).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(safePath).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Server Error: ' + err.message);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalNetworkIp();

  console.log('=================================================================');
  console.log('       🛡️  CyberVigil - Active');
  console.log('=================================================================');
  console.log(`\n  🖥️  On Your PC:      http://localhost:${PORT}/`);
  if (localIp) {
    console.log(`  📱  On Your Phone:   http://${localIp}:${PORT}/ (Same Wi-Fi)`);
  }
  console.log('\n  Tip: In your browser, press F12 and toggle "Device Toolbar" (Ctrl+Shift+M)');
  console.log('       to view the responsive mobile layout with bottom navigation.');
  console.log('\n  Press Ctrl+C to stop the server.\n');

  // Automatically open browser on PC
  const openCmd = process.platform === 'win32' ? `start http://localhost:${PORT}/` :
                  process.platform === 'darwin' ? `open http://localhost:${PORT}/` :
                  `xdg-open http://localhost:${PORT}/`;
  exec(openCmd, () => {});
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[!] Port ${PORT} is already in use by another program.`);
    console.error(`    Please close that application or set a different PORT.`);
  } else {
    console.error('\n[!] Server error:', err.message);
  }
});
