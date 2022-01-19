//========================== Load Modules Start ====================================
const { User } = require("../../models");
const httpStatus = require("http-status");
const {
  generateAuthTokens,
  genUsrToken,
  verifyPassword
} = require("../../services/token.service");
const { uploadFileToS3 } = require("../../services/file-upload.service");
const MESSAGE = require("../../config/message");
const { v4: uuidv4 } = require("uuid");
const {
  generateOTP
} = require("../../config/utils");

const AWS = require("aws-sdk");
const CONFIG = require("../../config/config");
//========================== Load Modules End ==============================================

const signup = async (req, res) => {
  const data = req.body;
  data.email = data.email.toLowerCase();
  if (await User.isEmailExists(data.email)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: MESSAGE.emailExists });
  }
  if (data.phoneNumber && await User.isPhoneNumberExists(data.phoneNumber)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: MESSAGE.phoneExists });
  }

  if (!data.image) {
    if (data.gender === "male") {
      data.image = "https://wallet-system.s3.us-east-2.amazonaws.com/male.jpg"
    } else {
      data.image = "https://wallet-system.s3.us-east-2.amazonaws.com/female.jpg"
    }
  }
  /* to get DOB in MM-DD-YY formate */
  if (data.dob && await isValidDate(data.dob) != true) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: MESSAGE.errorDateNotValid });
  }
  /* to upload images to S3 Bucket  with base 64 image*/
  if (req.body.image && !req.files) {
    if (req.body.image && !req.body.image.startsWith("https://")) {
      req.body.image = await uploadFileToS3(req.body.image, req.body.altText);
    }
  }

  await User.create(data).then(async (result) => {
    // Accessing the file by the <input> File name="image"
    /* using formdata content-type: multipart/form-data */
    if (req.files) {
      var targetFile = req.files.image;
      // console.log("targetFiles =>", targetFile)
      /* to upload images to S3 Bucket */
      const S3 = new AWS.S3({
        accessKeyId: CONFIG.AWS.ACCESS_KEY,
        secretAccessKey: CONFIG.AWS.SECRET_KEY,
      })

      let myFile = req.files.image.name.split('.')
      const fileType = myFile[myFile.length - 1]

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${uuidv4()}.${fileType}`,
        Body: targetFile.data,
      }
      /* using formdata content-type: multipart/form-data */
      let imageLinkS3 = await S3.upload(params).promise();
      console.log('imageLinkS3', imageLinkS3);
      result.image = imageLinkS3.Location;
    }
    /**/
    /* to generate token while registaration */
    let token = await generateUserToken(req, result);

    result.name = result.firstName;
    result.password = result.lastName;
    result.userJwt = token;

    // to convert Timestamp date to Human readable formate
    var timestamp = result.userCreatedDate
    var date = new Date(timestamp);

    var datFormate = date.getDate() +
      "/" + (date.getMonth() + 1) +
      "/" + date.getFullYear()
    result.userSignUpDate = datFormate;
    result.save().then(async (userDataWithToken) => {
      return res.json({ code: 200, status: true, message: MESSAGE.signupSuccess, data: userDataWithToken })
    })
  }).catch((error) => {
    return res.json({ code: 404, status: false, message: error.message, data: {} })
  });
};
/* */

function isValidDate(date) {
  var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
  if (matches == null) return false;
  var d = matches[2];
  var m = matches[1] - 1;
  var y = matches[3];
  var composedDate = new Date(y, m, d);
  return composedDate.getDate() == d &&
    composedDate.getMonth() == m &&
    composedDate.getFullYear() == y;
}

/**for generate user token
 *
 * @param {object} isExist userDetails
 */

function generateUserToken(req, isExist) {
  return genUsrToken({
    userId: isExist._id,
    phoneNumber: isExist.phoneNumber,
    email: isExist.email,
  })
    .then(async (jwt) => {
      let query = {
        _id: isExist._id,
      };
      let updateDetails = {
        userJwt: jwt,
        isOnline: 1
      };
      return User
        .findOneAndUpdate(query, { $set: updateDetails })
        .then((result) => {
          return jwt;
        })
        .catch((err) => {
          return json({
            code: 404,
            status: false,
            message: error.message,
            data: {}
          })
        });
    });
}

const login = async (req, res) => {
  const { email, password } = req.body;

  await User.findOne({ email: { $regex: new RegExp("^" + req.body.email.toLowerCase(), "i") } }).then(async (user) => {
    console.log('verifyPassword', await user.checkPassword(password));
    // console.log("user", user)
    if (!user || !(await user.checkPassword(password))) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: MESSAGE.invalidCredentials });
    }
    if (!user.isActive) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: MESSAGE.inactiveAccount });
    }
    const token = await generateAuthTokens(user.id);
    // console.log("token =>", token);
    /* to save user token */
    user.userJwt = token.token;

    await user.save().then((result) => {
      return res.json({
        code: 200,
        status: true,
        message: MESSAGE.loginSuccessfull,
        data: result
      })
    }).catch((error) => {
      return error;
    });
  }).catch((error) => {
    return res.json(
      {
        httpCode: 404,
        status: false,
        message: error.message,
        data: {}
      })
  })
};

const logout = async (req, res) => {
  let user = req.user;
  user.userJwt = "";
  user.isOnline = 0;
  user.save().then(async (user) => {
    return res.json({
      httpCode: 200,
      statusFalse: true,
      message: MESSAGE.logoutSuccess,
      data: {}
    });
  }).catch((error) => {
    return res.json({
      httpCode: 400,
      statusFalse: false,
      message: error.message,
      data: {}
    });
  })
};
module.exports = {
  signup,
  login,
  logout
};
