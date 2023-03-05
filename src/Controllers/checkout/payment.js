const { postPayment } = require("../../services/checkoutService");
const { getAllPayments } = require("../../services/paymentService");
const { getAllAddresses } = require("../../services/addressService");

module.exports.getAllPayments = async (req, res, next) => {
  try {
    // grab user_id
    const user_id = req.jwt.sub;

    // get payments
    const response = await getAllPayments(user_id);

    response.addresses = await getAllAddresses(user_id);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.postPayment = async (req, res, next) => {
  try {
    // grab data needed for checkout
    const data = {
      ...req.body,
      user_id: req.jwt.sub,
    };

    // await response
    const response = await postPayment(data);

    // attach billing info to session
    req.session.billing_address_id = response.billing.id;

    // attach payment method to session
    req.session.payment_id = response.payment.id;

    // redirect to get order review
    res.redirect(`/checkout/order`);
  } catch (err) {
    if (err.status === 400) {
      res.redirect("/checkout/payment");
    }
    next(err);
  }
};
