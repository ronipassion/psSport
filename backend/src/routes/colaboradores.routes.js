const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorizeMiddleware'); 
const controller = require('../controllers/colaboradores.controller');

router.post('/', auth, authorize(['admin']), controller.createColaborador);
router.get('/', auth, authorize(['admin', 'secretaria']), controller.getColaboradores)

module.exports = router;
