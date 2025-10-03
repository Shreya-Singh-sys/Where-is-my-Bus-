import routeModel from '../models/routeModel.js';
import { routeValidation } from '../validators/routeValidation.js';

export const routeController = {
  async getAllRoutes(req, res) {
    try {
      const routes = await routeModel.getAllRoutes();
      res.json({
        success: true,
        data: routes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getActiveRoutes(req, res) {
    try {
      const routes = await routeModel.getActiveRoutes();
      res.json({
        success: true,
        data: routes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getRouteById(req, res) {
    try {
      const { id } = req.params;
      const route = await routeModel.getRouteById(id);

      if (!route) {
        return res.status(404).json({
          success: false,
          error: 'Route not found'
        });
      }

      res.json({
        success: true,
        data: route
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getRouteWithStops(req, res) {
    try {
      const { id } = req.params;
      const route = await routeModel.getRouteWithStops(id);

      if (!route) {
        return res.status(404).json({
          success: false,
          error: 'Route not found'
        });
      }

      res.json({
        success: true,
        data: route
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async searchRoutes(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Search term is required'
        });
      }

      const routes = await routeModel.searchRoutes(q);
      res.json({
        success: true,
        data: routes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async createRoute(req, res) {
    try {
      const { error, value } = routeValidation.create.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const route = await routeModel.createRoute(value);
      res.status(201).json({
        success: true,
        data: route
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async updateRoute(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = routeValidation.update.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const route = await routeModel.updateRoute(id, value);
      res.json({
        success: true,
        data: route
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async deleteRoute(req, res) {
    try {
      const { id } = req.params;
      await routeModel.deleteRoute(id);

      res.json({
        success: true,
        message: 'Route deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default routeController;
