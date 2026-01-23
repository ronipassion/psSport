const express = require('express');
const router = express.Router();
const periodoController = require('../controllers/periodo.controller');

router.post('/', periodoController.createPeriodo);
router.get('/', periodoController.getPeriodos);
router.get('/:id', periodoController.getPeriodoById);
router.put('/:id', periodoController.updatePeriodo);
router.put('/inativar/:id', periodoController.inativarPeriodo);

module.exports = router;
