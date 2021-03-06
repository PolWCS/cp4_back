const express = require("express");
const router = express.Router();
const connection = require("../config/connection");
// const dotenv = require("dotenv");

// dotenv.config();

// Récupération d'une liste
router.get("/", (req, res) => {
  connection.query("SELECT * FROM history", (err, results) => {
    if (err) {
      res.sendStatus(err);
    } else {
      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", results.length);
      res.json(results);
    }
  });
});

router.get("/replies", (req, res) => {
  connection.query(
    "SELECT h.id, h.date, h.reply, h.user_id, h.contact_book_id, h.cv_id, h.mm_id, h.message, h.subject, cb.email AS contact_book_email, cb.firm AS contact_book_firm , cv.url AS cv_url, mm.url AS mm_url FROM history AS h JOIN contact_book AS cb ON h.contact_book_id=cb.id JOIN curriculum_vitae AS cv ON cv.id=h.cv_id JOIN motivation_mail AS mm ON mm.id=h.mm_id WHERE DATEDIFF(NOW(), date) > 7 AND reply < 1",
    (err, results) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// Récupération d'une donnée
router.get("/:id", (req, res) => {
  const idParams = req.params.id;
  connection.query(
    "SELECT * FROM history WHERE id = ?",
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

  connection.query("INSERT INTO history SET ?", data, (err, results) => {
    if (err) {
      res.sendStatus(err);
    } else {
      connection.query(
        "SELECT * FROM history WHERE id = ?",
        results.insertId,
        (err2, records) => {
          if (err2) {
            return res.sendStatus(500);
          }
          res.status(201).json(records[0]);
        }
      );
    }
  });
});

// Modification d'une donnée
router.put("/:id", (req, res) => {
  const idParams = req.params.id;
  const data = req.body;

  connection.query(
    "UPDATE history SET ? WHERE id = ?",
    [data, idParams],
    (err) => {
      if (err) {
        res.sendStatus(err);
      } else {
        connection.query(
          "SELECT * FROM history WHERE id = ?",
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
    "DELETE FROM history WHERE id = ?",
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
