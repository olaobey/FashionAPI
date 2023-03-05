const express = require("express");
const {
  postPayment,
  getAllPayments,
} = require("../../Controllers/account/payment");
const { checkoutAuth } = require("../../middleware/authorization");
const router = express.Router();

router.get("/", checkoutAuth, getAllPayments);

router.post("/", checkoutAuth, postPayment);

module.exports = router;
