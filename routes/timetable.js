const express = require("express");
const timetableController = require("../Controllers/timetableController");

const router = express.Router();

// Classes
router.post("/classes", timetableController.createClass);
router.get("/classes", timetableController.getClasses);
router.get("/classes/:id", timetableController.getClassById);
router.put("/classes/:id", timetableController.updateClass);
router.delete("/classes/:id", timetableController.deleteClass);

// Subjects
router.post("/subjects", timetableController.createSubject);
router.get("/subjects", timetableController.getSubjects);
router.get("/subjects/:id", timetableController.getSubjectById);
router.put("/subjects/:id", timetableController.updateSubject);
router.delete("/subjects/:id", timetableController.deleteSubject);

// Classrooms
router.post("/classrooms", timetableController.createClassroom);
router.get("/classrooms", timetableController.getClassrooms);
router.get("/classrooms/:id", timetableController.getClassroomById);
router.put("/classrooms/:id", timetableController.updateClassroom);
router.delete("/classrooms/:id", timetableController.deleteClassroom);

// Entries
router.post("/entries", timetableController.createTimetableEntry);
router.get("/entries", timetableController.getTimetable);
router.get("/entries/:id", timetableController.getTimetableEntryById);
router.put("/entries/:id", timetableController.updateTimetableEntry);
router.delete("/entries/:id", timetableController.deleteTimetableEntry);

// Parent timetable
router.get("/parent/:parentId/entries", timetableController.getParentTimetable);

// Teacher timetable
router.get("/teacher/:teacherId/classes", timetableController.getTeacherClasses);
router.get("/teacher/:teacherId/entries", timetableController.getTeacherTimetable);

// Availability
router.get("/availability", timetableController.checkAvailability);

module.exports = router;
