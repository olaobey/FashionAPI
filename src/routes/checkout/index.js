const express = require("express");
const { getCart } = require("../../Controllers/checkout/index");
const { demiAuth } = require("../../middleware/authorization");

const router = express.Router();

router.get("/", demiAuth, getCart);

module.exports = router;
