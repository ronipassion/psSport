module.exports = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.status ? err.message : 'Erro interno do servidor';

  return res.status(status).json({ sucesso: false, erro: message });
};