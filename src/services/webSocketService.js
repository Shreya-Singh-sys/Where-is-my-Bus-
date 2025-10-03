import { WebSocketServer } from 'ws';
import config from '../config/appConfig.js';
import trackingModel from '../models/trackingModel.js';

export class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
  }

  initialize(server) {
    this.wss = new WebSocketServer({
      server,
      path: '/ws'
    });

    this.wss.on('connection', (ws, req) => {
      const clientId = Math.random().toString(36).substring(7);

      console.log(`WebSocket client connected: ${clientId}`);

      this.clients.set(clientId, {
        ws,
        subscriptions: new Set()
      });

      ws.on('message', (message) => {
        this.handleMessage(clientId, message);
      });

      ws.on('close', () => {
        console.log(`WebSocket client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      ws.send(JSON.stringify({
        type: 'connected',
        clientId
      }));
    });

    const pingInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, config.websocket.pingInterval);

    this.wss.on('close', () => {
      clearInterval(pingInterval);
    });

    console.log('WebSocket service initialized');
  }

  handleMessage(clientId, message) {
    try {
      const data = JSON.parse(message);
      const client = this.clients.get(clientId);

      if (!client) return;

      switch (data.type) {
        case 'subscribe':
          if (data.busId) {
            client.subscriptions.add(`bus:${data.busId}`);
            console.log(`Client ${clientId} subscribed to bus:${data.busId}`);
          }
          if (data.routeId) {
            client.subscriptions.add(`route:${data.routeId}`);
            console.log(`Client ${clientId} subscribed to route:${data.routeId}`);
          }
          if (data.stopId) {
            client.subscriptions.add(`stop:${data.stopId}`);
            console.log(`Client ${clientId} subscribed to stop:${data.stopId}`);
          }
          break;

        case 'unsubscribe':
          if (data.busId) {
            client.subscriptions.delete(`bus:${data.busId}`);
          }
          if (data.routeId) {
            client.subscriptions.delete(`route:${data.routeId}`);
          }
          if (data.stopId) {
            client.subscriptions.delete(`stop:${data.stopId}`);
          }
          break;

        case 'ping':
          client.ws.send(JSON.stringify({ type: 'pong' }));
          break;

        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  broadcastBusLocation(busId, locationData) {
    const message = JSON.stringify({
      type: 'bus_location',
      busId,
      data: locationData
    });

    this.broadcast(`bus:${busId}`, message);
  }

  broadcastBusTracking(busId, trackingData) {
    const message = JSON.stringify({
      type: 'bus_tracking',
      busId,
      data: trackingData
    });

    this.broadcast(`bus:${busId}`, message);

    if (trackingData.route_id) {
      this.broadcast(`route:${trackingData.route_id}`, message);
    }
  }

  broadcastETA(busId, stopId, etaData) {
    const message = JSON.stringify({
      type: 'eta_update',
      busId,
      stopId,
      data: etaData
    });

    this.broadcast(`bus:${busId}`, message);
    this.broadcast(`stop:${stopId}`, message);
  }

  broadcast(subscription, message) {
    this.clients.forEach((client) => {
      if (client.subscriptions.has(subscription) && client.ws.readyState === 1) {
        client.ws.send(message);
      }
    });
  }

  broadcastToAll(message) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }
}

export default new WebSocketService();
