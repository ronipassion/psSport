const service = require('../services/responsavelAtleta.service');

exports.vincularResponsavelAoAtleta = async (req, res, next) => {
  try {
    const { cpf_atleta } = req.params;
    const { cpf_responsavel, data_inicio } = req.body;

    const vinculo = await service.vincular({ cpf_atleta, cpf_responsavel, data_inicio });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Vínculo responsável-atleta criado com sucesso',
      dados: vinculo,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getVinculoAtivo = async (req, res, next) => {
  try {
    const { cpf_atleta } = req.params;
    const vinculo = await service.getVinculoAtivoPorAtleta(cpf_atleta);

    return res.json({ sucesso: true, dados: vinculo });
  } catch (error) {
    return next(error);
  }
};

exports.desvincularAtivo = async (req, res, next) => {
  try {
    const { cpf_atleta } = req.params;
    await service.desvincularAtivoPorAtleta(cpf_atleta);

    return res.json({ sucesso: true, mensagem: 'Vínculo ativo encerrado com sucesso' });
  } catch (error) {
    return next(error);
  }
};
