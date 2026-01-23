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

exports.create = async (payload) => {
  const {
    cpf_atleta,
    nome,
    data_nasc = null,
    email = null,
    telefone = null,
    escola = null,
    anotacoes = null,
    data_registro,
    status,
  } = payload;

  if (!cpf_atleta || !nome || !data_registro || !status) {
    throw httpError(400, 'Campos obrigatórios: cpf_atleta, nome, data_registro, status');
  }

  if (!isValidCpf11(cpf_atleta)) {
    throw httpError(400, 'cpf_atleta inválido. Use 11 dígitos numéricos.');
  }

  if (data_nasc && !isValidDate(data_nasc)) {
    throw httpError(400, 'data_nasc inválida. Use o formato YYYY-MM-DD.');
  }

  if (!isValidDate(data_registro)) {
    throw httpError(400, 'data_registro inválida. Use o formato YYYY-MM-DD.');
  }

  if (!['ativo', 'inativo'].includes(status)) {
    throw httpError(400, "status inválido. Use 'ativo' ou 'inativo'.");
  }

  const [exists] = await db.query(
    `SELECT cpf_atleta FROM atletas WHERE cpf_atleta = ? LIMIT 1`,
    [cpf_atleta]
  );

  if (exists.length > 0) {
    throw httpError(409, 'Já existe atleta com esse CPF');
  }

  await db.query(
    `INSERT INTO atletas
     (cpf_atleta, nome, data_nasc, email, telefone, escola, anotacoes, data_registro, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cpf_atleta, nome, data_nasc, email, telefone, escola, anotacoes, data_registro, status]
  );

  return {
    cpf_atleta,
    nome,
    data_nasc,
    email,
    telefone,
    escola,
    anotacoes,
    data_registro,
    status,
  };
};

exports.getAll = async (query) => {
  const { status } = query || {};

  if (!status) {
    const [rows] = await db.query(
      `SELECT cpf_atleta, nome, data_nasc, email, telefone, escola, anotacoes, data_registro, status
       FROM atletas
       WHERE status = 'ativo'
       ORDER BY nome ASC`
    );
    return rows;
  }

  if (!['ativo', 'inativo'].includes(status)) {
    throw httpError(400, "status inválido no filtro. Use 'ativo' ou 'inativo'.");
  }

  const [rows] = await db.query(
    `SELECT cpf_atleta, nome, data_nasc, email, telefone, escola, anotacoes, data_registro, status
     FROM atletas
     WHERE status = ?
     ORDER BY nome ASC`,
    [status]
  );
  return rows;
};

exports.getByCpf = async (cpf_atleta) => {
  if (!isValidCpf11(cpf_atleta)) {
    throw httpError(400, 'cpf_atleta inválido. Use 11 dígitos numéricos.');
  }

  const [rows] = await db.query(
    `SELECT cpf_atleta, nome, data_nasc, email, telefone, escola, anotacoes, data_registro, status
     FROM atletas
     WHERE cpf_atleta = ?
     LIMIT 1`,
    [cpf_atleta]
  );

  if (rows.length === 0) throw httpError(404, 'Atleta não encontrado');
  return rows[0];
};

exports.updateByCpf = async (cpf_atleta, payload) => {
  if (!isValidCpf11(cpf_atleta)) {
    throw httpError(400, 'cpf_atleta inválido. Use 11 dígitos numéricos.');
  }

  const [exists] = await db.query(
    `SELECT cpf_atleta FROM atletas WHERE cpf_atleta = ? LIMIT 1`,
    [cpf_atleta]
  );
  if (exists.length === 0) throw httpError(404, 'Atleta não encontrado');

  const {
    nome,
    data_nasc,
    email,
    telefone,
    escola,
    anotacoes,
    data_registro,
    status,
  } = payload;

  if (data_nasc !== undefined && data_nasc !== null && !isValidDate(data_nasc)) {
    throw httpError(400, 'data_nasc inválida. Use o formato YYYY-MM-DD.');
  }
  if (data_registro !== undefined && data_registro !== null && !isValidDate(data_registro)) {
    throw httpError(400, 'data_registro inválida. Use o formato YYYY-MM-DD.');
  }
  if (status !== undefined && status !== null && !['ativo', 'inativo'].includes(status)) {
    throw httpError(400, "status inválido. Use 'ativo' ou 'inativo'.");
  }

  const fields = [];
  const values = [];

  if (nome !== undefined) { fields.push('nome = ?'); values.push(nome); }
  if (data_nasc !== undefined) { fields.push('data_nasc = ?'); values.push(data_nasc); }
  if (email !== undefined) { fields.push('email = ?'); values.push(email); }
  if (telefone !== undefined) { fields.push('telefone = ?'); values.push(telefone); }
  if (escola !== undefined) { fields.push('escola = ?'); values.push(escola); }
  if (anotacoes !== undefined) { fields.push('anotacoes = ?'); values.push(anotacoes); }
  if (data_registro !== undefined) { fields.push('data_registro = ?'); values.push(data_registro); }
  if (status !== undefined) { fields.push('status = ?'); values.push(status); }

  if (fields.length === 0) throw httpError(400, 'Nenhum campo para atualizar');

  values.push(cpf_atleta);

  await db.query(
    `UPDATE atletas SET ${fields.join(', ')} WHERE cpf_atleta = ?`,
    values
  );

  return true;
};

exports.deactivateByCpf = async (cpf_atleta) => {
  if (!isValidCpf11(cpf_atleta)) {
    throw httpError(400, 'cpf_atleta inválido. Use 11 dígitos numéricos.');
  }

  const [result] = await db.query(
    `UPDATE atletas SET status = 'inativo' WHERE cpf_atleta = ?`,
    [cpf_atleta]
  );

  if (result.affectedRows === 0) throw httpError(404, 'Atleta não encontrado');
  return true;
};
