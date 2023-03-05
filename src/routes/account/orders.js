const express = require("express");
const {
  getAllOrders,
  getOneOrder,
} = require("../../Controllers/account/order");

const router = express.Router({ mergeParams: true });

router.get("/:order_id", getOneOrder);
router.get("/", getAllOrders);

module.exports = router;
