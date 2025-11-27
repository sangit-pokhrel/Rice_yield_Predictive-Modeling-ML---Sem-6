// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// CRUD API
router.post("/", contactController.createInquiry);
router.get("/", contactController.getInquiries);
router.get("/:id", contactController.getInquiry);
router.put("/:id", contactController.updateInquiry);
router.delete("/:id", contactController.deleteInquiry);

module.exports = router;
