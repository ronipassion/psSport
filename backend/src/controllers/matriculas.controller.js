const service = require('../services/matriculas.service');

exports.createMatricula = async (req, res, next) => {
  try {
    const { cpf_atleta } = req.params;
    const { id_turma } = req.body;

    const result = await service.createMatricula({ cpf_atleta, id_turma });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Atleta matriculado com sucesso',
      dados: result,
    });
  } catch (error) {
    return next(error);
  }
};