import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getDashboardStats,
  getChartData,
  getMyProfile,
  updateAttendance,
  markBulkAttendance
} from "../controllers/studentController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 Specific routes (must come before /:id)
router.get("/me", protect, getMyProfile);
router.get("/stats/dashboard", protect, getDashboardStats);
router.get("/stats/charts", protect, getChartData);

// 🔓 Public / Logged-in users
router.get("/", protect, getStudents);
router.get("/:id", protect, getStudentById);

// 🔒 Admin only
router.post("/", protect, adminOnly, createStudent);
router.put("/bulk-attendance", protect, adminOnly, markBulkAttendance);
router.put("/:id", protect, adminOnly, updateStudent);
router.put("/:id/attendance", protect, adminOnly, updateAttendance);
router.delete("/:id", protect, adminOnly, deleteStudent);

export default router;