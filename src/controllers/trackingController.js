import trackingModel from '../models/trackingModel.js';
import busModel from '../models/busModel.js';
import { trackingValidation } from '../validators/trackingValidation.js';

export const trackingController = {
  async getBusLocation(req, res) {
    try {
      const { busId } = req.params;
      const location = await trackingModel.getBusLocation(busId);

      if (!location) {
        return res.status(404).json({
          success: false,
          error: 'Location data not found'
        });
      }

      res.json({
        success: true,
        data: location
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getBusLocationHistory(req, res) {
    try {
      const { busId } = req.params;
      const { limit } = req.query;

      const history = await trackingModel.getBusLocationHistory(
        busId,
        limit ? parseInt(limit) : 100
      );

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getCurrentTracking(req, res) {
    try {
      const { busId } = req.params;
      const tracking = await trackingModel.getCurrentTracking(busId);

      if (!tracking) {
        return res.status(404).json({
          success: false,
          error: 'Tracking data not found'
        });
      }

      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getAllActiveTracking(req, res) {
    try {
      const tracking = await trackingModel.getAllActiveTracking();

      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async updateBusLocation(req, res) {
    try {
      const { error, value } = trackingValidation.location.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const bus = await busModel.getBusById(value.bus_id);
      if (!bus) {
        return res.status(404).json({
          success: false,
          error: 'Bus not found'
        });
      }

      const location = await trackingModel.insertBusLocation(value);

      res.json({
        success: true,
        data: location
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async updateTracking(req, res) {
    try {
      const { error, value } = trackingValidation.tracking.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const tracking = await trackingModel.upsertBusTracking(value);

      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async updateTrackingStatus(req, res) {
    try {
      const { busId } = req.params;
      const { status, delay_mins } = req.body;

      if (!['on_time', 'delayed', 'breakdown', 'off_route'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value'
        });
      }

      const tracking = await trackingModel.updateTrackingStatus(
        busId,
        status,
        delay_mins || 0
      );

      res.json({
        success: true,
        data: tracking
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default trackingController;
