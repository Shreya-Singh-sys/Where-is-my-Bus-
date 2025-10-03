import trackingModel from '../models/trackingModel.js';
import busModel from '../models/busModel.js';
import websocketService from './websocketService.js';
import config from '../config/appConfig.js';

export class GPSDataProcessor {
  async processGPSData(gpsData) {
    try {
      const {
        gps_device_id,
        latitude,
        longitude,
        speed_kmph,
        heading,
        timestamp
      } = gpsData;

      const bus = await busModel.getBusByNumber(gps_device_id);

      if (!bus) {
        console.warn(`Bus not found for GPS device: ${gps_device_id}`);
        return;
      }

      const locationData = {
        bus_id: bus.id,
        latitude,
        longitude,
        speed_kmph: speed_kmph || 0,
        heading: heading || null,
        gps_timestamp: timestamp || new Date().toISOString()
      };

      await trackingModel.insertBusLocation(locationData);

      const currentTracking = await trackingModel.getCurrentTracking(bus.id);

      if (currentTracking) {
        const updatedTracking = {
          ...currentTracking,
          current_latitude: latitude,
          current_longitude: longitude,
          speed_kmph: speed_kmph || 0,
          last_updated: new Date().toISOString()
        };

        await trackingModel.upsertBusTracking(updatedTracking);

        websocketService.broadcastBusLocation(bus.id, locationData);
        websocketService.broadcastBusTracking(bus.id, updatedTracking);
      }

      console.log(`Processed GPS data for bus ${bus.bus_number}`);
    } catch (error) {
      console.error('Error processing GPS data:', error);
      throw error;
    }
  }

  async processBulkGPSData(gpsDataArray) {
    const results = [];

    for (const gpsData of gpsDataArray) {
      try {
        await this.processGPSData(gpsData);
        results.push({ success: true, device_id: gpsData.gps_device_id });
      } catch (error) {
        results.push({
          success: false,
          device_id: gpsData.gps_device_id,
          error: error.message
        });
      }
    }

    return results;
  }
}

export default new GPSDataProcessor();
