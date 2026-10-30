import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Carbon Coach API',
    version: '1.0.0',
    description: 'AI-powered carbon footprint tracking and recommendation platform API',
  });
});

// API Routes
app.use('/api/v1', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
