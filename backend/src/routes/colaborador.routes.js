const express = require('express');
const router = express.Router();
const colaboradorController = require('../controllers/colaborador.controller');

router.post('/', colaboradorController.createColaborador);
router.get('/', colaboradorController.getColaboradores);
router.delete('/:cpf', colaboradorController.deleteColaborador);
router.put('/:cpf', colaboradorController.updateColaborador);

module.exports = router; 