const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
// const dotenv = require("dotenv");

// dotenv.config();

// Récupération d'une liste
router.get("/", (req, res) => {
  connection.query("SELECT * FROM curriculum_vitae", (err, results) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", results.length);
      res.json(results);
    }
  });
});

// Récupération d'une donnée
router.get("/:id", (req, res) => {
  const idParams = req.params.id;
  connection.query(
    "SELECT * FROM curriculum_vitae WHERE id = ?",
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

// Ajout d'une donnée
router.post("/", (req, res) => {
  const data = req.body;

  connection.query(
    "INSERT INTO curriculum_vitae SET ?",
    data,
    (err, results) => {
      if (err) {
        res.sendStatus(err);
      } else {
        connection.query(
          "SELECT * FROM curriculum_vitae WHERE id = ?",
          results.insertId,
          (err2, records) => {
            if (err2) {
              return res.sendStatus(500);
            }
            res.status(201).json(records[0]);
          }
        );
      }
    }
  );
});

// Modification d'une donnée
router.put("/:id", (req, res) => {
  const idParams = req.params.id;
  const data = req.body;

  connection.query(
    "UPDATE curriculum_vitae SET ? WHERE id = ?",
    [data, idParams],
    (err) => {
      if (err) {
        res.sendStatus(err);
      } else {
        connection.query(
          "SELECT * FROM curriculum_vitae WHERE id = ?",
          idParams,
          (err2, records) => {
            if (err2) {
              return res.sendStatus(500);
            }
            res.status(201).json(records[0]);
          }
        );
      }
    }
  );
});

// suppression d"une donnée
router.delete("/:id", (req, res) => {
  const idParams = req.params.id;

  connection.query(
    "DELETE FROM curriculum_vitae WHERE id = ?",
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

router.post("/urlSearch", (req, res) => {
  const { url } = req.body;
  connection.query(
    "SELECT * FROM curriculum_vitae WHERE url = ?",
    url,
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
});

module.exports = router;
