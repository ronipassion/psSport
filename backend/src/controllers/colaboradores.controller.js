const colaboradoresService = require('../services/colaboradores.service');

exports.createColaborador = async (req, res, next) => {
  try {
    const colaborador = await colaboradoresService.create(req.body);
    return res.status(201).json({
      sucesso: true,
      mensagem: 'Colaborador criado com sucesso',
      colaborador,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getColaboradores = async (req, res, next) => {
  try {
    const colaboradores = await colaboradoresService.getAll();
    return res.json({ sucesso: true, dados: colaboradores });
  } catch (error) {
    return next(error);
  }
};

exports.getColaboradorByCpf = async (req, res, next) => {
  try {
    const { cpf } = req.params;
    const colaborador = await colaboradoresService.getByCpf(cpf);
    return res.json({ sucesso: true, dados: colaborador });
  } catch (error) {
    return next(error);
  }
};

exports.updateColaborador = async (req, res, next) => {
  try {
    const { cpf } = req.params;
    await colaboradoresService.updateByCpf(cpf, req.body);
    return res.json({ sucesso: true, mensagem: 'Colaborador atualizado com sucesso' });
  } catch (error) {
    return next(error);
  }
};

exports.deleteColaborador = async (req, res, next) => {
  try {
    const { cpf } = req.params;
    await colaboradoresService.deactivateByCpf(cpf);
    return res.json({ sucesso: true, mensagem: 'Colaborador desativado com sucesso' });
  } catch (error) {
    return next(error);
  }
};


