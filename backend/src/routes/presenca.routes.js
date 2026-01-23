const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const presencaController = require('../controllers/presenca.controller');


router.get('/turma/:id_turma/aula',auth, authorize(['admin', 'secretaria', 'treinador']), presencaController.getPresencasPorAula);
router.get('/turma/:id_turma',auth, authorize(['admin', 'secretaria', 'treinador']), presencaController.getPresencasPorTurma);

router.post('/', authorize(['admin', 'secretaria', 'treinador']),presencaController.createPresenca);
router.get('/', authorize(['admin', 'secretaria', 'treinador']),presencaController.getAllPresencas);
router.get('/:id',authorize(['admin', 'secretaria', 'treinador']),presencaController.getPresencaById);
router.put('/:id', authorize(['admin', 'secretaria', 'treinador']),presencaController.updatePresenca);


module.exports = router;

