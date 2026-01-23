const service = require('../services/atletas.service');

exports.createAtleta = async (req, res, next) => {
  try {
    const atleta = await service.create(req.body);
    return res.status(201).json({
      sucesso: true,
      mensagem: 'Atleta criado com sucesso',
      dados: atleta,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAtletas = async (req, res, next) => {
  try {
    const atletas = await service.getAll(req.query);
    return res.json({ sucesso: true, dados: atletas });
  } catch (error) {
    return next(error);
  }
};

exports.getAtletaByCpf = async (req, res, next) => {
  try {
    const atleta = await service.getByCpf(req.params.cpf);
    return res.json({ sucesso: true, dados: atleta });
  } catch (error) {
    return next(error);
  }
};

exports.updateAtleta = async (req, res, next) => {
  try {
    await service.updateByCpf(req.params.cpf, req.body);
    return res.json({ sucesso: true, mensagem: 'Atleta atualizado com sucesso' });
  } catch (error) {
    return next(error);
  }
};

exports.deleteAtleta = async (req, res, next) => {
  try {
    await service.deactivateByCpf(req.params.cpf);
    return res.json({ sucesso: true, mensagem: 'Atleta desativado com sucesso' });
  } catch (error) {
    return next(error);
  }
};
