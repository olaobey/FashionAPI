const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Hash Password Method
// @param {string} password
// @returns {string} returns hashed password

function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

//  comparePassword
//  @param {string} hashPassword
//  @param {string} password
//  @returns {Boolean} return True or False

function comparePassword(hashPassword, password) {
  const comparePassword =
    typeof password == "string" &&
    password.trim() != "" &&
    password.trim().length >= 6;
  return comparePassword && bcrypt.compareSync(password, hashPassword);
}

// isValidEmail helper method
// @param {string} email
// @returns {Boolean} True or False

function isValidEmail(email) {
  const isValidEmail = typeof email == "string" && email.trim() != "";
  return isValidEmail && /\S+@\S+\.\S+/.test(email);
}

module.exports = {
  hashPassword,
  comparePassword,
  isValidEmail,
};
