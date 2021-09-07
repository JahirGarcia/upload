const app = require('./app');
const { createServer } = require('http');

const server = createServer(app);
const PORT = process.env.PORT;
server.listen(PORT, () => console.log('Server listening on port', PORT));
