const express = require('express');
const app = express();

app.use(express.json());

app.use('/categorias', require('./routes/categorias.routes'));
app.use('/responsaveis', require('./routes/responsaveis.routes'));
app.use('/matriculas', require('./routes/matriculas.routes'));

module.exports = app;
