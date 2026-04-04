const userModel = require("../Models/UserModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendInvitationEmail } = require("../services/invitationEmail");
const { validateInvite, validateAcceptInvitation, validateLogin, validateAddChild, validateUpdateChild } = require("../validations/userValidation");

module.exports.inviteUser = async (req, res) => {
  try {
    // validation de l'invitation
    const { error } = validateInvite(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const normalizedEmail = req.body.email.toLowerCase().trim();
    console.log(`[DEBUG] Attempting cleanup for: ${normalizedEmail}`);
    const { firstName, lastName, role, phone, classId, children } = req.body;
    
    // On nettoie TOUJOURS avant de commencer quoi que ce soit si un utilisateur existe avec cet email
    // et s'il est actif, on bloque.
    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.status === "ACTIVE") {
      return res.status(400).json({ message: "Cet utilisateur possède déjà un compte actif." });
    }

    // On supprime de manière inconditionnelle avant de recréer (sauf si actif au-dessus)
    const del = await userModel.deleteMany({ email: normalizedEmail });
    if (del.deletedCount > 0) {
      console.log(`[DEBUG] Force deleted ${del.deletedCount} records for ${normalizedEmail}`);
    }

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
      email: normalizedEmail,
      role,
      phone,
      classId,
      children,
      invitationCode: code,
      invitationExpires
    });

    await sendInvitationEmail(user, code);
    
    res.status(201).json({ message: "Utilisateur invité avec succès", code }); 
  } catch (error) {
    console.error("Error in inviteUser:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const { error } = validateAcceptInvitation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, invitationCode, password, phone } = req.body;
    console.log("email", email);
    console.log("invitationCode", invitationCode);
    console.log("password", password);
    console.log("phone", phone);
    
    const normalizedEmail = email ? email.toLowerCase().trim() : email;

    const user = await userModel.findOne({ email: normalizedEmail, invitationCode });

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
    
    const normalizedEmail = email ? email.toLowerCase().trim() : email;

    // Vérifier si l'utilisateur existe
    const user = await userModel.findOne({ email: normalizedEmail })
      .populate('classId')
      .populate('children.classId');
      
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
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        classId: user.classId,
        children: user.children
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
module.exports.logout = async (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie" });
};

// Obtenir tous les utilisateurs (filtrable par rôle)
module.exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await userModel.find(query)
      .select("-password -invitationCode")
      .populate('classId')
      .populate('children.classId');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un utilisateur par ID
module.exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id)
      .select("-password -invitationCode")
      .populate('classId')
      .populate('children.classId');
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un utilisateur
module.exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .select("-password -invitationCode")
      .populate('classId')
      .populate('children.classId');
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les parents avec leurs enfants et classes associées
module.exports.getParentsWithChildren = async (req, res) => {
  try {
    const parents = await userModel.find({ role: "PARENT" })
      .select("firstName lastName email phone children")
      .populate({
        path: 'children.classId',
        select: 'name level'
      });

    const result = parents.map(parent => ({
      parentId: parent._id,
      parentName: `${parent.firstName} ${parent.lastName}`,
      email: parent.email,
      phone: parent.phone,
      children: parent.children.map(child => ({
        name: child.name,
        class: child.classId ? child.classId.name : "N/A",
        level: child.classId ? child.classId.level : "N/A"
      }))
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Obtenir tous les élèves de l'école avec recherche et filtres pour l'admin
module.exports.getAllStudents = async (req, res) => {
  try {
    const { search, classId } = req.query;
    const mongoose = require("mongoose");
    
    let pipeline = [
      { $match: { role: "PARENT" } },
      { $unwind: "$children" },
      {
        $lookup: {
          from: "classes", 
          localField: "children.classId",
          foreignField: "_id",
          as: "classInfo"
        }
      },
      { $unwind: { path: "$classInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          studentId: "$children._id",
          name: "$children.name",
          parentName: { $concat: ["$firstName", " ", "$lastName"] },
          parentId: "$_id",
          className: { $ifNull: ["$classInfo.name", "N/A"] },
          classLevel: { $ifNull: ["$classInfo.level", "N/A"] },
          classId: "$children.classId"
        }
      }
    ];

    // Filtre par nom d'élève ou nom de parent
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { parentName: { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    // Filtre par classe
    if (classId && classId !== "") {
      pipeline.push({
        $match: { classId: new mongoose.Types.ObjectId(classId) }
      });
    }

    const students = await userModel.aggregate(pipeline);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    res.status(500).json({ message: error.message });
  }
};

// Ajouter un enfant à un parent existant
module.exports.addChild = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { error } = validateAddChild(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, classId } = req.body;

    const parent = await userModel.findById(parentId);
    if (!parent || parent.role !== "PARENT") {
      return res.status(404).json({ message: "Parent non trouvé ou rôle incorrect" });
    }

    // On pourrait aussi vérifier si la classe existe ici, mais on fait confiance à l'admin pour l'instant
    // ou on ajoute une vérification simple :
    // const classExists = await classModel.findById(classId);
    // if (!classExists) return res.status(404).json({ message: "Classe non trouvée" });

    parent.children.push({ name, classId });
    await parent.save();

    const updatedParent = await userModel.findById(parentId)
      .select("-password -invitationCode")
      .populate('children.classId');

    res.status(200).json({ 
      message: "Enfant ajouté avec succès", 
      parent: updatedParent 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un enfant spécifique
module.exports.updateChild = async (req, res) => {
  try {
    const { parentId, childId } = req.params;
    const { error } = validateUpdateChild(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, classId } = req.body;

    const parent = await userModel.findById(parentId);
    if (!parent || parent.role !== "PARENT") {
      return res.status(404).json({ message: "Parent non trouvé ou rôle incorrect" });
    }

    const child = parent.children.id(childId);
    if (!child) return res.status(404).json({ message: "Enfant non trouvé" });

    if (name) child.name = name;
    if (classId) child.classId = classId;

    await parent.save();

    const updatedParent = await userModel.findById(parentId)
      .select("-password -invitationCode")
      .populate('children.classId');

    res.status(200).json({ 
      message: "Enfant mis à jour avec succès", 
      parent: updatedParent 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un enfant spécifique
module.exports.deleteChild = async (req, res) => {
  try {
    const { parentId, childId } = req.params;

    const parent = await userModel.findById(parentId);
    if (!parent || parent.role !== "PARENT") {
      return res.status(404).json({ message: "Parent non trouvé ou rôle incorrect" });
    }

    parent.children.pull(childId);
    await parent.save();

    const updatedParent = await userModel.findById(parentId)
      .select("-password -invitationCode")
      .populate('children.classId');

    res.status(200).json({ 
      message: "Enfant supprimé avec succès", 
      parent: updatedParent 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
