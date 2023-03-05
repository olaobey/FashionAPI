const { getCart } = require("../../services/cartService");

module.exports.getCart = async (req, res, next) => {
  try {
    try {
      // grab cart_id from express session, if it exists
      const cart_id = req.session.cart_id || null;

      // getCart to check if cart is empty
      const cart = await getCart(cart_id);

      // grab user_id from json web token
      const user_id = req.jwt ? req.jwt.sub : null;

      if (user_id || cart) {
        // if user is signed in, skip sign in, redirect to shipping
        res.redirect("/checkout/shipping");
      } else {
        // redirect to sign in
        res.redirect("/checkout/auth");
      }
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
