const express = require('express');
const router = express.Router();
const controller = require('../controllers/categorias.controller');

router.post('/', controller.createCategoria);
router.get('/', controller.getCategorias);
router.get('/:id', controller.getCategoriaById);
router.put('/:id', controller.updateCategoria);
router.delete('/:id', controller.deleteCategoria);

module.exports = router;
