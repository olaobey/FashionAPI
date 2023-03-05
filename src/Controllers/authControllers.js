const Service = require("../services/authService");
const { JWTcookieOptions } = require("../utils/jwt_helpers");
const dotenv = require("dotenv");

dotenv.config();

// Signup controller
const register = async (req, res, next) => {
  try {
    console.log(req.body);
    // grab cart_id from express session, if it exists
    // const cart_id = req.session.cart_id ? req.session.cart_id : null;

    // await response
    const response = await Service.register({ ...req.body });
    console.log(response);

    // attach cart_id to session, in case cart_id changed in cart consolidation
    // if (response.cart) {
    //   req.session.cart_id = response.cart.id;
    // }

    // put jwt in a secure cookie and send to client
    res
      .cookie("access_token", response.token, JWTcookieOptions)
      .status(200)
      .json(response);
  } catch (err) {
    throw err;
  }
};

const login = async (req, res, next) => {
  try {
    // grab cart_id from express session, if it exists
    const cart_id = req.session.cart_id ? req.session.cart_id : null;

    // await response
    const response = await Service.login({ ...req.body, cart_id: cart_id });

    // attach cart_id to session, in case cart_id changed in cart consolidation
    if (response.cart) {
      req.session.cart_id = response.cart.id;
    }

    // put jwt in a secure cookie and send to client
    res
      .cookie("jwt", response.token, JWTcookieOptions)
      .status(200)
      .json(response);
  } catch (err) {
    next(err);
  }
};

const refresh_token = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (refreshToken === null) throw httpError(401, { message: "Empty token" });
    const tokens = await Service.refresh_token({ refreshToken });
    res.cookie("refresh_token", tokens.refreshToken, {
      ...(process.env.COOKIE_DOMAIN && {
        domain: process.env.COOKIE_DOMAIN,
      }),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({ status: "Success", result: tokens });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  if (req.jwt) delete req.jwt;
  res.clearCookie("access_token");
  res.clearCookie("connect.sid");
  res.status(200).json("You have successfully been logged out.");
};

module.exports = {
  register,
  login,
  refresh_token,
  logout,
};
