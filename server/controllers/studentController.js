import Student from "../models/Student.js";
import User from "../models/User.js";

// CREATE student
export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all students
export const getStudents = async (req, res) => {
  try {
    const { search, page = 1, limit = 5 } = req.query;

    let query = {};

    // 🔍 Search by name or email
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { course: { $regex: search, $options: "i" } }
        ]
      };
    }

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      students
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single student
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// DELETE student
export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    
    const stats = await Student.aggregate([
      {
        $group: {
          _id: null,
          averageMarks: { $avg: "$marks" },
          averageAttendance: { $avg: "$attendance" }
        }
      }
    ]);

    const topPerformers = await Student.find()
      .sort({ marks: -1 })
      .limit(5)
      .select("name course marks attendance");

    res.json({
      totalStudents,
      averageMarks: stats.length > 0 ? Math.round(stats[0].averageMarks) : 0,
      averageAttendance: stats.length > 0 ? Math.round(stats[0].averageAttendance) : 0,
      topPerformers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET chart data
export const getChartData = async (req, res) => {
  try {
    const courseDistribution = await Student.aggregate([
      {
        $group: {
          _id: "$course",
          students: { $sum: 1 },
          avgAttendance: { $avg: "$attendance" }
        }
      },
      {
        $project: {
          course: "$_id",
          students: 1,
          avgAttendance: { $round: ["$avgAttendance", 0] },
          _id: 0
        }
      }
    ]);

    res.json(courseDistribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET my profile (for students)
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let student = await Student.findOne({ email: user.email });
    
    // Auto-heal missing profile
    if (!student) {
      student = await Student.create({
        name: user.name,
        email: user.email,
        course: "Pending Assignment",
        attendance: 0,
        marks: 0
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjects } = req.body;

    // Calculate overall attendance
    let totalAttended = 0;
    let totalClasses = 0;

    subjects.forEach(sub => {
      totalAttended += Number(sub.attendedClasses || 0);
      totalClasses += Number(sub.totalClasses || 0);
    });

    const overallAttendance = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);

    const student = await Student.findByIdAndUpdate(
      id,
      { subjects, attendance: overallAttendance },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT bulk attendance
export const markBulkAttendance = async (req, res) => {
  try {
    const { subject, attendanceData } = req.body;
    // attendanceData is an array of objects: { studentId: "id", present: true/false }

    for (const record of attendanceData) {
      const student = await Student.findById(record.studentId);
      if (!student) continue;

      let subjectIndex = student.subjects.findIndex(sub => sub.name.toLowerCase() === subject.toLowerCase());
      
      if (subjectIndex === -1) {
        // Add new subject if it doesn't exist
        student.subjects.push({ name: subject, attendedClasses: 0, totalClasses: 0 });
        subjectIndex = student.subjects.length - 1;
      }

      // Increment total classes
      student.subjects[subjectIndex].totalClasses += 1;
      
      // Increment attended classes if present
      if (record.present) {
        student.subjects[subjectIndex].attendedClasses += 1;
      }

      // Recalculate overall attendance
      let totalAttended = 0;
      let totalClasses = 0;

      student.subjects.forEach(sub => {
        totalAttended += Number(sub.attendedClasses || 0);
        totalClasses += Number(sub.totalClasses || 0);
      });

      student.attendance = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);

      await student.save();
    }

    res.json({ message: "Bulk attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};