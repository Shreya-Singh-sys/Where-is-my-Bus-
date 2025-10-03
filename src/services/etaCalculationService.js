import etaModel from '../models/etaModel.js';
import trackingModel from '../models/trackingModel.js';
import routeModel from '../models/routeModel.js';
import { calculateDistance, calculateETA } from '../utils/geoUtils.js';
import config from '../config/appConfig.js';

export class ETACalculationService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
  }

  start() {
    if (this.isRunning) {
      console.log('ETA calculation service is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting ETA calculation service...');

    this.intervalId = setInterval(
      () => this.calculateAllETAs(),
      config.eta.recalculationIntervalSeconds * 1000
    );

    this.calculateAllETAs();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('ETA calculation service stopped');
  }

  async calculateAllETAs() {
    try {
      const activeTracking = await trackingModel.getAllActiveTracking();

      for (const tracking of activeTracking) {
        await this.calculateETAForBus(tracking);
      }

      await etaModel.cleanupOldETAs(60);
    } catch (error) {
      console.error('Error calculating ETAs:', error);
    }
  }

  async calculateETAForBus(tracking) {
    try {
      const { bus_id, route_id, current_latitude, current_longitude, speed_kmph } = tracking;

      const route = await routeModel.getRouteWithStops(route_id);

      if (!route || !route.route_stops || route.route_stops.length === 0) {
        return;
      }

      await etaModel.deleteOldETAs(bus_id);

      const etaData = [];

      for (const routeStop of route.route_stops) {
        const stop = routeStop.stops;
        const distanceKm = calculateDistance(
          current_latitude,
          current_longitude,
          stop.latitude,
          stop.longitude
        );

        const avgSpeed = speed_kmph > 0 ? speed_kmph : config.eta.averageSpeedKmph;

        const etaMinutes = calculateETA(
          distanceKm,
          avgSpeed,
          config.eta.stopWaitTimeMinutes
        );

        const estimatedArrivalTime = new Date(Date.now() + etaMinutes * 60 * 1000);

        etaData.push({
          bus_id,
          stop_id: stop.id,
          route_id,
          estimated_arrival_time: estimatedArrivalTime.toISOString(),
          distance_to_stop_km: distanceKm,
          calculated_at: new Date().toISOString()
        });
      }

      if (etaData.length > 0) {
        await etaModel.insertBulkETAs(etaData);
      }
    } catch (error) {
      console.error(`Error calculating ETA for bus ${tracking.bus_id}:`, error);
    }
  }
}

export default new ETACalculationService();
