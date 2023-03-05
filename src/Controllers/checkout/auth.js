const AuthService = require("../../services/authService");
const { JWTcookieOptions } = require("../../utils/jwt_helpers");

module.exports.checkout = (req, res, next) => {
  res.status(200).json("Login or Register Checkout form.");
};

module.exports.login = async (req, res, next) => {
  try {
    // check if user is already logged in
    if (req.jwt && req.jwt.sub) {
      // redirect to shipping if user is logged in
      res.redirect("/checkout/shipping");
    } else {
      // grab necessary data
      const data = {
        email: req.body.email,
        password: req.body.password,
        cart_id: req.session.cart_id || null,
      };

      // await response
      const response = await AuthService.login(data);

      // attach cart_id to session, in case cart_id changed in cart consolidation
      if (response.cart && data.cart_id !== response.cart.id) {
        req.session.cart_id = response.cart.id;
      }

      // add JWT to header
      res.header("Authorization", response.token);

      // attach JWT cookie and redirect to get shipping info
      res
        .cookie("access_token", response.token, JWTcookieOptions)
        .redirect("/checkout/shipping");
    }
  } catch (err) {
    if (err.status === 400 || err.status === 401) {
      res.redirect("/checkout/auth");
    }
    next(err);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    // check if user is already logged in
    if (req.jwt && req.jwt.sub) {
      // redirect to shipping if user is logged in
      res.redirect("/checkout/shipping");
    } else {
      // grab necessary data
      const data = {
        email: req.body.email,
        password: req.body.password,
        cart_id: req.session.cart_id || null,
      };

      // await response
      const response = await AuthService.register(
        data /*{ ...req.body, cart_id: cart_id }*/
      );

      // attach cart_id to session, in case cart_id changed in cart consolidation
      if (response.cart && data.cart_id !== response.cart.id) {
        req.session.cart_id = response.cart.id;
      }

      // add JWT to header
      res.header("Authorization", response.token);

      // attach cookie and redirect to get shipping info
      res
        .cookie("access_token", response.token, JWTcookieOptions)
        .redirect("/checkout/shipping");
    }
  } catch (err) {
    if (err.status === 400 || err.status === 409) {
      res.redirect("/checkout/auth");
    }
    next(err);
  }
};
