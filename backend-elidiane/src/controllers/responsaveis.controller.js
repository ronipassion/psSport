const db = require('../config/database');

// CREATE
exports.createResponsavel = async (req, res) => {
  try {
    const {
      cpf_responsavel,
      nome,
      email,
      telefone,
      data_registro,
      status
    } = req.body;

    await db.execute(
      `INSERT INTO responsaveis 
       (cpf_responsavel, nome, email, telefone, data_registro, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cpf_responsavel, nome, email, telefone, data_registro, status]
    );

    res.status(201).json({ message: 'Responsável criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
exports.getResponsaveis = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM responsaveis');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY CPF
exports.getResponsavelByCpf = async (req, res) => {
  try {
    const { cpf } = req.params;

    const [rows] = await db.execute(
      'SELECT * FROM responsaveis WHERE cpf_responsavel = ?',
      [cpf]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Responsável não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateResponsavel = async (req, res) => {
  try {
    const { cpf } = req.params;
    const { nome, email, telefone, status } = req.body;

    await db.execute(
      `UPDATE responsaveis 
       SET nome = ?, email = ?, telefone = ?, status = ?
       WHERE cpf_responsavel = ?`,
      [nome, email, telefone, status, cpf]
    );

    res.json({ message: 'Responsável atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteResponsavel = async (req, res) => {
  try {
    const { cpf } = req.params;

    await db.execute(
      'DELETE FROM responsaveis WHERE cpf_responsavel = ?',
      [cpf]
    );

    res.json({ message: 'Responsável removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
