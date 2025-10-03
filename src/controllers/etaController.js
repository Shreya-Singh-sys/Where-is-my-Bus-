import etaModel from '../models/etaModel.js';
import busModel from '../models/busModel.js';
import stopModel from '../models/stopModel.js';

export const etaController = {
  async getETAForBusAtStop(req, res) {
    try {
      const { busId, stopId } = req.params;

      const eta = await etaModel.getETAForBusAtStop(busId, stopId);

      if (!eta) {
        return res.status(404).json({
          success: false,
          error: 'ETA not found'
        });
      }

      res.json({
        success: true,
        data: eta
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getAllETAsForBus(req, res) {
    try {
      const { busId } = req.params;

      const bus = await busModel.getBusById(busId);
      if (!bus) {
        return res.status(404).json({
          success: false,
          error: 'Bus not found'
        });
      }

      const etas = await etaModel.getAllETAsForBus(busId);

      res.json({
        success: true,
        data: etas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getAllETAsForStop(req, res) {
    try {
      const { stopId } = req.params;

      const stop = await stopModel.getStopById(stopId);
      if (!stop) {
        return res.status(404).json({
          success: false,
          error: 'Stop not found'
        });
      }

      const etas = await etaModel.getAllETAsForStop(stopId);

      res.json({
        success: true,
        data: etas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default etaController;
