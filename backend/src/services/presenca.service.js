const db = require('../config/database');

const create = async (data) => {
  const { id_matricula, data_aula, presente, justificativa } = data;

  const [result] = await db.query(
    `
    INSERT INTO presenca (id_matricula, data_aula, presente, justificativa)
    VALUES (?, ?, ?, ?)
    `,
    [id_matricula, data_aula, presente, justificativa]
  );

  return result;
};

const findAll = async () => {
  const [rows] = await db.query('SELECT * FROM presenca');
  return rows;
};

const findById = async (id_presenca) => {
  const [rows] = await db.query(
    'SELECT * FROM presenca WHERE id_presenca = ?',
    [id_presenca]
  );
  return rows[0];
};

const update = async (id_presenca, data) => {
  const { presente, justificativa } = data;

  const [result] = await db.query(
    `
    UPDATE presenca
    SET presente = ?, justificativa = ?
    WHERE id_presenca = ?
    `,
    [presente, justificativa, id_presenca]
  );

  return result;
};

const findByTurma = async (id_turma) => {
  const [rows] = await db.query(
    `
    SELECT
      p.id_presenca,
      p.data_aula,
      p.presente,
      p.justificativa,
      a.nome AS nome_atleta
    FROM presenca p
    JOIN matriculas m ON p.id_matricula = m.id_matricula
    JOIN atletas a ON m.cpf_atleta = a.cpf_atleta
    WHERE m.id_turma = ?
    ORDER BY p.data_aula, a.nome
    `,
    [id_turma]
  );

  return rows;
};

const findByAula = async (id_turma, data_aula) => {
  const [rows] = await db.query(
    `
    SELECT
      p.id_presenca,
      p.presente,
      p.justificativa,
      a.nome AS nome_atleta
    FROM presenca p
    JOIN matriculas m ON p.id_matricula = m.id_matricula
    JOIN atletas a ON m.cpf_atleta = a.cpf_atleta
    WHERE m.id_turma = ?
      AND p.data_aula = ?
    ORDER BY a.nome
    `,
    [id_turma, data_aula]
  );

  return rows;
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  findByTurma,
  findByAula
};

