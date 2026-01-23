module.exports = (permissoes = []) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }

    if (user.cargo === 'admin') {
      return next();
    }

    if (user.tipo === 'responsavel') {
      if (permissoes.includes('responsavel')) {
        return next();
      }
      return res.status(403).json({ erro: 'Acesso restrito a responsáveis' });
    }


    if (user.tipo === 'colaborador') {
      if (!user.cargo) {
        return res.status(403).json({ erro: 'Cargo não informado no token' });
      }

      if (permissoes.includes(user.cargo)) {
        return next();
      }

      return res.status(403).json({ erro: 'Permissão insuficiente' });
    }

    return res.status(403).json({ erro: 'Tipo de usuário inválido' });
  };
};
