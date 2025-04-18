const express = require('express');
const router = express.Router();
const courtController = require('../controllers/court.controller');

/**
 * @swagger
 * tags:
 *   name: Courts
 *   description: Court management
 */ 

router.post('/', courtController.createCourt);
router.get('/', courtController.getCourts);
router.get('/:id', courtController.getCourtById);
router.put('/:id', courtController.updateCourt);
router.delete('/:id', courtController.deleteCourt);

module.exports = router; 