const db = require('../config/database');

// CREATE
exports.createMatricula = async (req, res) => {
  try {
    const { cpf_atleta, id_turma, data_matricula, status } = req.body;

    const [result] = await db.execute(
      `INSERT INTO matriculas 
       (cpf_atleta, id_turma, data_matricula, status)
       VALUES (?, ?, ?, ?)`,
      [cpf_atleta, id_turma, data_matricula, status]
    );

    res.status(201).json({
      id_matricula: result.insertId,
      message: 'Matrícula criada com sucesso'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL
exports.getMatriculas = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM matriculas');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET BY ID
exports.getMatriculaById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      'SELECT * FROM matriculas WHERE id_matricula = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Matrícula não encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const { cpf_atleta, id_turma, status } = req.body;

    await db.execute(
      `UPDATE matriculas 
       SET cpf_atleta = ?, id_turma = ?, status = ?
       WHERE id_matricula = ?`,
      [cpf_atleta, id_turma, status, id]
    );

    res.json({ message: 'Matrícula atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteMatricula = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      'DELETE FROM matriculas WHERE id_matricula = ?',
      [id]
    );

    res.json({ message: 'Matrícula removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
