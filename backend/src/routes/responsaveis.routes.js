const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const controller = require('../controllers/responsaveis.controller');

router.post('/', auth, authorize(['admin', 'secretaria']), controller.createResponsavel);
router.get('/', auth, authorize(['admin', 'secretaria']), controller.getResponsaveis);
router.get('/:cpf', auth, authorize(['admin', 'secretaria']), controller.getResponsavelByCpf);
router.put('/:cpf', auth, authorize(['admin', 'secretaria']), controller.updateResponsavel);
router.delete('/:cpf', auth, authorize(['admin']), controller.deleteResponsavel);

module.exports = router;
