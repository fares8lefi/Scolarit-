import express from "express";
import {
  createClass, getClasses,
  createSubject, getSubjects,
  createClassroom, getClassrooms,
  createTimetableEntry, getTimetable
} from "../Controllers/timetableController.js";

const router = express.Router();

router.post("/classes", createClass);
router.get("/classes", getClasses);

router.post("/subjects", createSubject);
router.get("/subjects", getSubjects);

router.post("/classrooms", createClassroom);
router.get("/classrooms", getClassrooms);

router.post("/entries", createTimetableEntry);
router.get("/entries", getTimetable);

export default router;
