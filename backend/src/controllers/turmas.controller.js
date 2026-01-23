const service = require('../services/turmas.service');

exports.createTurma = async (req, res, next) => {
  try {
    const turma = await service.create(req.body);
    return res.status(201).json({ sucesso: true, mensagem: 'Turma criada com sucesso', dados: turma });
  } catch (error) {
    return next(error);
  }
};

exports.getTurmas = async (req, res, next) => {
  try {
    const turmas = await service.getAll(req.query);
    return res.json({ sucesso: true, dados: turmas });
  } catch (error) {
    return next(error);
  }
};

exports.getTurmaById = async (req, res, next) => {
  try {
    const turma = await service.getById(req.params.id);
    return res.json({ sucesso: true, dados: turma });
  } catch (error) {
    return next(error);
  }
};

exports.updateTurma = async (req, res, next) => {
  try {
    await service.updateById(req.params.id, req.body);
    return res.json({ sucesso: true, mensagem: 'Turma atualizada com sucesso' });
  } catch (error) {
    return next(error);
  }
};

exports.deleteTurma = async (req, res, next) => {
  try {
    await service.deactivateById(req.params.id);
    return res.json({ sucesso: true, mensagem: 'Turma desativada com sucesso' });
  } catch (error) {
    return next(error);
  }
};
