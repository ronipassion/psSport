const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);
app.use('/categorias', require('./routes/categorias.routes'));
app.use('/colaboradores', require('./routes/colaboradores.routes'));
app.use('/matriculas', require('./routes/matriculas.routes'));
app.use('/atletas', require('./routes/atletas.routes'));
app.use('/responsaveis', require('./routes/responsaveis.routes'));
app.use('/responsavel-atleta', require('./routes/responsavelAtleta.routes'));
app.use('/turmas', require('./routes/turmas.routes'));



app.use(require('./middlewares/errorHandler'));


module.exports = app;
