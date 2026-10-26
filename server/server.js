import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import docRoutes from './routes/docRoutes.js';
import legalRoutes from './routes/legalRoutes.js';
import draftRoutes from './routes/draftRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware Configuration
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  message: { success: false, message: 'Too many requests from this IP. Please try again after 15 minutes.' }
});
app.use('/api/', apiLimiter);

// Connect Database
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'LexAI Backend Server',
    region: 'India (Union Law Jurisdiction)',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 LexAI Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/health`);
});

function startOnPort(portNum) {
  const srv = app.listen(portNum, () => {
    console.log(`🚀 LexAI Server running on port ${portNum} in ${process.env.NODE_ENV || 'development'} mode.`);
    console.log(`🔗 API Base: http://localhost:${portNum}/api/health`);
  });

  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const next = portNum + 1;
      if (next > Number(PORT) + 5) {
        console.error(`❌ Ports ${PORT}–${next - 1} are all in use. Please free a port and restart.`);
        process.exit(1);
      }
      console.warn(`⚠️ Port ${portNum} is in use. Retrying on port ${next}...`);
      startOnPort(next);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = Number(PORT) + 1;
    console.warn(`⚠️ Port ${PORT} is in use. Retrying on port ${nextPort}...`);
    startOnPort(nextPort);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
