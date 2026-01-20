const express = require('express');
const router = express.Router();
const controller = require('../controllers/matriculas.controller');

router.post('/', controller.createMatricula);
router.get('/', controller.getMatriculas);
router.get('/:id', controller.getMatriculaById);
router.put('/:id', controller.updateMatricula);
router.delete('/:id', controller.deleteMatricula);

module.exports = router;