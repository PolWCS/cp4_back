const express = require("express");
const router = express.Router();

const user = require("./user");
const email = require("./email");

router.use("/users", user);
router.use("/email", email);

module.exports = router;
