const express = require("express");
const { postCart, getCart } = require("../../Controllers/shop/cart");
const { demiAuth } = require("../../middleware/authorization");

const router = express.Router();

router.post("/cart", demiAuth, postCart);

router.get("/cart", demiAuth, getCart);

module.exports = router;
