const db = require("../config/database");
const bcrypt = require("bcrypt");

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

exports.create = async (payload) => {
  const {
    cpf_colaborador,
    nome,
    email,
    senha,
    cargo,
    telefone = null,
    status = "ativo",
    data_admissao,
  } = payload;

  if (!cpf_colaborador || !nome || !email || !senha || !cargo) {
    throw httpError(
      400,
      "Campos obrigatórios: cpf_colaborador, nome, email, senha, cargo",
    );
  }

  const [exists] = await db.query(
    `SELECT cpf_colaborador, email
     FROM colaboradores
     WHERE cpf_colaborador = ? OR email = ?
     LIMIT 1`,
    [cpf_colaborador, email],
  );

  if (exists.length > 0) {
    throw httpError(409, "Já existe colaborador com esse CPF ou email");
  }

  const hash = await bcrypt.hash(senha, 10);

  await db.query(
    `INSERT INTO colaboradores
   (cpf_colaborador, nome, email, senha, cargo, data_admissao, telefone, status)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cpf_colaborador,
      nome,
      email,
      hash,
      cargo,
      data_admissao,
      telefone,
      status,
    ],
  );

  return { cpf_colaborador, nome, email, cargo, telefone, status };
};

exports.getAll = async () => {
  const [rows] = await db.query(
    `SELECT cpf_colaborador, nome, email, cargo, telefone, status
     FROM colaboradores
     WHERE status <> 'inativo'
     ORDER BY nome ASC`,
  );
  return rows;
};

exports.getByCpf = async (cpf) => {
  const [rows] = await db.query(
    `SELECT cpf_colaborador, nome, email, cargo, telefone, status
     FROM colaboradores
     WHERE cpf_colaborador = ?
     LIMIT 1`,
    [cpf],
  );

  if (rows.length === 0) throw httpError(404, "Colaborador não encontrado");
  return rows[0];
};

exports.updateByCpf = async (cpf, payload) => {
  const { nome, email, cargo, telefone, status, senha } = payload;

  const [currentRows] = await db.query(
    `SELECT cpf_colaborador, email
     FROM colaboradores
     WHERE cpf_colaborador = ?
     LIMIT 1`,
    [cpf],
  );

  if (currentRows.length === 0)
    throw httpError(404, "Colaborador não encontrado");

  const current = currentRows[0];

  if (email && email !== current.email) {
    const [emailUsed] = await db.query(
      `SELECT 1 FROM colaboradores WHERE email = ? LIMIT 1`,
      [email],
    );
    if (emailUsed.length > 0) throw httpError(409, "Email já está em uso");
  }

  const fields = [];
  const values = [];

  if (nome !== undefined) {
    fields.push("nome = ?");
    values.push(nome);
  }
  if (email !== undefined) {
    fields.push("email = ?");
    values.push(email);
  }
  if (cargo !== undefined) {
    fields.push("cargo = ?");
    values.push(cargo);
  }
  if (telefone !== undefined) {
    fields.push("telefone = ?");
    values.push(telefone);
  }
  if (status !== undefined) {
    fields.push("status = ?");
    values.push(status);
  }

  if (senha !== undefined && senha !== "") {
    const hash = await bcrypt.hash(senha, 10);
    fields.push("senha = ?");
    values.push(hash);
  }

  if (fields.length === 0) throw httpError(400, "Nenhum campo para atualizar");

  values.push(cpf);

  const [result] = await db.query(
    `UPDATE colaboradores SET ${fields.join(", ")} WHERE cpf_colaborador = ?`,
    values,
  );

  return { affectedRows: result.affectedRows };
};

exports.deactivateByCpf = async (cpf) => {
  const [result] = await db.query(
    `UPDATE colaboradores SET status = 'inativo' WHERE cpf_colaborador = ?`,
    [cpf],
  );

  if (result.affectedRows === 0)
    throw httpError(404, "Colaborador não encontrado");

  return true;
};
