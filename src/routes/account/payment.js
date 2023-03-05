const express = require("express");
const {
  postPayment,
  getPayment,
  putPayment,
  deletePayment,
  getAllPayments,
} = require("../../Controllers/account/payment");

const router = express.Router({ mergeParams: true });

router.get("/:payment_id", getPayment);

router.get("/getAll", getAllPayments);

router.post("/", postPayment);

router.put("/:payment_id", putPayment);

router.delete("/:payment_id", deletePayment);

module.exports = router;
