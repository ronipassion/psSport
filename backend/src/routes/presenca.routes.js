const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const presencaController = require('../controllers/presenca.controller');


router.get('/turma/:id_turma/aula',auth, authorize(['admin', 'secretaria', 'treinador']), presencaController.getPresencasPorAula);
router.get('/turma/:id_turma',auth, authorize(['admin', 'secretaria', 'treinador']), presencaController.getPresencasPorTurma);

router.post('/', auth,authorize(['admin', 'secretaria', 'treinador']),presencaController.createPresenca);
router.get('/', auth,authorize(['admin', 'secretaria', 'treinador']),presencaController.getAllPresencas);
router.get('/:id',auth,authorize(['admin', 'secretaria', 'treinador']),presencaController.getPresencaById);
router.put('/:id', auth,authorize(['admin', 'secretaria', 'treinador']),presencaController.updatePresenca);


module.exports = router;

