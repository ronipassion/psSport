const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    let [rows] = await db.query(
      `SELECT 
         cpf_colaborador AS id,
         nome,
         email,
         senha,
         cargo,
         status
       FROM colaboradores
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (rows.length > 0) {
      const usuario = rows[0];

      if (usuario.status !== 'ativo') {
        return res.status(401).json({ erro: 'Usuário inativo' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          tipo: 'colaborador',
          cargo: usuario.cargo
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        sucesso: true,
        tipo: 'colaborador',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          cargo: usuario.cargo
        },
        token
      });
    }

    [rows] = await db.query(
      `SELECT
         id_login AS id,
         cpf_responsavel,
         email_acesso,
         senha,
         status
       FROM login_responsavel
       WHERE email_acesso = ?
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    const respLogin = rows[0];

    if (respLogin.status !== 'ativo') {
      return res.status(401).json({ erro: 'Usuário inativo' });
    }

    const senhaValida = await bcrypt.compare(senha, respLogin.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      {
        id: respLogin.id,
        tipo: 'responsavel',
        cpf_responsavel: respLogin.cpf_responsavel
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      sucesso: true,
      tipo: 'responsavel',
      usuario: {
        id: respLogin.id,
        email: respLogin.email_acesso,
        cpf_responsavel: respLogin.cpf_responsavel
      },
      token
    });

  } catch (error) {
    console.error('ERRO NO LOGIN:', error);
    return res.status(500).json({ erro: 'Erro ao realizar login' });
  }
};
