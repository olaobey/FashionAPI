const {
  postAddress,
  getAddress,
  putAddress,
  deleteAddress,
  getAllAddresses,
} = require("../../services/addressService");

module.exports.postAddress = async (req, res, next) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // await response
    const response = await postAddress({ ...req.body, user_id: user_id });

    // send response to client
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getAllAddresses = async (req, res, next) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // await response
    const response = await getAllAddresses(user_id);

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.getAddress = async (req, res, next) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // grab address from express params
    const address_id = req.params.address_id;

    // await response
    const response = await getAddress({ address_id, user_id });

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.putAddress = async (req, res, next) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // grab address from express params
    const address_id = req.params.address_id;

    // await response
    const response = await putAddress({
      ...req.body,
      address_id: address_id,
      user_id: user_id,
    });

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteAddress = async (req, res, next) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // grab address from express params
    const address_id = req.params.address_id;

    // await response
    const response = await deleteAddress({ address_id, user_id });

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
