var Promise = require("bluebird");
const jwt = Promise.promisifyAll(require("jsonwebtoken"));
const moment = require("moment");
const config = require("../config/config");
const { User } = require("../models");
const CryptoJS = require("crypto-js");
var bcrypt = require('bcrypt');
// var randomstring = require('randomstring');
const { CRYPTO_SECRET_KEY, CRYPTO_SECRET_IV } = require("../config/config");

const key = CryptoJS.enc.Hex.parse(String(CRYPTO_SECRET_KEY));
const iv = CryptoJS.enc.Hex.parse(String(CRYPTO_SECRET_IV));
var JWT_SECRET_KEY = "login_secret_key_to_save_data";

const encryptUserID = async (userId) => {
  const value = CryptoJS.AES.encrypt(String(userId), key, {
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString();
  return value;
};

const decryptUserID = async (value) => {
  const userId = CryptoJS.AES.decrypt(value, key, {
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString(CryptoJS.enc.Utf8);
  return userId;
};

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = async (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    // sub: await encryptUserID(userId),
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires) => {
  // remove old token
  Token.remove({ user: userId });

  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token) => {
  const payload = await jwt.verify(token, config.jwt.secret);

  // const userId = await decryptUserID(payload.sub);
  const tokenDoc = await User.findOne({ '_id': payload.sub });
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (userId) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = await generateToken(userId, accessTokenExpires);
  return {
    token: accessToken,
    expires: accessTokenExpires.toDate(),
  };
};

/**for generate reset password Token */
var genResetPasswordAdminToken = async (user) => {
  var options = { expiresIn: '24hr' };
  return jwt.signAsync(user, process.env.adminSecret, options)
    .then((jwtToken) => {
      return jwtToken;
    }).catch(function (err) {
      return err;
    });
};

function generateSaltAndHashForPassword(password) {
  return bcrypt.hash(password, 10);
}

var genUsrToken = function (user) {
  var options = {};
  return jwt.signAsync(user, JWT_SECRET_KEY, options)
    .then(function (jwtToken) {
      return jwtToken;
    })
    .catch(function (err) {
      // throw new exceptions.tokenGenException();
      return err;
    });
};

/**for generate random string
* 
*/
function getRandomString(codeLength = 4) {
  return Math.random().toString(36).substring(codeLength);
}

function generateResetPassordToken() {
  return randomstring.generate();
}

function verifyPassword(password, user) {
  console.log("password, user.password", password, user.password)
  return bcrypt.compare(password, user.password);
}

module.exports = {
  genUsrToken,
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  genResetPasswordAdminToken,
  generateSaltAndHashForPassword,
  getRandomString,
  verifyPassword,
  generateResetPassordToken
};
