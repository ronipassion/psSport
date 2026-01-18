const { Router } = require('express'); 
const colaboradorRoutes = require('./colaborador.routes.js'); 

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/colaboradores', colaboradorRoutes);

export default router;
