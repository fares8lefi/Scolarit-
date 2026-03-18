const express = require("express");
const router = express.Router();
const reclamationController = require("../Controllers/reclamationController");

// Routes pour les enseignants
router.post("/create", reclamationController.createReclamation);
router.get("/teacher/:teacherId", reclamationController.getTeacherReclamations);

// Routes pour l'admin
router.get("/all", reclamationController.getAllReclamations);
router.put("/update/:id", reclamationController.updateReclamationStatus);

// Route commune
router.delete("/delete/:id", reclamationController.deleteReclamation);

module.exports = router;

