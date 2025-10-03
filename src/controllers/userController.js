import userModel from '../models/userModel.js';

export const userController = {
  async getUserProfile(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const user = await userModel.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async updateUserProfile(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const { full_name, phone, preferred_language } = req.body;

      const user = await userModel.updateUser(userId, {
        full_name,
        phone,
        preferred_language
      });

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getUserFavorites(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const favorites = await userModel.getUserFavorites(userId);

      res.json({
        success: true,
        data: favorites
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async addFavorite(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const { favorite_type, reference_id } = req.body;

      if (!['route', 'stop', 'bus'].includes(favorite_type)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid favorite type'
        });
      }

      const favorite = await userModel.addFavorite(userId, favorite_type, reference_id);

      res.status(201).json({
        success: true,
        data: favorite
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async removeFavorite(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const { favorite_type, reference_id } = req.body;

      await userModel.removeFavorite(userId, favorite_type, reference_id);

      res.json({
        success: true,
        message: 'Favorite removed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getUserNotifications(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const { unread_only } = req.query;

      const notifications = await userModel.getUserNotifications(
        userId,
        unread_only === 'true'
      );

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async markNotificationAsRead(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const { notificationId } = req.params;

      const notification = await userModel.markNotificationAsRead(notificationId, userId);

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

export default userController;
