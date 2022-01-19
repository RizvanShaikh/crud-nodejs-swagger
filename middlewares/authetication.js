const httpStatus = require("http-status");
const { verifyToken } = require("../services/token.service");
const MESSAGE = require("../config/message");
const { User } = require("../models");
/**
 * Check User without raising an error
 **/
const checkUser = () => {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization || req.query.authorization;
      if (token) {
        token = token.split(" ");
        if (!["Bearer", "Token"].includes(token[0])) {
          return res
            .status(httpStatus.UNAUTHORIZED)
            .send({ message: MESSAGE["invalidToken"] });
        }
        user_obj = await verifyToken(token[1]);
        req.user = user_obj ? user_obj : null;
      }
      next();
    } catch (err) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Error name: " + err.name + "Error message: " + err.message,
      });
    }
  };
};

/**
 * Check Authentication from Headers
 **/

const isAuthenticated = () => {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization || req.query.authorization;
      if (!token) {
        return res.json({
          code: 403,
          status: false,
          message: MESSAGE["unauthorized"],
          data: {}
        });
      }
      token = token.split(" ");
      if (!["Bearer", "Token"].includes(token[0])) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: MESSAGE["invalidToken"] });
      }
      user_obj = await verifyToken(token[1]);

      if (!user_obj) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: MESSAGE["tokenExpired"] });
      }
      req.user = user_obj;
      next();
    } catch (err) {

      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Error name: " + err.name + "Error message: " + err.message,
      });
    }
  };
};

const validResetPasswordToken = () => {
  return async (req, res, next) => {
    try {
      await User.findOne({ resetPasswordToken: req.params.token }).then((result) => {
        if (!result) {
          return res
            .status(httpStatus.UNAUTHORIZED)
            .send({ message: MESSAGE["invalidToken"] });
        }
        req.user = result;
        next();
      })
    } catch (err) {
      return res.json({
        code: 404,
        status: false,
        message: error.message,
        data: {}
      })
    }
  };
}

const isAdmin = () => {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization || req.query.authorization;

      if (!token) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: MESSAGE["unauthorized"] });
      }
      token = token.split(" ");
      if (!["Bearer", "Token"].includes(token[0])) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: MESSAGE["invalidToken"] });
      }
      await User.findOne({ userJwt: token[1] }).then((result) => {
        if (!result) {
          return res
            .status(httpStatus.UNAUTHORIZED)
            .send({ message: MESSAGE["unauthorized"] });
        }
        if (result.roleType != 1 || result.roleType != "1") {
          return res
            .status(httpStatus.FORBIDDEN)
            .send({ message: MESSAGE["permissionDenied"] });
        }
        req.user = result;
        next();
      }).catch((error) => {
        return res.json({
          code: 404,
          status: false,
          message: error.message,
          data: {}
        })
      })

    } catch (err) {
      return res.status(400).json({
        message: "Error name: " + err.name + "Error message: " + err.message,
      });
    }
  };
};

const getLanguage = () => {
  return async (req, res, next) => {
    console.log(req.headers);
    req.lng = req.headers.lng || "en";
    next();
  };
};

module.exports = {
  checkUser,
  isAuthenticated,
  isAdmin,
  getLanguage,
  validResetPasswordToken
};
