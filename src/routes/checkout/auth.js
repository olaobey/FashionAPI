const express = require("express");
const {
  register,
  login,
  checkout,
} = require("../../Controllers/checkout/auth");
const { demiAuth } = require("../../middleware/authorization");

const router = express.Router();

router.get("/", demiAuth, checkout);

router.post("/", demiAuth, login);

router.post("/", demiAuth, register);

module.exports = router;
