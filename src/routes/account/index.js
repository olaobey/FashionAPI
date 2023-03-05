const express = require("express");

const { getAccount, putAccount } = require("../../Controllers/account/index");
const { isAuth } = require("../../middleware/authorization");

const router = express.Router();

router.get("/", isAuth, getAccount);

router.put("/", isAuth, putAccount);

module.exports = router;
