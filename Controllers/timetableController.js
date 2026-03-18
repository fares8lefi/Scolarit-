const Class = require("../Models/ClassModel");
const Subject = require("../Models/SubjectModel");
const Classroom = require("../Models/ClassroomModel");
const TimetableEntry = require("../Models/TimetableEntryModel");
const User = require("../Models/UserModel");
const { sendTimetableUpdateNotification } = require("../services/emailService");


// Class Controllers

exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Classe non trouvée" });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ message: "Classe non trouvée" });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ message: "Classe non trouvée" });
    res.json({ message: "Classe supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Subject Controllers

exports.createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Matière non trouvée" });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubject) return res.status(404).json({ message: "Matière non trouvée" });
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) return res.status(404).json({ message: "Matière non trouvée" });
    res.json({ message: "Matière supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Classroom Controllers

exports.createClassroom = async (req, res) => {
  try {
    const classroom = new Classroom(req.body);
    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ message: "Salle non trouvée" });
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClassroom = async (req, res) => {
  try {
    const updatedClassroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClassroom) return res.status(404).json({ message: "Salle non trouvée" });
    res.json(updatedClassroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!deletedClassroom) return res.status(404).json({ message: "Salle non trouvée" });
    res.json({ message: "Salle supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Timetable Controllers

exports.createTimetableEntry = async (req, res) => {
  try {
    const entry = new TimetableEntry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const { classId, teacherId, classroomId } = req.query;
    const filter = {};
    if (classId) filter.classId = classId;
    if (teacherId) filter.teacherId = teacherId;
    if (classroomId) filter.classroomId = classroomId;

    const entries = await TimetableEntry.find(filter)
      .populate("classId")
      .populate("teacherId", "firstName lastName email")
      .populate("subjectId")
      .populate("classroomId");
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTimetableEntryById = async (req, res) => {
  try {
    const entry = await TimetableEntry.findById(req.params.id)
      .populate("classId")
      .populate("teacherId", "firstName lastName email")
      .populate("subjectId")
      .populate("classroomId");
    if (!entry) return res.status(404).json({ message: "Cours non trouvé" });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTimetableEntry = async (req, res) => {
  try {
    const entry = await TimetableEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Cours non trouvé" });

    Object.assign(entry, req.body);
    // this triggers pre('save') hook for validation
    await entry.save();
    
    // repopulate the entry to return updated populated results
    const populatedEntry = await TimetableEntry.findById(entry._id)
      .populate("classId")
      .populate("teacherId", "firstName lastName email")
      .populate("subjectId")
      .populate("classroomId");

    // Envoyer un email à TOUS les utilisateurs enregistrés et actifs
    const users = await User.find({ status: "ACTIVE" }).select("email");
    const emails = users.map(u => u.email).filter(e => e); // Ne garder que les emails valides

    if (emails.length > 0) {
      const entryInfo = {
        className: populatedEntry.classId ? populatedEntry.classId.name : "N/A",
        subjectName: populatedEntry.subjectId ? populatedEntry.subjectId.name : "N/A",
        dayOfWeek: populatedEntry.dayOfWeek,
        startTime: populatedEntry.startTime,
        endTime: populatedEntry.endTime
      };
      
      // On lance l'envoi sans attendre le résultat pour ne pas faire patienter l'utilisateur
      sendTimetableUpdateNotification(emails, entryInfo)
        .catch(err => console.error("Échec de l'envoi des notifications:", err));
    }

    res.json(populatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTimetableEntry = async (req, res) => {
  try {
    const deletedEntry = await TimetableEntry.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ message: "Cours non trouvé" });
    res.json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getParentTimetable = async (req, res) => {
  try {
    const parentId = req.params.parentId;
    const parent = await User.findById(parentId);

    if (!parent || parent.role !== "PARENT") {
      return res.status(404).json({ message: "Parent non trouvé ou rôle invalide" });
    }

    if (!parent.children || parent.children.length === 0) {
      return res.json([]);
    }

    const classIds = parent.children.map(child => child.classId);

    const entries = await TimetableEntry.find({ classId: { $in: classIds } })
      .populate("classId")
      .populate("teacherId", "firstName lastName email")
      .populate("subjectId")
      .populate("classroomId");
      
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, classroomId } = req.query;

    if (!dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ message: "dayOfWeek, startTime and endTime are required" });
    }

    const query = {
      dayOfWeek,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    };

    if (classroomId) {
      // Check if ONE specific classroom is free
      const conflict = await TimetableEntry.findOne({ ...query, classroomId });
      return res.json({ available: !conflict });
    } else {
      // Find ALL available classrooms for this slot
      const occupiedClassrooms = await TimetableEntry.find(query).distinct("classroomId");
      const everyClassroom = await Classroom.find();
      const availableClassrooms = everyClassroom.filter(
        (room) => !occupiedClassrooms.some((occupiedId) => occupiedId.equals(room._id))
      );
      return res.json(availableClassrooms);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTeacherClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const entries = await TimetableEntry.find({ teacherId }).distinct("classId");
    const classes = await Class.find({ _id: { $in: entries } });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const entries = await TimetableEntry.find({ teacherId })
      .populate("classId")
      .populate("teacherId", "firstName lastName email")
      .populate("subjectId")
      .populate("classroomId");
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


