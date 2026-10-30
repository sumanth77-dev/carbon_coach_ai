import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().catch((err) => {
  console.warn(`[Warning] Database connection failed on startup: ${err.message}`);
});

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`[Server] Carbon Coach Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('[Server] HTTP server closed');
  });
});

export default server;
