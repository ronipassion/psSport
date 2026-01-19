const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');

router.get('/perfil', authMiddleware, (req, res) => {
  res.json({
    mensagem: 'Acesso autorizado',
    usuario: req.usuario
  });
});

module.exports = router;

