const express = require("express");
const {
  postAddress,
  getAddress,
  putAddress,
  deleteAddress,
  getAllAddresses,
} = require("../../Controllers/account/address");

const router = express.Router({ mergeParams: true });

router.post("/", postAddress);

router.get("/getAll", getAllAddresses);

router.get("/:address_id", getAddress);

router.put("/:address_id", putAddress);

router.delete("/:address_id", deleteAddress);

module.exports = router;
