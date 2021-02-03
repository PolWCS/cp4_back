const express = require("express");
const router = express.Router();

const user = require("./user");
const email = require("./email");
const history = require("./history");
const motivationMail = require("./motivationMail");
const curriculumVitae = require("./curriculumVitae");
const contactBook = require("./contactBook");

router.use("/users", user);
router.use("/email", email);
router.use("/history", history);
router.use("/motivation_mails", motivationMail);
router.use("/curriculum_vitae", curriculumVitae);
router.use("/contact_book", contactBook);

module.exports = router;
