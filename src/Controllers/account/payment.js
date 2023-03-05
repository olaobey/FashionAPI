const { wipeCardData } = require("../../utils/formatUtils");
const {
  postPayment,
  getPayment,
  putPayment,
  deletePayment,
  getAllPayments,
} = require("../../services/paymentService");

module.exports.postPayment = async (req, res, nest) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // await response
    const response = await postPayment({ ...req.body, user_id: user_id });

    // wipe sensitive data
    wipeCardData(response.payment);

    // send response to client
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getAllPayments = async (req, res, nest) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // await response
    const response = await getAllPayments(user_id);

    // wipe sensitive data
    response.payments.forEach((payment) => wipeCardData(payment));

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getPayment = async (req, res, nest) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // grab payment from express params
    const payment_id = req.params.payment_id;

    // await response
    const response = await getPayment({ payment_id, user_id });

    // wipe sensitive data
    wipeCardData(response.payment);

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.putPayment = async (req, res, nest) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // grab payment from express params
    const payment_id = req.params.payment_id;

    // await response
    const response = await putPayment({
      ...req.body,
      payment_id: payment_id,
      user_id: user_id,
    });

    // wipe sensitive data
    wipeCardData(response.payment);

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deletePayment = async (req, res, nest) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // grab payment from express params
    const payment_id = req.params.payment_id;

    // await response
    const response = await deletePayment({ payment_id, user_id });

    // wipe sensitive data
    wipeCardData(response.payment);

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
