const service = require('../services/responsaveis.service');

exports.createResponsavel = async (req, res, next) => {
  try {
    const resp = await service.create(req.body);
    return res.status(201).json({ sucesso: true, mensagem: 'Responsável criado', dados: resp });
  } catch (error) {
    return next(error);
  }
};

exports.getResponsaveis = async (req, res, next) => {
  try {
    const rows = await service.getAll(req.query);
    return res.json({ sucesso: true, dados: rows });
  } catch (error) {
    return next(error);
  }
};

exports.getResponsavelByCpf = async (req, res, next) => {
  try {
    const resp = await service.getByCpf(req.params.cpf);
    return res.json({ sucesso: true, dados: resp });
  } catch (error) {
    return next(error);
  }
};

exports.updateResponsavel = async (req, res, next) => {
  try {
    await service.updateByCpf(req.params.cpf, req.body);
    return res.json({ sucesso: true, mensagem: 'Responsável atualizado' });
  } catch (error) {
    return next(error);
  }
};

exports.deleteResponsavel = async (req, res, next) => {
  try {
    await service.deactivateByCpf(req.params.cpf);
    return res.json({ sucesso: true, mensagem: 'Responsável desativado' });
  } catch (error) {
    return next(error);
  }
};
