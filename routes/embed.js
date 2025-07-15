const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/embed.js", (req, res) => {
  res.sendFile(path.join(__dirname, "TourScript", "tourScript.js"));
});

module.exports = router;
