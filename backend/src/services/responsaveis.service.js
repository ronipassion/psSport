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
    cpf_responsavel,
    nome,
    email = null,
    telefone = null,
    data_registro,
    status,
  } = payload;

  if (!cpf_responsavel || !nome || !data_registro || !status) {
    throw httpError(400, 'Campos obrigatórios: cpf_responsavel, nome, data_registro, status');
  }

  if (!isValidCpf11(cpf_responsavel)) {
    throw httpError(400, 'cpf_responsavel inválido. Use 11 dígitos numéricos.');
  }

  if (!isValidDate(data_registro)) {
    throw httpError(400, 'data_registro inválida. Use YYYY-MM-DD.');
  }

  if (!['ativo', 'inativo'].includes(status)) {
    throw httpError(400, "status inválido. Use 'ativo' ou 'inativo'.");
  }

  const [exists] = await db.query(
    `SELECT cpf_responsavel FROM responsaveis WHERE cpf_responsavel = ? LIMIT 1`,
    [cpf_responsavel]
  );
  if (exists.length > 0) throw httpError(409, 'Já existe responsável com esse CPF');

  await db.query(
    `INSERT INTO responsaveis
     (cpf_responsavel, nome, email, telefone, data_registro, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [cpf_responsavel, nome, email, telefone, data_registro, status]
  );

  return { cpf_responsavel, nome, email, telefone, data_registro, status };
};

exports.getAll = async ({ status } = {}) => {
  if (!status) {
    const [rows] = await db.query(
      `SELECT cpf_responsavel, nome, email, telefone, data_registro, status
       FROM responsaveis
       WHERE status = 'ativo'
       ORDER BY nome ASC`
    );
    return rows;
  }

  if (!['ativo', 'inativo'].includes(status)) {
    throw httpError(400, "status inválido no filtro. Use 'ativo' ou 'inativo'.");
  }

  const [rows] = await db.query(
    `SELECT cpf_responsavel, nome, email, telefone, data_registro, status
     FROM responsaveis
     WHERE status = ?
     ORDER BY nome ASC`,
    [status]
  );
  return rows;
};

exports.getByCpf = async (cpf_responsavel) => {
  if (!isValidCpf11(cpf_responsavel)) {
    throw httpError(400, 'cpf_responsavel inválido. Use 11 dígitos numéricos.');
  }

  const [rows] = await db.query(
    `SELECT cpf_responsavel, nome, email, telefone, data_registro, status
     FROM responsaveis
     WHERE cpf_responsavel = ?
     LIMIT 1`,
    [cpf_responsavel]
  );

  if (rows.length === 0) throw httpError(404, 'Responsável não encontrado');
  return rows[0];
};

exports.updateByCpf = async (cpf_responsavel, payload) => {
  if (!isValidCpf11(cpf_responsavel)) {
    throw httpError(400, 'cpf_responsavel inválido. Use 11 dígitos numéricos.');
  }

  const [exists] = await db.query(
    `SELECT cpf_responsavel FROM responsaveis WHERE cpf_responsavel = ? LIMIT 1`,
    [cpf_responsavel]
  );
  if (exists.length === 0) throw httpError(404, 'Responsável não encontrado');

  const { nome, email, telefone, data_registro, status } = payload;

  if (data_registro !== undefined && data_registro !== null && !isValidDate(data_registro)) {
    throw httpError(400, 'data_registro inválida. Use YYYY-MM-DD.');
  }
  if (status !== undefined && status !== null && !['ativo', 'inativo'].includes(status)) {
    throw httpError(400, "status inválido. Use 'ativo' ou 'inativo'.");
  }

  const fields = [];
  const values = [];

  if (nome !== undefined) { fields.push('nome = ?'); values.push(nome); }
  if (email !== undefined) { fields.push('email = ?'); values.push(email); }
  if (telefone !== undefined) { fields.push('telefone = ?'); values.push(telefone); }
  if (data_registro !== undefined) { fields.push('data_registro = ?'); values.push(data_registro); }
  if (status !== undefined) { fields.push('status = ?'); values.push(status); }

  if (fields.length === 0) throw httpError(400, 'Nenhum campo para atualizar');

  values.push(cpf_responsavel);

  await db.query(
    `UPDATE responsaveis SET ${fields.join(', ')} WHERE cpf_responsavel = ?`,
    values
  );

  return true;
};

exports.deactivateByCpf = async (cpf_responsavel) => {
  if (!isValidCpf11(cpf_responsavel)) {
    throw httpError(400, 'cpf_responsavel inválido. Use 11 dígitos numéricos.');
  }

  const [result] = await db.query(
    `UPDATE responsaveis SET status = 'inativo' WHERE cpf_responsavel = ?`,
    [cpf_responsavel]
  );

  if (result.affectedRows === 0) throw httpError(404, 'Responsável não encontrado');
  return true;
};
