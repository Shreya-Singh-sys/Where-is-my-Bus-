import express from 'express';
import etaController from '../controllers/etaController.js';

const router = express.Router();

router.get('/bus/:busId', etaController.getAllETAsForBus);
router.get('/stop/:stopId', etaController.getAllETAsForStop);
router.get('/bus/:busId/stop/:stopId', etaController.getETAForBusAtStop);

export default router;
