import mongoose from "mongoose";
import dotenv from "dotenv";
import Class from "../Models/ClassModel.js";
import Subject from "../Models/SubjectModel.js";
import Classroom from "../Models/ClassroomModel.js";
import User from "../Models/UserModel.js";
import TimetableEntry from "../Models/TimetableEntryModel.js";

dotenv.config();

async function runTest() {
  try {
    await mongoose.connect(process.env.db_url);
    console.log("Connected to DB for testing...");

    // Clean up or find existing test data
    let testClass = await Class.findOne({ name: "Test Class 3A" });
    if (!testClass) testClass = await Class.create({ name: "Test Class 3A", level: "3", capacity: 30 });

    let testSubject = await Subject.findOne({ code: "TEST101" });
    if (!testSubject) testSubject = await Subject.create({ name: "Test Subject", code: "TEST101" });

    let testRoom = await Classroom.findOne({ name: "Room 101" });
    if (!testRoom) testRoom = await Classroom.create({ name: "Room 101", building: "Main", capacity: 40 });

    let testTeacher = await User.findOne({ email: "teacher@test.com" });
    if (!testTeacher) testTeacher = await User.create({ firstName: "Test", lastName: "Teacher", email: "teacher@test.com", role: "TEACHER" });

    // 1. Create a baseline entry
    console.log("Creating baseline entry: Monday 08:00 - 09:00");
    await TimetableEntry.deleteMany({ dayOfWeek: "Monday" }); // Reset
    const baseline = await TimetableEntry.create({
      classId: testClass._id,
      teacherId: testTeacher._id,
      subjectId: testSubject._id,
      classroomId: testRoom._id,
      dayOfWeek: "Monday",
      startTime: "08:00",
      endTime: "09:00"
    });
    console.log("Success!");

    // 2. Test Rule 1: Class conflict
    console.log("Testing Rule 1: Same Class, same time...");
    try {
      await TimetableEntry.create({
        classId: testClass._id, 
        teacherId: new mongoose.Types.ObjectId(), // Different teacher
        subjectId: testSubject._id,
        classroomId: new mongoose.Types.ObjectId(), // Different room
        dayOfWeek: "Monday",
        startTime: "08:30",
        endTime: "09:30"
      });
      console.error("FAIL: Rule 1 not enforced!");
    } catch (e) {
      console.log("PASS: Rule 1 enforced:", e.message);
    }

    // 3. Test Rule 2: Teacher conflict
    console.log("Testing Rule 2: Same Teacher, same time...");
    try {
        await TimetableEntry.create({
          classId: new mongoose.Types.ObjectId(), // Different class
          teacherId: testTeacher._id, 
          subjectId: testSubject._id,
          classroomId: new mongoose.Types.ObjectId(), // Different room
          dayOfWeek: "Monday",
          startTime: "08:30",
          endTime: "09:30"
        });
        console.error("FAIL: Rule 2 not enforced!");
      } catch (e) {
        console.log("PASS: Rule 2 enforced:", e.message);
      }

    // 4. Test Rule 3: Classroom conflict
    console.log("Testing Rule 3: Same Classroom, same time...");
    try {
        await TimetableEntry.create({
          classId: new mongoose.Types.ObjectId(), // Different class
          teacherId: new mongoose.Types.ObjectId(), // Different teacher
          subjectId: testSubject._id,
          classroomId: testRoom._id, 
          dayOfWeek: "Monday",
          startTime: "08:30",
          endTime: "09:30"
        });
        console.error("FAIL: Rule 3 not enforced!");
      } catch (e) {
        console.log("PASS: Rule 3 enforced:", e.message);
      }

  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
