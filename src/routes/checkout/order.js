const express = require("express");
const { getOneOrder } = require("../../Controllers/checkout/order");
const {
  getCheckoutReview,
  postCheckout,
} = require("../../Controllers/checkout/order");
const { checkoutAuth } = require("../../middleware/authorization");

const router = express.Router();

router.get("/", checkoutAuth, getCheckoutReview);

router.post("/", checkoutAuth, postCheckout);

router.get("/confirmation", checkoutAuth, getOneOrder);

module.exports = router;
