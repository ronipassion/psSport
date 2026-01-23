const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware');
const controller = require('../controllers/categorias.controller');


router.post(
  '/',
  auth,
  authorize(['admin']),
  controller.createCategoria
);


router.get(
  '/',
  auth,
  authorize(['admin', 'secretaria', 'treinador']),
  controller.getCategorias
);


router.get(
  '/:id',
  auth,
  authorize(['admin', 'secretaria', 'treinador']),
  controller.getCategoriaById
);


router.put(
  '/:id',
  auth,
  authorize(['admin']),
  controller.updateCategoria
);


router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  controller.deleteCategoria
);

module.exports = router;
