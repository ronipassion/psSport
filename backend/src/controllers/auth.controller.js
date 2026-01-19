const db = require('../config/database.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('BODY:', req.body);

    const {
      cpf_colaborador,
      nome,
      email,
      senha,
      cargo,
      telefone,
      data_admissao,
      data_desligamento,
      status
    } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    await db.query(
      `INSERT INTO colaboradores
      (cpf_colaborador, nome, email, senha, cargo, telefone, data_admissao, data_desligamento, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cpf_colaborador,
        nome,
        email,
        hash,
        cargo,
        telefone,
        data_admissao,
        data_desligamento,
        status
      ]
    );

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao cadastrar usuário'
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { login, senha } = req.body;
   
    if (!login || !senha) {
      return res.status(400).json({
        erro: 'Login e senha são obrigatórios'
      });
    }

    let usuario = null;
    let tipo = null;

    let [rows] = await db.query(
      `SELECT 
         cpf_colaborador AS id,
         senha,
         cargo
       FROM colaboradores
       WHERE cpf_colaborador = ?
         AND status = 'ativo'`,
      [login]
    );

    if (rows.length > 0) {
      usuario = rows[0];
      tipo = 'colaborador';
    }

    if (!usuario) {
      [rows] = await db.query(
        `SELECT 
           id_login AS id,
           cpf_responsavel,
           senha
         FROM login_responsavel
         WHERE email_acesso = ?
           AND status = 'ativo'`,
        [login]
      );

      if (rows.length > 0) {
        usuario = rows[0];
        tipo = 'responsavel';
      }
    }

    if (!usuario) {
      return res.status(401).json({
        erro: 'Login ou senha inválidos'
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({
        erro: 'Login ou senha inválidos'
      });
    }

    const token = jwt.sign(
      {
        sub: usuario.id,
        tipo,
        cargo: usuario.cargo || null,
        cpf_responsavel: usuario.cpf_responsavel || null
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      sucesso: true,
      tipo,
      token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      erro: 'Erro ao realizar login'
    });
  }
};
