const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const controller = require('../controllers/turmas.controller');

router.post('/', auth, authorize(['admin', 'secretaria']), controller.createTurma);
router.get('/', auth, authorize(['admin', 'secretaria', 'treinador']), controller.getTurmas);
router.get('/:id', auth, authorize(['admin', 'secretaria', 'treinador']), controller.getTurmaById);
router.put('/:id', auth, authorize(['admin', 'secretaria']), controller.updateTurma);
router.delete('/:id', auth, authorize(['admin', 'secretaria']), controller.deleteTurma);

module.exports = router;
