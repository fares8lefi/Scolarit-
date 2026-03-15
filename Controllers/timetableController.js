import Class from "../Models/ClassModel.js";
import Subject from "../Models/SubjectModel.js";
import Classroom from "../Models/ClassroomModel.js";
import TimetableEntry from "../Models/TimetableEntryModel.js";

// ==========================================
// Class Controllers
// ==========================================
export const createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Subject Controllers
// ==========================================
export const createSubject = async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Classroom Controllers
// ==========================================
export const createClassroom = async (req, res) => {
  try {
    const classroom = new Classroom(req.body);
    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Timetable Controllers
// ==========================================
export const createTimetableEntry = async (req, res) => {
  try {
    const entry = new TimetableEntry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTimetable = async (req, res) => {
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
