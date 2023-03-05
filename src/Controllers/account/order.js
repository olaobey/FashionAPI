const { getAllOrders, getOneOrder } = require("../../services/orderService");

module.exports.getAllOrders = async (req, res, next) => {
  try {
    const user_id = req.jwt.sub;

    const response = await getAllOrders(user_id);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getOneOrder = async (req, res, next) => {
  try {
    const data = {
      user_id: req.jwt.sub,
      order_id: req.params.order_id,
    };

    const response = await getOneOrder(data);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
