const express = require("express");
const app = express();
const path = require("path");

const port = process.env.PORT || 3000;
const cors = require("cors");
const routes = require("./routes");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", routes);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`GG :D Server is running on ${port}`);
});
