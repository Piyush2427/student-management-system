import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Save, CalendarCheck, BookOpen, Users } from "lucide-react";

function BulkAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch unique courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students?limit=1000", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allStudents = res.data.students || res.data;
        const uniqueCourses = [...new Set(allStudents.map(s => s.course))].filter(Boolean);
        setCourses(uniqueCourses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };
    fetchCourses();
  }, [token]);

  // Fetch students when a course is selected
  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      return;
    }

    const fetchStudentsInCourse = async () => {
      setLoading(true);
      try {
        // We use the search endpoint to filter by course
        const res = await axios.get(`http://localhost:5000/api/students?search=${selectedCourse}&limit=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Ensure exact course match since search might be fuzzy
        const filtered = (res.data.students || res.data).filter(s => s.course === selectedCourse);
        setStudents(filtered);
        
        // Initialize attendance data (all present by default)
        const initialData = {};
        filtered.forEach(s => {
          initialData[s._id] = true;
        });
        setAttendanceData(initialData);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsInCourse();
  }, [selectedCourse, token]);

  const toggleAttendance = (studentId) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !subject) return alert("Please select a course and enter a subject.");
    if (students.length === 0) return alert("No students in this course.");

    const payload = {
      subject: subject.trim(),
      attendanceData: Object.entries(attendanceData).map(([studentId, present]) => ({
        studentId,
        present
      }))
    };

    setSaving(true);
    try {
      await axios.put("http://localhost:5000/api/students/bulk-attendance", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Attendance saved successfully!");
      // Reset subject to prevent double submission
      setSubject("");
    } catch (error) {
      console.error(error);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendanceData).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Class Register</h1>
        <p className="text-gray-400">Mark bulk daily attendance for an entire class.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Course</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={18} className="text-gray-400" />
              </div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-3 rounded-xl appearance-none"
                required
              >
                <option value="" className="bg-gray-900 text-gray-400">-- Choose a Course --</option>
                {courses.map(c => (
                  <option key={c} value={c} className="bg-gray-900 text-white">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject Taught Today</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures"
                className="glass-input w-full pl-10 pr-4 py-3 rounded-xl"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving || students.length === 0 || !subject}
            className="glass-button px-8 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 h-[50px]"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Submit Register</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 glass-panel rounded-2xl">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : selectedCourse && students.length > 0 ? (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <CalendarCheck className="text-blue-400" size={20} />
              <h3 className="text-lg font-bold text-white">Attendance Roster</h3>
            </div>
            <div className="flex gap-4 text-sm font-medium">
              <span className="text-green-400">Present: {presentCount}</span>
              <span className="text-red-400">Absent: {absentCount}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 font-semibold text-gray-300">Roll No / ID</th>
                  <th className="p-4 font-semibold text-gray-300">Student Name</th>
                  <th className="p-4 font-semibold text-gray-300">Email</th>
                  <th className="p-4 font-semibold text-gray-300 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="p-4 text-gray-500 font-mono text-xs">{s._id.substring(18)}</td>
                    <td className="p-4 text-white font-medium">{s.name}</td>
                    <td className="p-4 text-gray-400">{s.email}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleAttendance(s._id)}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                          attendanceData[s._id] ? 'bg-green-500' : 'bg-red-500/50'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            attendanceData[s._id] ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`ml-3 text-sm font-bold inline-block w-16 text-left ${attendanceData[s._id] ? 'text-green-400' : 'text-red-400'}`}>
                        {attendanceData[s._id] ? 'Present' : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : selectedCourse ? (
        <div className="glass-panel p-8 rounded-2xl text-center text-gray-400">
          No students found in this course.
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-2xl text-center text-gray-400 border border-dashed border-white/10">
          Select a course above to load the student roster.
        </div>
      )}
    </div>
  );
}

export default BulkAttendance;
