const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const controller = require('../controllers/atletas.controller');

router.post('/', auth, authorize(['admin', 'secretaria']), controller.createAtleta);
router.get('/', auth, authorize(['admin', 'secretaria', 'treinador']), controller.getAtletas);
router.get('/:cpf', auth, authorize(['admin', 'secretaria', 'treinador']), controller.getAtletaByCpf);
router.put('/:cpf', auth, authorize(['admin', 'secretaria']), controller.updateAtleta);
router.delete('/:cpf', auth, authorize(['admin', 'secretaria']), controller.deleteAtleta);

module.exports = router;
