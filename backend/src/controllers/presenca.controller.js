const db = require('../config/database');
const presencaService = require('../services/presenca.service');

exports.createPresenca = async (req, res) => {
  try {
    const result = await presencaService.create(req.body);

    res.status(201).json({
      message: 'Presença registrada com sucesso',
      id_presenca: result.insertId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'Presença já registrada para esta matrícula nesta data'
      });
    }
    res.status(500).json(error);
  }
};

exports.getAllPresencas = async (req, res) => {
  try {
    const rows = await presencaService.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPresencaById = async (req, res) => {
  try {
    const presenca = await presencaService.findById(req.params.id);

    if (!presenca) {
      return res.status(404).json({ message: 'Presença não encontrada' });
    }

    res.json(presenca);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updatePresenca = async (req, res) => {
  try {
    const result = await presencaService.update(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Presença não encontrada' });
    }

    res.json({ message: 'Presença atualizada com sucesso' });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPresencasPorTurma = async (req, res) => {
  try {
    const rows = await presencaService.findByTurma(req.params.id_turma);
    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getPresencasPorAula = async (req, res) => {
  try {
    const { id_turma } = req.params;
    const { data_aula } = req.query;

    if (!data_aula) {
      return res.status(400).json({ message: 'data_aula é obrigatória' });
    }

    const rows = await presencaService.findByAula(id_turma, data_aula);
    res.json(rows);
  } catch (error) {
    res.status(500).json(error);
  }
};
