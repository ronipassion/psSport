const express = require('express');
const router = express.Router();
const atletaController = require('../controllers/matricular.controller.js');

router.put('/matricular/:cpf_atleta', atletaController.matricular);

module.exports = router;
