import mongoose from "mongoose";

const timetableEntrySchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming teachers are in the User collection
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  dayOfWeek: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  startTime: {
    type: String, // format "HH:mm"
    required: true,
  },
  endTime: {
    type: String, // format "HH:mm"
    required: true,
  }
}, { timestamps: true });

// Rule 1: A class cannot have two courses at the same time.
// Rule 2: A teacher cannot teach two classes at the same time.
// Rule 3: A classroom cannot host two courses at the same time.

timetableEntrySchema.pre("save", async function() {
  const entry = this;
  
  // Basic validation
  if (entry.startTime >= entry.endTime) {
    throw new Error("Start time must be before end time");
  }

  const query = {
    _id: { $ne: entry._id },
    dayOfWeek: entry.dayOfWeek,
    $or: [
      {
        startTime: { $lt: entry.endTime },
        endTime: { $gt: entry.startTime }
      }
    ]
  };

  const TimetableEntry = mongoose.model("TimetableEntry");

  // Check Class conflict
  const classConflict = await TimetableEntry.findOne({
    ...query,
    classId: entry.classId
  });
  if (classConflict) throw new Error("This class already has a course during this time.");

  // Check Teacher conflict
  const teacherConflict = await TimetableEntry.findOne({
    ...query,
    teacherId: entry.teacherId
  });
  if (teacherConflict) throw new Error("This teacher is already teaching another class during this time.");

  // Check Classroom conflict
  const classroomConflict = await TimetableEntry.findOne({
    ...query,
    classroomId: entry.classroomId
  });
  if (classroomConflict) throw new Error("This classroom is already booked during this time.");
});

export default mongoose.model("TimetableEntry", timetableEntrySchema);
