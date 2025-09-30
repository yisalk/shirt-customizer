import jsonServer from 'json-server';
import customMiddleware from './data/middleware.js';

const server = jsonServer.create();
const router = jsonServer.router('data/db.json');
const middlewares = jsonServer.defaults();

// Use default middlewares
server.use(middlewares);

// Use custom middleware
server.use(customMiddleware);

// Use router
server.use(router);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
