const {
  getCartItem,
  postCartItem,
  putCartItem,
  deleteCartItem,
} = require("../../services/cartItemService");

module.exports.postCartItem = async (req, res, next) => {
  try {
    // grab data needed to get post cart item
    const data = {
      cart_id: req.session.cart_id || null,
      user_id: req.jwt ? req.jwt.sub : null,
      product_id: req.params.product_id,
      quantity: req.body.quantity,
    };

    // get response
    const response = await postCartItem(data);

    // attach cart_id to session, in case cart_id changed
    req.session.cart_id = response.cartItem.cart_id;

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getCartItem = async (req, res, next) => {
  try {
    // grab data needed to get post cart item
    const data = {
      cart_id: req.session.cart_id || null,
      product_id: req.params.product_id,
    };

    // get response
    const response = await getCartItem(data);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.putCartItem = async (req, res, next) => {
  try {
    // grab data needed to get post cart item
    const data = {
      cart_id: req.session.cart_id || null,
      user_id: req.jwt ? req.jwt.sub : null,
      product_id: req.params.product_id,
      quantity: req.body.quantity,
    };

    // get response
    const response = await putCartItem(data);

    // attach cart_id to session, in case cart_id changed
    req.session.cart_id = response.cartItem.cart_id;

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCartItem = async (req, res, next) => {
  try {
    // grab data needed to get post cart item
    const data = {
      cart_id: req.session.cart_id || null,
      user_id: req.jwt ? req.jwt.sub : null,
      product_id: req.params.product_id,
    };

    // get response
    const response = await deleteCartItem(data);

    // attach cart_id to session, in case cart_id changed
    req.session.cart_id = response.cartItem.cart_id;

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
