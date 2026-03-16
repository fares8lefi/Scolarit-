const Class = require("../Models/ClassModel");
const Subject = require("../Models/SubjectModel");
const Classroom = require("../Models/ClassroomModel");
const TimetableEntry = require("../Models/TimetableEntryModel");


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
    const User = require("../Models/UserModel");
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

