const db = require('../config/database');

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

exports.create = async (payload) => {
  const {
    nome = null,
    horario = null,
    dias_da_semana = null,
    id_categoria = null,
    id_periodo = null,
    status,
  } = payload;

  if (!status) throw httpError(400, "Campo obrigatório: status ('ativo'|'inativo').");
  if (!['ativo', 'inativo'].includes(status)) throw httpError(400, "status inválido. Use 'ativo' ou 'inativo'.");

  if (id_categoria !== null && id_categoria !== undefined) {
    const [cat] = await db.query(
      `SELECT id_categoria FROM categorias WHERE id_categoria = ? LIMIT 1`,
      [id_categoria]
    );
    if (cat.length === 0) throw httpError(400, 'id_categoria não existe');
  }

  if (id_periodo !== null && id_periodo !== undefined) {
    const [per] = await db.query(
      `SELECT id_periodo FROM periodos WHERE id_periodo = ? LIMIT 1`,
      [id_periodo]
    );
    if (per.length === 0) throw httpError(400, 'id_periodo não existe');
  }

  const [result] = await db.query(
    `INSERT INTO turmas
     (nome, horario, dias_da_semana, id_categoria, id_periodo, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, horario, dias_da_semana, id_categoria, id_periodo, status]
  );

  return {
    id_turma: result.insertId,
    nome,
    horario,
    dias_da_semana,
    id_categoria,
    id_periodo,
    status,
  };
};

exports.getAll = async ({ status } = {}) => {
  if (!status) {
    const [rows] = await db.query(
      `SELECT id_turma, nome, horario, dias_da_semana, id_categoria, id_periodo, status
       FROM turmas
       WHERE status = 'ativo'
       ORDER BY id_turma DESC`
    );
    return rows;
  }

  if (!['ativo', 'inativo'].includes(status)) {
    throw httpError(400, "status inválido no filtro. Use 'ativo' ou 'inativo'.");
  }

  const [rows] = await db.query(
    `SELECT id_turma, nome, horario, dias_da_semana, id_categoria, id_periodo, status
     FROM turmas
     WHERE status = ?
     ORDER BY id_turma DESC`,
    [status]
  );
  return rows;
};

exports.getById = async (id_turma) => {
  const [rows] = await db.query(
    `SELECT id_turma, nome, horario, dias_da_semana, id_categoria, id_periodo, status
     FROM turmas
     WHERE id_turma = ?
     LIMIT 1`,
    [id_turma]
  );

  if (rows.length === 0) throw httpError(404, 'Turma não encontrada');
  return rows[0];
};

exports.updateById = async (id_turma, payload) => {
  const [exists] = await db.query(
    `SELECT id_turma FROM turmas WHERE id_turma = ? LIMIT 1`,
    [id_turma]
  );
  if (exists.length === 0) throw httpError(404, 'Turma não encontrada');

  const {
    nome,
    horario,
    dias_da_semana,
    id_categoria,
    id_periodo,
    status,
  } = payload;

  if (status !== undefined && status !== null && !['ativo', 'inativo'].includes(status)) {
    throw httpError(400, "status inválido. Use 'ativo' ou 'inativo'.");
  }

  if (id_categoria !== undefined) {
    if (id_categoria !== null) {
      const [cat] = await db.query(
        `SELECT id_categoria FROM categorias WHERE id_categoria = ? LIMIT 1`,
        [id_categoria]
      );
      if (cat.length === 0) throw httpError(400, 'id_categoria não existe');
    }
  }

  if (id_periodo !== undefined) {
    if (id_periodo !== null) {
      const [per] = await db.query(
        `SELECT id_periodo FROM periodos WHERE id_periodo = ? LIMIT 1`,
        [id_periodo]
      );
      if (per.length === 0) throw httpError(400, 'id_periodo não existe');
    }
  }

  const fields = [];
  const values = [];

  if (nome !== undefined) { fields.push('nome = ?'); values.push(nome); }
  if (horario !== undefined) { fields.push('horario = ?'); values.push(horario); }
  if (dias_da_semana !== undefined) { fields.push('dias_da_semana = ?'); values.push(dias_da_semana); }
  if (id_categoria !== undefined) { fields.push('id_categoria = ?'); values.push(id_categoria); }
  if (id_periodo !== undefined) { fields.push('id_periodo = ?'); values.push(id_periodo); }
  if (status !== undefined) { fields.push('status = ?'); values.push(status); }

  if (fields.length === 0) throw httpError(400, 'Nenhum campo para atualizar');

  values.push(id_turma);

  await db.query(
    `UPDATE turmas SET ${fields.join(', ')} WHERE id_turma = ?`,
    values
  );

  return true;
};

exports.deactivateById = async (id_turma) => {
  const [result] = await db.query(
    `UPDATE turmas SET status = 'inativo' WHERE id_turma = ?`,
    [id_turma]
  );

  if (result.affectedRows === 0) throw httpError(404, 'Turma não encontrada');
  return true;
};
