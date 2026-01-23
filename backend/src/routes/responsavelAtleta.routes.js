const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const controller = require('../controllers/responsavelAtleta.controller');

router.post(
  '/atletas/:cpf_atleta',
  auth,
  authorize(['admin', 'secretaria']),
  controller.vincularResponsavelAoAtleta
);

router.get(
  '/atletas/:cpf_atleta/ativo',
  auth,
  authorize(['admin', 'secretaria', 'treinador']),
  controller.getVinculoAtivo
);

router.delete(
  '/atletas/:cpf_atleta/ativo',
  auth,
  authorize(['admin', 'secretaria']),
  controller.desvincularAtivo
);

module.exports = router;
