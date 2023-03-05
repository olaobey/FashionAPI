const { postShipping } = require("../../services/checkoutService");
const { getAllAddresses } = require("../../services/addressService");

module.exports.getAllAddresses = async (req, res, next) => {
  try {
    // grab user_id
    const user_id = req.jwt.sub;

    // get addresses
    const response = await getAllAddresses(user_id);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.postShipping = async (req, res, next) => {
  try {
    // grab user_id from request
    const user_id = req.jwt.sub;

    // await response
    const response = await postShipping({ ...req.body, user_id: user_id });

    // attach shipping address to session
    req.session.shipping_address_id = response.shipping.id;

    // redirect to get payment info
    res.redirect("/checkout/payment");
  } catch (err) {
    if (err.status === 400) {
      res.redirect("/checkout/shipping");
    }
    next(err);
  }
};
