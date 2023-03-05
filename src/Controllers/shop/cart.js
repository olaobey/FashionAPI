const { postCart, getCart } = require("../../services/cartService");

module.exports.postCart = async (req, res, next) => {
  try {
    // grab user_id from json web token
    const user_id = req.jwt ? req.jwt.sub : null;

    // await response
    const response = await postCart(user_id);

    // attach cart_id to session
    req.session.cart_id = response.cart.id;

    // send response to client
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getCart = async (req, res, next) => {
  try {
    // grab cart_id from express session, if it exists
    const cart_id = req.session.cart_id || null;

    // grad user_id, if it exists
    const user_id = req.jwt ? req.jwt.sub : null;

    // await response
    const response = await getCart(cart_id, user_id);

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
