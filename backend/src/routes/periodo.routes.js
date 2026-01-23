const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const periodoController = require('../controllers/periodo.controller');


router.post('/', auth, authorize(['admin', 'secretaria']),periodoController.createPeriodo);
router.get('/', auth,authorize(['admin', 'secretaria']),periodoController.getPeriodos);
router.get('/:id', auth,authorize(['admin', 'secretaria']),periodoController.getPeriodoById);
router.put('/:id', auth,authorize(['admin', 'secretaria']),periodoController.updatePeriodo);
router.put('/inativar/:id', auth,authorize(['admin', 'secretaria']),periodoController.inativarPeriodo);

module.exports = router;
