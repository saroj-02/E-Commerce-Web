// Root entrypoint for hosting platforms that run `node index.js`
// It simply delegates to the actual server implementation in ./src/server.js
try {
  require('./src/server');
} catch (err) {
  console.error('Failed to start server from ./src/server.js:', err);
  process.exit(1);
}
