const Reclamation = require("../Models/ReclamationModel");

// Créer une réclamation (Enseignant)
exports.createReclamation = async (req, res) => {
  try {
    const { teacherId, userId, subject, description } = req.body;
    
    // Supporte 'teacherId' ou 'userId' (venant du front)
    const finalTeacherId = teacherId || userId;

    if (!finalTeacherId) {
      return res.status(400).json({ message: "L'ID de l'enseignant (teacherId ou userId) est requis." });
    }

    const reclamation = new Reclamation({
      teacherId: finalTeacherId,
      subject,
      description
    });
    
    await reclamation.save();
    res.status(201).json(reclamation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// Obtenir les réclamations d'un enseignant spécifique
exports.getTeacherReclamations = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const reclamations = await Reclamation.find({ teacherId }).sort({ createdAt: -1 });
    res.json(reclamations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir toutes les réclamations (Admin)
exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find()
      .populate("teacherId", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.json(reclamations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le statut d'une réclamation (Admin)
exports.updateReclamationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;
    
    const reclamation = await Reclamation.findByIdAndUpdate(
      id,
      { status, adminComment },
      { new: true }
    ).populate("teacherId", "firstName lastName email");

    if (!reclamation) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }

    res.json(reclamation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une réclamation
exports.deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Reclamation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Réclamation non trouvée" });
    }
    res.json({ message: "Réclamation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
