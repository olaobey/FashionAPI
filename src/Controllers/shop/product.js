const {
  getAll,
  getById,
  getCategory,
  getSearch,
} = require("../../services/productService");

module.exports.getAll = async (req, res, next) => {
  try {
    const response = await getAll();
    res.status(200).json(response);
  } catch (err) {
    next();
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const product_id = req.params.product_id;
    const response = await getById(product_id);
    res.status(200).json(response);
  } catch (err) {
    next();
  }
};

module.exports.getSearch = async (req, res, next) => {
  try {
    const query = req.query;
    const response = await getSearch(query);
    res.status(200).json(response);
  } catch (err) {
    next();
  }
};

module.exports.getCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    const response = await getCategory(category);
    res.status(200).json(response);
  } catch (err) {
    next();
  }
};
