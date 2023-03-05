const jwt = require("jsonwebtoken");
const Helper = require("../utils/helpers");
const httpError = require("http-errors");
const { jwtTokens } = require("../utils/jwt_helpers");
const { wipePassword } = require("../utils/formatUtils");
const cartConsolidator = require("../utils/cartConsolidator");
const { validateAuthInputs } = require("../validators/validatorUtils");
const User = require("../models/UserModel");

// Typically store refresh tokens in a database
let refreshTokens = [];

// Create A User
// @param {object} req
// @param {object} res

const register = async (data) => {
  try {
    // check for required inputs
    validateAuthInputs(data);

    // Generate hashPassword with salt
    const hashPassword = Helper.hashPassword(data.password);

    // check if user already exists
    const user = await User.findByEmail(data.email);

    if (user) {
      throw httpError(409, "Email already in use");
    }

    // create new user
    const newUser = await User.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      hashPassword: data.hashPassword,
      phone_number: data.phone_number,
    });
    // handle if user had shopping cart before registering in
    // const { cart, cartItems } = await cartConsolidator(
    //   data.cart_id,
    //   newUser.id
    // );

    // wipe password info before returning
    wipePassword(newUser);

    // attach JWT and return user
    const token = jwtTokens(newUser);
    console.log(newUser);
    console.log(token);
    return { ...token };
  } catch (error) {
    throw error;
  }
};

// Login
// @param {object} req
// @param {object} res
// @returns {object} user object

const login = async (data) => {
  try {
    // check for required inputs
    validateAuthInputs(data);

    // check if user already exists
    const user = await User.findByEmail(data.email);
    if (!user) {
      throw httpError(401, "Incorrect email or password.");
    }

    // Comparison of password
    const comparePassword = Helper.comparePassword(
      data.password,
      user.hashPassword
    );

    if (!comparePassword) {
      throw httpError(401, {
        message: "The password you provided is incorrect",
      });
    }

    // handle if user had shopping cart before logging in
    const { cart, cartItems } = await cartConsolidator(data.cart_id, user.id);

    // wipe password info before returning
    wipePassword(user);

    // attach JWT and return user
    let tokens = jwtTokens(user);

    // Assigning refresh token in http-only cookie
    res.cookie("jwt", tokens.refreshToken, tokens.accessToken, {
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    refreshTokens.push(tokens.refreshToken);
    return res.status(200).send({
      status: "Success",
      token: tokens.refreshToken,
      token: tokens.accessToken,
      cart: cart,
      cartItems: cartItems,
    });
  } catch (error) {
    // Throw invalid credentials error if credentials don't match
    throw httpError(406, { message: "Invalid credentials" });
  }
};

const refresh_token = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;
    console.log(req.cookies);
    if (refreshToken === null) throw httpError(401, { message: "Empty token" });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) throw httpError(403, { error: error.message });
        let tokens = jwtTokens(user);
        res.cookie("refresh_token", tokens.refreshToken, {
          ...(process.env.COOKIE_DOMAIN && {
            domain: process.env.COOKIE_DOMAIN,
          }),
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.json({ status: "Success", result: tokens });
      }
    );
  } catch (error) {
    throw httpError(401, { error: error.message });
  }
};
// Deauthenticate - log out
// Delete refresh token
const logOut = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res
      .status(200)
      .send({ status: "Success", message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    throw httpError(401, { error: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh_token,
  logOut,
};
