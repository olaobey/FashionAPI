const { getAccount, putAccount } = require("../../services/accountService");

module.exports.getAccount = async (req, res, next) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // await response
    const response = await getAccount(user_id);

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next();
  }
};

module.exports.putAccount = async (req, res, next) => {
  try {
    // grab user_id from jwt
    const user_id = req.jwt.sub;

    // await response
    const response = await putAccount({ ...req.body, user_id: user_id });

    // send response to client
    res.status(200).json(response);
  } catch (err) {
    next();
  }
};
