const db = require('../config/database.js');
const loginService = require('../services/loginResponsavel.service.js');

exports.matricular = async (req, res) => {
  const { cpf_atleta } = req.params;
  const { id_turma } = req.body;

  if (!id_turma) {
    return res.status(400).json({ erro: 'id_turma é obrigatório' });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [[atleta]] = await conn.query(
      'SELECT cpf_atleta FROM atletas WHERE cpf_atleta = ?',
      [cpf_atleta]
    );

    if (!atleta) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Atleta não encontrado' });
    }

    const [[responsavel]] = await conn.query(
      `SELECT cpf_responsavel
       FROM responsavel_atleta
       WHERE cpf_atleta = ?
         AND data_fim IS NULL`,
      [cpf_atleta]
    );

    if (!responsavel) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Responsável não encontrado' });
    }

    const [[matriculaExistente]] = await conn.query(
      `SELECT id_matricula
       FROM matriculas
       WHERE cpf_atleta = ?
         AND id_turma = ?
         AND status = 'ativa'`,
      [cpf_atleta, id_turma]
    );

    if (matriculaExistente) {
      await conn.rollback();
      return res.status(400).json({
        erro: 'Atleta já está matriculado.'
      });
    }

    await conn.query(
      `INSERT INTO matriculas
       (cpf_atleta, id_turma, data_matricula, status)
       VALUES (?, ?, CURDATE(), 'ativa')`,
      [cpf_atleta, id_turma]
    );

    const dadosLogin = await loginService.criarSeNaoExistir(
      conn,
      responsavel.cpf_responsavel
    );

    await conn.commit();

    res.json({
      msg: 'Atleta matriculado com sucesso',
      login: dadosLogin || 'Login já existente'
    });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ erro: 'Erro ao matricular atleta' });
  } finally {
    conn.release();
  }
};
