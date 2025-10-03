import busModel from '../models/busModel.js';
import { busValidation } from '../validators/busValidation.js';

export const busController = {
  async getAllBuses(req, res) {
    try {
      const buses = await busModel.getAllBuses();
      res.json({
        success: true,
        data: buses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getActiveBuses(req, res) {
    try {
      const buses = await busModel.getActiveBuses();
      res.json({
        success: true,
        data: buses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getBusById(req, res) {
    try {
      const { id } = req.params;
      const bus = await busModel.getBusById(id);

      if (!bus) {
        return res.status(404).json({
          success: false,
          error: 'Bus not found'
        });
      }

      res.json({
        success: true,
        data: bus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getBusByNumber(req, res) {
    try {
      const { busNumber } = req.params;
      const bus = await busModel.getBusByNumber(busNumber);

      if (!bus) {
        return res.status(404).json({
          success: false,
          error: 'Bus not found'
        });
      }

      res.json({
        success: true,
        data: bus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async createBus(req, res) {
    try {
      const { error, value } = busValidation.create.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const bus = await busModel.createBus(value);
      res.status(201).json({
        success: true,
        data: bus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async updateBus(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = busValidation.update.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const bus = await busModel.updateBus(id, value);
      res.json({
        success: true,
        data: bus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async deleteBus(req, res) {
    try {
      const { id } = req.params;
      await busModel.deleteBus(id);

      res.json({
        success: true,
        message: 'Bus deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async updateBusStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'inactive', 'maintenance'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value'
        });
      }

      const bus = await busModel.updateBusStatus(id, status);
      res.json({
        success: true,
        data: bus
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default busController;
