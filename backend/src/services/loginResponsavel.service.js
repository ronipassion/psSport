const bcrypt = require('bcrypt');

function gerarSenha() {
  return Math.random().toString(36).slice(-8) + '@A1';
}

exports.criarSeNaoExistir = async (conn, cpf_responsavel) => {
  const [[login]] = await conn.query(
    'SELECT id_login FROM login_responsavel WHERE cpf_responsavel = ?',
    [cpf_responsavel]
  );

  if (login) {
    return null; 
  }

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