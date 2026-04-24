import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter valid email"]
  },
  course: {
    type: String,
    required: [true, "Course is required"]
  },
  year: {
    type: Number,
    min: 1,
    max: 5
  },
  subjects: [{
    name: { type: String, required: true },
    attendedClasses: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 }
  }],
  attendance: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  marks: {
    type: Number,
    min: 0,
    max: 100
  }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);