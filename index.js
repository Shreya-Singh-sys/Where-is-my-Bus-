import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import config from './src/config/appConfig.js';
import errorHandler from './src/middleware/errorHandler.js';

import busRoutes from './src/routes/busRoutes.js';
import routeRoutes from './src/routes/routeRoutes.js';
import stopRoutes from './src/routes/stopRoutes.js';
import trackingRoutes from './src/routes/trackingRoutes.js';
import etaRoutes from './src/routes/etaRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

import websocketService from './src/services/websocketService.js';
import etaCalculationService from './src/services/etaCalculationService.js';
import gpsDataProcessor from './src/services/gpsDataProcessor.js';

const admin = require('firebase-admin');
const serviceAccount = require('./bustracker-6d9b1-firebase-adminsdk-fbsvc-77a00f25bb.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log('Firebase Admin SDK initialized successfully.');

const app = express();
const server = createServer(app);

app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api/', limiter);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bus Tracking API Server',
    version: '1.0.0',
    endpoints: {
      buses: '/api/buses',
      routes: '/api/routes',
      stops: '/api/stops',
      tracking: '/api/tracking',
      eta: '/api/eta',
      users: '/api/users',
      websocket: '/ws'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/api/gps/data', async (req, res) => {
  try {
    const gpsData = req.body;

    if (Array.isArray(gpsData)) {
      const results = await gpsDataProcessor.processBulkGPSData(gpsData);
      res.json({
        success: true,
        data: results
      });
    } else {
      await gpsDataProcessor.processGPSData(gpsData);
      res.json({
        success: true,
        message: 'GPS data processed successfully'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/eta', etaRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use(errorHandler);

websocketService.initialize(server);

etaCalculationService.start();

server.listen(config.port, () => {
  console.log('='.repeat(50));
  console.log(`🚍 Bus Tracking API Server`);
  console.log('='.repeat(50));
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`HTTP Server: http://localhost:${config.port}`);
  console.log(`WebSocket: ws://localhost:${config.port}/ws`);
  console.log(`Health Check: http://localhost:${config.port}/api/health`);
  console.log('='.repeat(50));
  console.log('Services:');
  console.log('✓ WebSocket Service: Running');
  console.log('✓ ETA Calculation Service: Running');
  console.log('='.repeat(50));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  etaCalculationService.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  etaCalculationService.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
