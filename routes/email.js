var express = require("express");
var router = express.Router();

var MailConfig = require("../config/email");
var gmailTransport = MailConfig.GmailTransport;

router.get("/send", (req, res, next) => {
  const { email, message } = req.body;
  let HelperOptions = {
    from: `"Pol Casabayo" ${process.env.GMAIL_USER_NAME}`,
    to: email,
    subject: "Hellow world!",
    text: message,
  };
  gmailTransport.sendMail(HelperOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.json(error);
    }
    console.log("email is send");
    console.log(info);
    res.json(info);
  });
});

module.exports = router;
