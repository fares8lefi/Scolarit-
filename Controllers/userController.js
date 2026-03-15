const userModel = require("../Models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendInvitationEmail } = require("../services/invitationEmail");
const { validateInvite, validateAcceptInvitation, validateLogin } = require("../validations/userValidation");

module.exports.inviteUser = async (req, res) => {
  try {
    // ... (logic remains same)
    // validation de l'invitation
    const { error } = validateInvite(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { firstName, lastName, email, role, phone } = req.body;
    
    let code;
    let isUnique = false;

    // verification de l'existence du code
    while (!isUnique) {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      const checkCode = await userModel.findOne({ invitationCode: code });
      if (!checkCode) isUnique = true;
    }
    // Expiration dans 24h
    const invitationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      role,
      phone,
      invitationCode: code,
      invitationExpires
    });

    await sendInvitationEmail(user, code);
    
    res.status(201).json({ message: "Utilisateur invité avec succès", code }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.singup = async (req, res) => {
  try {
    const { error } = validateAcceptInvitation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, invitationCode, password, phone } = req.body;

    const user = await userModel.findOne({ email, invitationCode });

    if (!user) {
      return res.status(404).json({ message: "Invitation invalide ou utilisateur introuvable" });
    }

    if (user.invitationExpires < Date.now()) {
      return res.status(400).json({ message: "Le code d'invitation a expiré" });
    }

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.status = "ACTIVE";
    user.invitationCode = null;
    user.invitationExpires = null;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({ message: "Compte activé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login

module.exports.login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier si le compte est actif
    if (user.status !== "ACTIVE") {
      return res.status(403).json({ message: "Compte non activé. Veuillez accepter votre invitation." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Logout (côté client — invalider le token)

module.exports.logout = async (req, res) => {
  // Le logout JWT est géré côté client (supprimer le token du stockage)
  // On retourne simplement un succès
  res.status(200).json({ message: "Déconnexion réussie" });
};

