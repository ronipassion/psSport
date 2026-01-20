const express = require('express');
const router = express.Router();
const controller = require('../controllers/responsaveis.controller');

router.post('/', controller.createResponsavel);
router.get('/', controller.getResponsaveis);
router.get('/:cpf', controller.getResponsavelByCpf);
router.put('/:cpf', controller.updateResponsavel);
router.delete('/:cpf', controller.deleteResponsavel);

module.exports = router;
