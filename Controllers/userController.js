const userModel = require("../Models/userModel");
const { sendInvitationEmail } = require("../services/invitationEmail");
const { validateInvite } = require("../validations/userValidation");

module.exports.inviteUser = async (req, res) => {
  try {
    //validation de l'invitation
    const { error } = validateInvite(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { firstName, lastName, email, role, phone } = req.body;
    
    let code;
    let isUnique = false;

    //verification de l'exixtence du code
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



