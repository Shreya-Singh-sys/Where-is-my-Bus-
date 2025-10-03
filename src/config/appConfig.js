import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY
  },

  gps: {
    updateIntervalSeconds: 10,
    maxLocationAgeMinutes: 5
  },

  eta: {
    recalculationIntervalSeconds: 30,
    averageSpeedKmph: 25,
    stopWaitTimeMinutes: 2
  },

  websocket: {
    port: process.env.WS_PORT || 3001,
    pingInterval: 30000
  },

  mqtt: {
    broker: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
    clientId: `bus-tracking-${Math.random().toString(16).slice(3)}`,
    topic: {
      gpsData: 'bus/gps/+',
      commands: 'bus/command/+'
    }
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
};

export default config;
