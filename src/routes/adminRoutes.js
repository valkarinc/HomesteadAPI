const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

router.get("/test", adminAuth, (req, res) => {
  res.json({
    success: true,
    message: "Admin route working"
  });
});

module.exports = router;