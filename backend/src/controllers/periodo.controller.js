const db = require('../config/database');
const periodoService = require('../services/periodo.service');

exports.createPeriodo = async (req, res) => {
  try {
    const id = await periodoService.createPeriodo(req.body);

    res.status(201).json({
      message: 'Período criado com sucesso',
      id_periodo: id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPeriodos = async (req, res) => {
  try {
    const periodos = await periodoService.getPeriodos();
    res.json(periodos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPeriodoById = async (req, res) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.id);

    if (!periodo) {
      return res.status(404).json({
        message: 'Período não encontrado'
      });
    }

    res.json(periodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePeriodo = async (req, res) => {
  try {
    const affectedRows = await periodoService.updatePeriodo(
      req.params.id,
      req.body
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        message: 'Período não encontrado'
      });
    }

    res.json({ message: 'Período atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.inativarPeriodo = async (req, res) => {
  try {
    const result = await periodoService.inativarPeriodo(req.params.id);

    if (result === null) {
      return res.status(404).json({
        message: 'Período não encontrado'
      });
    }

    if (result === 'inativo') {
      return res.status(409).json({
        message: 'Período já está inativo'
      });
    }

    res.json({ message: 'Período inativado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
