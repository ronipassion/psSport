const categoriasService = require('../services/categorias.service');

exports.createCategoria = async (req, res, next) => {
  try {
    const categoria = await categoriasService.create(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
};

exports.getCategorias = async (req, res, next) => {
  try {
    const categorias = await categoriasService.getAll();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

exports.getCategoriaById = async (req, res, next) => {
  try {
    const categoria = await categoriasService.getById(req.params.id);
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

exports.updateCategoria = async (req, res, next) => {
  try {
    await categoriasService.update(req.params.id, req.body);
    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategoria = async (req, res, next) => {
  try {
    await categoriasService.remove(req.params.id);
    res.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    next(error);
  }
};
