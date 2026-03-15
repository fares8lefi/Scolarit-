import express from "express";
import * as timetableController from "../Controllers/timetableController.js";

const router = express.Router();

router.post("/classes/createClass", timetableController.createClass);
router.get("/classes/getClasses", timetableController.getClasses);

router.post("/subjects/createSubject", timetableController.createSubject);
router.get("/subjects/getSubjects", timetableController.getSubjects);

router.post("/classrooms/createClassroom", timetableController.createClassroom);
router.get("/classrooms/getClassrooms", timetableController.getClassrooms);

router.post("/entries/createTimetableEntry", timetableController.createTimetableEntry);
router.get("/entries/getTimetable", timetableController.getTimetable);

export default router;
