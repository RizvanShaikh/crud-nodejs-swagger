const nodemailer = require("nodemailer");
const CONFIG = require("./config");
const adminEmailId = process.env.gmailMail
// function sendEmail(to, subject, message, attachments = []) {
// for SMTP node mail error
// https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4OM6UVv_ceFXlrfAR71e-1oA9esiemJgt7hRmVu866pYAWqgP58OPqTL3zlwgg-JtVBTv5mVlSlAXcqi5R-kUMfDI60OQ
//   // console.log(CONFIG.EMAIL);
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // use SSL
//     auth: {
//       user: CONFIG.EMAIL.email,
//       pass: CONFIG.EMAIL.password,
//     },
//   });

//   const mailOptions = {
//     from: CONFIG.EMAIL.fromEmail,
//     bcc: CONFIG.EMAIL.bcc,
//     to: to,
//     subject: subject,
//     html: message,
//     attachments: attachments,
//   };

//   try {
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log("sendMail error", error.message);
//       }
//       console.log("Email sent: " + JSON.stringify(info));
//     });
//   } catch (err) {
//     console.log(err);
//   } finally {
//     transporter.close();
//   }
// }

// common Mail code 
function sendEmail(user, condition, link) {

  // for random password sent to user
  if (condition == 1) {
    var userName = `<h4> Hi ${user.userDetail.firstName}</h4>`
    var templateContent = `<p> Please login with a following your credential </p>
    <h4>Email: ${user.userDetail.email} </h4>
    <h4>Password: ${user.randomPassword} </h4>`

    var subject = `Random Password Mail` // Subject line
  }
  // forgot password mail
  if (condition == 2) {
    var userName = `<h4> Hi ${user.userDetail.firstName}</h4>`
    // var templateContent = `<p> Please varify your email by clicking this link : <a> ${user.link} </a>`
    var templateContent =
      `<p> Click bilow button for reset your pasword </p>
    <a href="${user.link}" style="padding-bottom: 40px; padding-top: 20px; text-decoration: none;padding: 9px 20px;font-weight: 700;font-size: 11px;border-radius: 30px;background-color: #4daf4e;color: #ffffff !important;box-shadow: none !important;border: none !important;outline: none !important;text-transform: uppercase;">
        Set a new password
     </a>`;
    var subject = `Forgot Password Mail` // Subject line
  }
  // for mail
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "peerbyte@gmail.com", // generated ethereal user
      pass: "F@izan29018" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  })
  let mailOptions = {

    from: `${adminEmailId}`, // Admin Email Id 
    to: `${user.userDetail.email}`, // User Email Id 
    subject: `${process.env.appName}- ${subject}`, // Subject line
    html: `<!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>${process.env.appName}</title>
              <style>
                 body {margin: 0;}
      a {display: inline-block;}
      p {
        font-family: 'Arial', sans-serif;
        font-weight: 400;
        color: #757575;
        font-size: 14px;
        margin-bottom: 20px;
        line-height: 22px;
      }
      .st_btn {
        background-color: #4CAF50;
        font-family: 'Arial', sans-serif;
        font-weight: 700;
        color: #fff !important;
        font-size: 14px;
        text-transform: uppercase;
        text-decoration: none;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 15px;
        margin-top: 10px;
      }
      h4 {
        font-family: 'Arial', sans-serif;
        font-weight: 700;
        color: #212121;
        font-size: 18px;
        margin-top: 10px;
      }
      .carrots {
        height: auto;
        width: 180px;    
      }
              </style>
            </head>
            <body>
              <table align="center" cellpadding="0" cellspacing="0" border="0" width="800px" style="background: #0E112E url(images/bg_img.png) no-repeat 0 0;">
                <tbody>
                  <tr>
                    <td height="50"></td>
                  </tr>
                  <tr>
                    <td align="center"><a href="#"><img class="carrots" src="" alt=""></a></td>
                  </tr>
                  <tr>
                    <td height="30"></td>
                  </tr>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="30" border="0" width="525px" bgcolor="#fff">
                        <tbody>
                          <tr>
                            <td>
                              ${userName}
                              ${templateContent}
                              <p>Thank you.</p>
                              <p>${process.env.appName} Team.</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td height="30"></td>
                  </tr>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="0" border="0" width="525px">
                        <tbody>
                          <tr>
                            <td></td>
                            <td style="text-align:right; font-family: 'Arial', sans-serif; font-weight: 400; color: #fff;font-size: 14px;">
                              Download Now
                            </td>
                          </tr>
                          <tr>
                            <td height="10"></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>
                              <a href="#" style="margin-right: 5px;"><img src="images/fc_icon.png" alt=""></a>
                              <a href="#" style="margin-right: 5px;"><img src="images/tw_icon.png" alt=""></a>
                              <a href="#" style="margin-right: 5px;"><img src="images/inst_icon.png" alt=""></a>
                            </td>
                            <td style="text-align:right;">
                              <a href="#" style="margin-left: 5px;"><img src="images/apstore_ic.png" alt=""></a>
                              <a href="#"><img src="images/g_play_ic.png" alt=""></a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                
                  <tr>
                    <td height="30"></td>
                  </tr>
                  <tr>
                    <td style="font-family: 'Arial', sans-serif;background-color: #4CAF50;text-align: center;padding: 20px 0;color: #fff;">
                      Copy Rights ${new Date().getFullYear()} &nbsp; &nbsp;| &nbsp; &nbsp; <a href="#" style="color: #fff;text-decoration: none;">Privacy Policy</a> &nbsp; &nbsp;| &nbsp; &nbsp; <a href="#" style="color: #fff;text-decoration: none;">Terms and Conditions</a>
                    </td>
                  </tr>
          
                </tbody>
                
              </table>
            </body>
          </html>`
  }
  // console.log("mailOptions", mailOptions)
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error--in mail---", error)
      return error;
    } else {
      console.log("Send mail")
      return json({
        message: "Send mail"
      })
    }
  })
}

function generateOTP() {
  // Declare a string variable
  // which stores all string
  const string = "0123456789";
  let OTP = "";
  // Find the length of string
  const len = string.length;
  for (let i = 0; i < 6; i++) {
    OTP += string[Math.floor(Math.random() * len)];
  }
  return Number(OTP);
}

const mapResult = async (results) => {
  return results.map((element) => {
    element.id = element._id;
    // console.log("toJSON element.translation", element.translation);
    if (element.translation) {
      delete element.translation.language;
      delete element.translation._id;
      const translation = element.translation;
      delete element.translation;
      element = { ...element, ...translation };
    }
    delete element._id;
    delete element.__v;
    delete element.password;
    delete element.isDeleted;
    return { ...element };
  });
};

module.exports = {
  generateOTP,
  mapResult,
  sendEmail,
};
