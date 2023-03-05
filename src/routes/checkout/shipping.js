const express = require("express");
const {
  getAllAddresses,
  postShipping,
} = require("../../Controllers/checkout/shipping");
const { checkoutAuth } = require("../../middleware/authorization");

const router = express.Router();

router.get("/", checkoutAuth, getAllAddresses);

router.post("/", checkoutAuth, postShipping);

module.exports = router;
