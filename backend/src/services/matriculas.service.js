const db = require('../config/database');
const loginResponsavelService = require('./loginResponsavel.service');

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

exports.createMatricula = async ({ cpf_atleta, id_turma }) => {
  if (!id_turma) throw httpError(400, 'id_turma é obrigatório');

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [[atleta]] = await conn.query(
      'SELECT cpf_atleta FROM atletas WHERE cpf_atleta = ?',
      [cpf_atleta]
    );
    if (!atleta) throw httpError(404, 'Atleta não encontrado');

    const [[responsavel]] = await conn.query(
      `SELECT cpf_responsavel
       FROM responsavel_atleta
       WHERE cpf_atleta = ?
         AND data_fim IS NULL`,
      [cpf_atleta]
    );
    if (!responsavel) throw httpError(400, 'Responsável não encontrado');

    const [[matriculaExistente]] = await conn.query(
      `SELECT id_matricula
       FROM matriculas
       WHERE cpf_atleta = ?
         AND id_turma = ?
         AND status = 'ativa'`,
      [cpf_atleta, id_turma]
    );
    if (matriculaExistente) throw httpError(400, 'Atleta já está matriculado.');

    const [insert] = await conn.query(
      `INSERT INTO matriculas
       (cpf_atleta, id_turma, data_matricula, status)
       VALUES (?, ?, CURDATE(), 'ativa')`,
      [cpf_atleta, id_turma]
    );

    const dadosLogin = await loginResponsavelService.criarSeNaoExistir(
      conn,
      responsavel.cpf_responsavel
    );

    await conn.commit();

    return {
      id_matricula: insert.insertId,
      cpf_atleta,
      id_turma,
      login: dadosLogin || 'Login já existente',
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};