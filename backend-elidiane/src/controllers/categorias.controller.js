const db = require('../config/database');


exports.createCategoria = async (req, res) => {
  try {
    const { nome, faixa_etaria, status } = req.body;

    const [result] = await db.execute(
      'INSERT INTO categorias (nome, faixa_etaria, data_criacao, status) VALUES (?, ?, CURDATE(), ?)',
      [nome, faixa_etaria, status]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCategorias = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categorias');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      'SELECT * FROM categorias WHERE id_categoria = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, faixa_etaria, status } = req.body;

    await db.execute(
      'UPDATE categorias SET nome = ?, faixa_etaria = ?, status = ? WHERE id_categoria = ?',
      [nome, faixa_etaria, status, id]
    );

    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      'DELETE FROM categorias WHERE id_categoria = ?',
      [id]
    );

    res.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
