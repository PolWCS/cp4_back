const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
const dotenv = require("dotenv");

dotenv.config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Connexion utilisateur
router.post("/signin", (req, res) => {
  connection.query(
    "SELECT *  FROM user WHERE email = ?",
    [req.body.email],
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        if (results.length > 0) {
          const goodPassword = bcrypt.compareSync(
            req.body.password,
            results[0].password
          );
          if (goodPassword) {
            jwt.sign({ results }, process.env.SECRET_KEY_JWT, (err, token) => {
              res.status(200).json({
                id: results[0].id,
                name: results[0].last_name,
                token,
              });
            });
          } else res.sendStatus(500);
        } else res.status(404).send("Error: Email incorrect");
      }
    }
  );
});

// Récupération d'une liste d'utilisateurs
router.get("/", (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.json(results);
    }
  });
});

// Récupération d'un utilisateur
router.get("/:id", (req, res) => {
  const idParams = req.params.id;
  connection.query(
    "SELECT * FROM user WHERE id = ?",
    idParams,
    (err, results) => {
      if (err) {
        res.sendStatus(err);
      } else {
        res.json(results[0]);
      }
    }
  );
});

// Création compte utilisateur
router.post("/", (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  const dataUser = {
    email: req.body.email,
    password: hash,
    last_name: req.body.lastname,
    first_name: req.body.firstname,
  };

  connection.query("INSERT INTO user SET ?", [dataUser], (err, results) => {
    if (err) {
      res.sendStatus(err);
    } else {
      connection.query(
        "SELECT * FROM user WHERE id = ?",
        results.insertId,
        (err2, records) => {
          if (err2) {
            return res.sendStatus(500);
          }
          const insertedUser = records[0];
          const { password, ...user } = insertedUser;
          const host = req.get("localhost");
          const location = `https://${host}${req.url}/${user.id}`;
          res.status(201).set("Location", location).json(user);
        }
      );
    }
  });
});

// Modification d'un utilisateur
router.put("/:id", (req, res) => {
  const idParams = req.params.id;
  const data = req.body;

  connection.query(
    "UPDATE user SET ? WHERE id = ?",
    [data, idParams],
    (err) => {
      if (err) {
        res.sendStatus(err);
      } else {
        connection.query(
          "SELECT * FROM user WHERE id = ?",
          idParams,
          (err2, records) => {
            if (err2) {
              return res.sendStatus(500);
            }
            const insertedUser = records[0];
            const { password, ...user } = insertedUser;
            const host = req.get("localhost");
            const location = `https://${host}${req.url}/${user.id}`;
            res.status(201).set("Location", location).json(user);
          }
        );
      }
    }
  );
});

// suppression d'un utilisateur
router.delete("/:id", (req, res) => {
  const idParams = req.params.id;

  connection.query(
    "DELETE FROM user WHERE id = ?",
    idParams,
    (err, results) => {
      if (err) {
        res.sendStatus(err);
      } else {
        res.status(200).send("Element deleted");
      }
    }
  );
});

module.exports = router;
