const bcrypt = require('bcrypt');
const crypto = require('crypto');

function gerarSenha() {
  return crypto.randomBytes(6).toString('base64url') + '@A1';
}

exports.criarSeNaoExistir = async (conn, cpf_responsavel) => {
  const [[resp]] = await conn.query(
    `SELECT cpf_responsavel, status
     FROM responsaveis
     WHERE cpf_responsavel = ?
     LIMIT 1`,
    [cpf_responsavel]
  );

  if (!resp) {
    throw new Error('Responsável não existe (não é possível criar login).');
  }
  if (resp.status !== 'ativo') {
    throw new Error('Responsável inativo (não é possível criar login).');
  }

  const [[login]] = await conn.query(
    `SELECT id_login
     FROM login_responsavel
     WHERE cpf_responsavel = ?
     LIMIT 1`,
    [cpf_responsavel]
  );

  if (login) return null;

  const senhaTemp = gerarSenha();
  const hash = await bcrypt.hash(senhaTemp, 10);

  const emailAcesso = `${cpf_responsavel}@acesso.com`;

  await conn.query(
    `INSERT INTO login_responsavel
     (cpf_responsavel, email_acesso, senha, data_cadastro, status)
     VALUES (?, ?, ?, CURDATE(), 'ativo')`,
    [cpf_responsavel, emailAcesso, hash]
  );

  return {
    email_acesso: emailAcesso,
    senha_temporaria: senhaTemp
  };
};
