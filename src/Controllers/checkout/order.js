const { wipeCardData } = require("../../utils/formatUtils");
const { getOneOrder } = require("../../services/orderService");
const {
  getCheckoutReview,
  postCheckout,
} = require("../../services/checkoutService");

module.exports.getCheckoutReview = async (req, res, next) => {
  try {
    // grab ids needed to get checkout review
    const data = {
      cart_id: req.session.cart_id || null,
      shipping_address_id: req.session.shipping_address_id || null,
      billing_address_id: req.session.billing_address_id || null,
      payment_id: req.session.payment_id || null,
      user_id: req.jwt.sub,
    };

    // get review of checkout
    const response = await getCheckoutReview(data);

    // wipe sensitive payment data
    wipeCardData(response.payment);

    res.status(200).json(response);

    res.status(200).json(response);
  } catch (err) {
    if (err.status === 400) {
      // redirect if required session info is missing
      res.redirect("/cart/checkout");
    }
    next(err);
  }
};

module.exports.postCheckout = async (req, res, next) => {
  try {
    // grab ids needed to get checkout summary
    const data = {
      cart_id: req.session.cart_id || null,
      shipping_address_id: req.session.shipping_address_id || null,
      billing_address_id: req.session.billing_address_id || null,
      payment_id: req.session.payment_id || null,
      user_id: req.jwt.sub,
    };

    // create order
    const response = await postCheckout(data);

    // attach order_id to session
    req.session.order_id = response.order.id;

    // redirect to get order review
    res.redirect(`/checkout/order/confirmation`);
  } catch (err) {
    if (err.status === 400) {
      // redirect if required session info is missing
      res.redirect("/cart/checkout");
    }
    next(err);
  }
};

module.exports.getOneOrder = async (req, res, next) => {
  try {
    const data = {
      user_id: req.jwt.sub,
      order_id: req.session.order_id || null,
    };

    // query database to confirm order went through
    const response = await getOneOrder(data);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
