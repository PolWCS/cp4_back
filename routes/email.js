var express = require("express");
var router = express.Router();

var MailConfig = require("../config/email");
var gmailTransport = MailConfig.GmailTransport;

router.post("/send", (req, res, next) => {
  const { to, message, subject, attachments, html } = req.body;
  console.log(req.body);
  let HelperOptions = {
    from: `"Pol Casabayo" ${process.env.GMAIL_USER_NAME}`,
    to: to,
    subject: subject,
    text: message,
    html: html,
    attachments: attachments,
  };
  gmailTransport.sendMail(HelperOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.json(error);
    } else {
      console.log("email has been sent");
      console.log(info);
      res.json(info);
    }
  });
});

module.exports = router;
