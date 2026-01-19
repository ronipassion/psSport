const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: 'Token não informado'
    });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({
      erro: 'Token malformado'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded; 
    next();

  } catch (err) {
    return res.status(401).json({
      erro: 'Token inválido ou expirado'
    });
  }
};
