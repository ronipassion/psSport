const db = require('../config/database');

exports.create = async ({ nome, faixa_etaria, status }) => {
  const [result] = await db.execute(
    `INSERT INTO categorias 
     (nome, faixa_etaria, data_criacao, status)
     VALUES (?, ?, CURDATE(), ?)`,
    [nome, faixa_etaria, status]
  );

  return { id: result.insertId };
};

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM categorias');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM categorias WHERE id_categoria = ?',
    [id]
  );

  if (rows.length === 0) {
    const error = new Error('Categoria não encontrada');
    error.status = 404;
    throw error;
  }

  return rows[0];
};

exports.update = async (id, { nome, faixa_etaria, status }) => {
  await db.execute(
    `UPDATE categorias 
     SET nome = ?, faixa_etaria = ?, status = ?
     WHERE id_categoria = ?`,
    [nome, faixa_etaria, status, id]
  );
};

exports.remove = async (id) => {
  await db.execute(
    'DELETE FROM categorias WHERE id_categoria = ?',
    [id]
  );
};
