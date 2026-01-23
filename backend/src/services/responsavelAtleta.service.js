const db = require('../config/database');

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function isValidCpf11(value) {
  return typeof value === 'string' && /^\d{11}$/.test(value);
}

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

exports.vincular = async ({ cpf_atleta, cpf_responsavel, data_inicio }) => {
  if (!cpf_atleta || !cpf_responsavel) {
    throw httpError(400, 'Campos obrigatórios: cpf_atleta, cpf_responsavel');
  }

  if (!isValidCpf11(cpf_atleta)) throw httpError(400, 'cpf_atleta inválido (11 dígitos).');
  if (!isValidCpf11(cpf_responsavel)) throw httpError(400, 'cpf_responsavel inválido (11 dígitos).');

  if (data_inicio && !isValidDate(data_inicio)) {
    throw httpError(400, 'data_inicio inválida. Use YYYY-MM-DD.');
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[atleta]] = await conn.query(
      `SELECT cpf_atleta, status FROM atletas WHERE cpf_atleta = ? LIMIT 1`,
      [cpf_atleta]
    );
    if (!atleta) throw httpError(404, 'Atleta não encontrado');
    if (atleta.status !== 'ativo') throw httpError(400, 'Atleta está inativo');

    const [[resp]] = await conn.query(
      `SELECT cpf_responsavel, status FROM responsaveis WHERE cpf_responsavel = ? LIMIT 1`,
      [cpf_responsavel]
    );
    if (!resp) throw httpError(404, 'Responsável não encontrado');
    if (resp.status !== 'ativo') throw httpError(400, 'Responsável está inativo');

    await conn.query(
      `UPDATE responsavel_atleta
       SET data_fim = CURDATE()
       WHERE cpf_atleta = ?
         AND data_fim IS NULL`,
      [cpf_atleta]
    );

    if (data_inicio) {
      await conn.query(
        `INSERT INTO responsavel_atleta (cpf_responsavel, cpf_atleta, data_inicio, data_fim)
         VALUES (?, ?, ?, NULL)`,
        [cpf_responsavel, cpf_atleta, data_inicio]
      );
    } else {
      await conn.query(
        `INSERT INTO responsavel_atleta (cpf_responsavel, cpf_atleta, data_inicio, data_fim)
         VALUES (?, ?, CURDATE(), NULL)`,
        [cpf_responsavel, cpf_atleta]
      );
    }

    await conn.commit();

    return {
      cpf_atleta,
      cpf_responsavel,
      data_inicio: data_inicio || 'CURDATE()',
      data_fim: null,
    };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

exports.getVinculoAtivoPorAtleta = async (cpf_atleta) => {
  if (!isValidCpf11(cpf_atleta)) throw httpError(400, 'cpf_atleta inválido (11 dígitos).');

  const [rows] = await db.query(
    `SELECT cpf_responsavel, cpf_atleta, data_inicio, data_fim
     FROM responsavel_atleta
     WHERE cpf_atleta = ?
       AND data_fim IS NULL
     LIMIT 1`,
    [cpf_atleta]
  );

  if (rows.length === 0) throw httpError(404, 'Nenhum vínculo ativo encontrado para este atleta');
  return rows[0];
};

exports.desvincularAtivoPorAtleta = async (cpf_atleta) => {
  if (!isValidCpf11(cpf_atleta)) throw httpError(400, 'cpf_atleta inválido (11 dígitos).');

  const [result] = await db.query(
    `UPDATE responsavel_atleta
     SET data_fim = CURDATE()
     WHERE cpf_atleta = ?
       AND data_fim IS NULL`,
    [cpf_atleta]
  );

  if (result.affectedRows === 0) throw httpError(404, 'Nenhum vínculo ativo para encerrar');
  return true;
};
