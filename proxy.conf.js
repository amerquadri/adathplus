const http = require('http');

// Keep-alive agent is required for NTLM authentication
// NTLM is connection-based and needs the same TCP socket across handshake steps
const keepAliveAgent = new http.Agent({ keepAlive: true });

const ssrsProxy = {
  target: 'http://amerpc:8080',
  secure: false,
  changeOrigin: true,
  agent: keepAliveAgent,
  onProxyRes: function (proxyRes) {
    // Remove headers that block iframe embedding
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  },
  onProxyReq: function (proxyReq) {
    proxyReq.setHeader('Connection', 'keep-alive');
  }
};

module.exports = {
  '/ReportServer': ssrsProxy,
  '/Reserved.ReportViewerWebControl.axd': ssrsProxy
};
