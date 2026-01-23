const express = require('express');
const router = express.Router();
const presencaController = require('../controllers/presenca.controller');

router.get('/turma/:id_turma/aula', presencaController.getPresencasPorAula);
router.get('/turma/:id_turma', presencaController.getPresencasPorTurma);

router.post('/', presencaController.createPresenca);
router.get('/', presencaController.getAllPresencas);
router.get('/:id', presencaController.getPresencaById);
router.put('/:id', presencaController.updatePresenca);


module.exports = router;

