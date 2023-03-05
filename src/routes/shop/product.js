const express = require("express");
const {
  getAll,
  getById,
  getCategory,
  getSearch,
} = require("../../Controllers/shop/product");

const router = express.Router();

router.get("/", getAll);

router.get("/:product_id", getById);

router.get("/search", getSearch);

router.get("/category:category", getCategory);

module.exports = router;
