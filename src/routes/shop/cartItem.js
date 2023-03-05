const express = require("express");
const {
  getCartItem,
  postCartItem,
  putCartItem,
  deleteCartItem,
} = require("../../Controllers/shop/cartItem");

const router = express.Router({ mergeParams: true });

router.post("/:product_id", postCartItem);

router.get("/:product_id", getCartItem);

router.put("/:product_id", putCartItem);

router.delete("/:product_id", deleteCartItem);

module.exports = router;
