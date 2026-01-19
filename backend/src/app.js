const express = require('express');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const matricularAtleta_loginResponsavel = require('./routes/matricular.routes');

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/categorias', require('./routes/categorias.routes'));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/atletas', matricularAtleta_loginResponsavel );

module.exports = app;
