const jwt = require("jsonwebtoken");
require("dotenv").config();

// define JWT to expire after one day
const expiresIn = 60 * 60 * 24;

// Generate an access token and a refresh token for this database user
function jwtTokens(user) {
  // check for valid inputs
  const { id } = user;
  console.log(id);
  if (!id) {
    return null;
  }

  // define JWT payload
  const payload = {
    sub: id,
    iat: Date.now(),
  };
  // const user = { id, first_name, last_name, email };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: expiresIn,
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
  return { user, accessToken, refreshToken, expiresIn };
}

module.exports = {
  jwtTokens,
};

module.exports.JWTcookieOptions = {
  httpOnly: true,
  maxAge: expiresIn * 1000, // x1000 since cookie is in milliseconds
  secure: process.env.NODE_ENV === "development",
};
