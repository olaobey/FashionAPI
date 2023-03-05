const express = require("express");
const AuthController = require("../Controllers/authControllers");
const { isAuth } = require("../middleware/authorization");

const router = express.Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get("/refresh", AuthController.refresh_token);

router.post("/logout", isAuth, AuthController.logout);

module.exports = router;
