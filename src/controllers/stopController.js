import stopModel from '../models/stopModel.js';
import { stopValidation } from '../validators/stopValidation.js';

export const stopController = {
  async getAllStops(req, res) {
    try {
      const stops = await stopModel.getAllStops();
      res.json({
        success: true,
        data: stops
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getStopById(req, res) {
    try {
      const { id } = req.params;
      const stop = await stopModel.getStopById(id);

      if (!stop) {
        return res.status(404).json({
          success: false,
          error: 'Stop not found'
        });
      }

      res.json({
        success: true,
        data: stop
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getNearbyStops(req, res) {
    try {
      const { latitude, longitude, radius } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required'
        });
      }

      const stops = await stopModel.getNearbyStops(
        parseFloat(latitude),
        parseFloat(longitude),
        radius ? parseFloat(radius) : 1
      );

      res.json({
        success: true,
        data: stops
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async searchStops(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Search term is required'
        });
      }

      const stops = await stopModel.searchStops(q);
      res.json({
        success: true,
        data: stops
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async createStop(req, res) {
    try {
      const { error, value } = stopValidation.create.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const stop = await stopModel.createStop(value);
      res.status(201).json({
        success: true,
        data: stop
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async updateStop(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = stopValidation.update.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const stop = await stopModel.updateStop(id, value);
      res.json({
        success: true,
        data: stop
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async deleteStop(req, res) {
    try {
      const { id } = req.params;
      await stopModel.deleteStop(id);

      res.json({
        success: true,
        message: 'Stop deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default stopController;
