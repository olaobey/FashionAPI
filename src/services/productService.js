const httpError = require("http-errors");
const Product = require("../models/ProductModel");

module.exports.getAll = async () => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    let sort = req.query.sort || "rating";
    let category = req.query.category || "All";

    const categories = ["Tops", "Bottoms", "Shoes"];

    category === "All"
      ? (category = [...categories])
      : (category = req.query.category.split(","));

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};

    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "desc";
    }

    const products = await Product.getAll()
      .where("category")
      .in([...category])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Product.countDocuments({
      category: { $in: [...category] },
    });

    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      categories: categories,
      products,
    };

    // throw error if no response found
    if (!response) {
      throw httpError(404, "No response.");
    }

    return res.status(200).json({ response });
  } catch (err) {
    throw err;
  }
};

module.exports.getById = async (id) => {
  try {
    const product = await Product.findById(id);

    // throw error if no product found
    if (!product) {
      throw httpError(404, "Product not found.");
    }

    return { product };
  } catch (err) {
    throw err;
  }
};

module.exports.getCategory = async (category) => {
  try {
    const products = await Product.findByCategory(category);

    if (!products) {
      throw httpError(404, "No products in category.");
    }

    return { products };
  } catch (err) {
    throw err;
  }
};

module.exports.getSearch = async (query) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "rating";
    let category = req.query.category || "All";

    const categories = ["Tops", "Bottoms", "Shoes"];

    category === "All"
      ? (category = [...categories])
      : (category = req.query.category.split(","));

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "desc";
    }

    // return error if no queries
    if (!query) {
      throw httpError(400, "Please enter search query.");
    }

    // get all products
    var products = [];

    // remove products that do not match query
    for (var [key, value] of Object.entries(query)) {
      value = value.toLowerCase();
      const queryResults = await Product.findByQuery(value)
        .where("category")
        .in([...category])
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit);

      const total = await Product.countDocuments({
        category: { $in: [...category] },
        name: { $regex: search, $options: "i" },
      });

      const response = {
        error: false,
        total,
        page: page + 1,
        limit,
        categories: categories,
        queryResults,
      };

      if (response) {
        products = [...products, ...response];
      }
    }

    // return error if no products match query
    if (products.length === 0) {
      throw httpError(404, "No results. Please try another search.");
    }

    return { products };
  } catch (err) {
    throw err;
  }
};
