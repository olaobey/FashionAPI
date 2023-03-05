const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verify Token
// @param {object} req
// @param {object} res
// @param {object} next
// @returns {object|void} response object

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"]; //Bearer TOKEN
//   const token = authHeader && authHeader.split(" ")[1];
//   if (token == null) return res.status(401).json({ error: "Null token" });
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
//     if (error) return res.status(403).json({ error: error.message });
//     req.user = user;
//     next();
//   });
// }

/**
 * Helper function to verify JWT based on encryption from ./attachJWT
 *
 */

const verify = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const jwtAuth = async (req, res, next, callback) => {
  // split header which comes in format "Bearer eyJhbGciOiJ...."
  const headerParts = req.headers.authorization
    ? req.headers.authorization.split(" ")
    : [null];

  // grab token from cookie, if it exists
  const tokenInCookie = req.cookies.access_token || null;

  try {
    // check token in cookie
    if (tokenInCookie) {
      // verify JWT and attach to req
      req.jwt = verify(tokenInCookie);
      next();

      // check if header is in correct format
    } else if (
      headerParts[0] === "Bearer" &&
      headerParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      // verify JWT and attach to req
      req.jwt = verify(headerParts[1]);
      next();
    } else {
      // call callback
      callback();
    }
  } catch (e) {
    next(e);
  }
};

/**
 * Custom JWT authentication middleware, to replace passport altogether
 *
 * checks if user is authenticated, otherwise returns a 401 error
 * */
module.exports.isAuth = async (req, res, next) => {
  // callback is to throw a 401 error, not authorized
  const callback = () => {
    res.status(401).json({ success: false, msg: "Not authorized." });
  };

  // call Auth helper middleware
  jwtAuth(req, res, next, callback);
};

/**
 * Custom JWT authentication middleware, to replace passport altogether
 *
 * checks if user is authenticated and attaches user to request object
 * otherwise, still allows access, just user not identified
 * */
module.exports.demiAuth = async (req, res, next) => {
  // by default, user not identified, but still allowed access.
  const callback = () => {
    req.jwt = null;
    next();
  };

  // call Auth helper middleware
  jwtAuth(req, res, next, callback);
};

/**
 * Custom JWT authentication middleware for checkout routes
 *
 * checks if user is authenticated and attaches user to request object
 * otherwise, returns user to beginning of checkout route, which will lead to login/register route
 * */
module.exports.checkoutAuth = async (req, res, next) => {
  // by default, redirect to cart
  const callback = () => {
    res.redirect("/cart");
  };

  // call Auth helper middleware
  jwtAuth(req, res, next, callback);
};

// const authenticateToken = async (req, res, next) => {
// const authHeader = req.headers["authorization"]; //Bearer TOKEN
// const token = authHeader && authHeader.split(" ")[1];
// if (token == null) return res.status(401).json({ error: "Null token" });
// jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
//   if (error) return res.status(403).json({ error: error.message });
//   req.user = user;
//   next();
// });
// };
//   try {
//     const decoded = jwt.verify(token, process.env.SECRET);
//     const text = "SELECT * FROM users WHERE id = $1";
//     const { rows } = await pool.query(text, [decoded.userId]);
//     if (!rows[0]) {
//       return res
//         .status(400)
//         .send({ message: "The token you provided is invalid" });
//     }
//     req.user = { id: decoded.userId };
//     next();
//   } catch (error) {
//     return res.status(400).send(error);
//   }

// module.exports = { authenticateToken };
