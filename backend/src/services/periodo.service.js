const db = require('../config/database');

async function createPeriodo(data) {
  const { descricao, data_inicio, data_fim, status } = data;

  const sql = `
    INSERT INTO periodos (descricao, data_inicio, data_fim, status)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    descricao,
    data_inicio,
    data_fim,
    status
  ]);

  return result.insertId;
}

async function getPeriodos() {
  const [rows] = await db.execute(
    'SELECT * FROM periodos'
  );
  return rows;
}

async function getPeriodoById(id) {
  const [rows] = await db.execute(
    'SELECT * FROM periodos WHERE id_periodo = ?',
    [id]
  );

  return rows[0];
}

async function updatePeriodo(id, data) {
  const { descricao, data_inicio, data_fim, status } = data;

  const sql = `
    UPDATE periodos
    SET descricao = ?, data_inicio = ?, data_fim = ?, status = ?
    WHERE id_periodo = ?
  `;

  const [result] = await db.execute(sql, [
    descricao,
    data_inicio,
    data_fim,
    status,
    id
  ]);

  return result.affectedRows;
}

async function inativarPeriodo(id) {
  const [rows] = await db.execute(
    'SELECT status FROM periodos WHERE id_periodo = ?',
    [id]
  );

  if (rows.length === 0) return null;

  if (rows[0].status === 'inativo') return 'inativo';

  await db.execute(
    `UPDATE periodos
     SET status = 'inativo'
     WHERE id_periodo = ?`,
    [id]
  );

  return 'ok';
}

module.exports = {
  createPeriodo,
  getPeriodos,
  getPeriodoById,
  updatePeriodo,
  inativarPeriodo
};