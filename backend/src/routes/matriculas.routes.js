const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const controller = require('../controllers/matriculas.controller');

router.post('/atletas/:cpf_atleta', auth, authorize(['admin', 'secretaria']), controller.createMatricula);

module.exports = router;
