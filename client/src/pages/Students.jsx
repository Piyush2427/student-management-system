import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight, Loader2, Download, ClipboardCheck, Filter, ArrowUpDown } from "lucide-react";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/students?search=${search}&page=${page}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      let fetchedStudents = res.data.students || res.data;
      
      if (filterCourse) {
        fetchedStudents = fetchedStudents.filter(s => s.course === filterCourse);
      }
      
      if (sortBy) {
        fetchedStudents.sort((a, b) => {
          const valA = a[sortBy] || 0;
          const valB = b[sortBy] || 0;
          return sortDesc ? valB - valA : valA - valB;
        });
      }

      setStudents(fetchedStudents);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStudents();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const exportToCSV = () => {
    if (students.length === 0) return alert("No students to export.");
    
    const headers = ["Name", "Email", "Course", "Marks", "Attendance"];
    const csvRows = [
      headers.join(","),
      ...students.map(s => `"${s.name}","${s.email}","${s.course}",${s.marks || 0},${s.attendance || 0}`)
    ];
    
    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, filterCourse, sortBy, sortDesc, page]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Directory</h1>
          <p className="text-gray-400">Manage your students efficiently.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-5 py-2.5 rounded-xl flex items-center gap-2 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
            onClick={exportToCSV}
          >
            <Download size={20} />
            <span>Export CSV</span>
          </button>
          <button
            className="glass-button px-5 py-2.5 rounded-xl flex items-center gap-2"
            onClick={() => navigate("/add-student")}
          >
            <Plus size={20} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5">
          <div className="relative flex-1 w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
              type="text"
              placeholder="Search students by name, email, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
              <select
                className="glass-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm appearance-none"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="" className="bg-gray-900">All Courses</option>
                {courses.map(c => (
                  <option key={c} value={c} className="bg-gray-900">{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold text-gray-300">Name</th>
                <th className="p-4 font-semibold text-gray-300">Email</th>
                <th className="p-4 font-semibold text-gray-300">Course</th>
                <th className="p-4 font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors group" onClick={() => toggleSort('marks')}>
                  <div className="flex items-center gap-1">
                    Marks <ArrowUpDown size={14} className={`text-gray-500 group-hover:text-white ${sortBy === 'marks' ? 'text-blue-400' : ''}`} />
                  </div>
                </th>
                <th className="p-4 font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors group" onClick={() => toggleSort('attendance')}>
                  <div className="flex items-center gap-1">
                    Attendance <ArrowUpDown size={14} className={`text-gray-500 group-hover:text-white ${sortBy === 'attendance' ? 'text-blue-400' : ''}`} />
                  </div>
                </th>
                <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                    <p className="text-gray-400">Loading students...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="p-4 text-white font-medium">{s.name}</td>
                    <td className="p-4 text-gray-400">{s.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                        {s.course}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300 font-medium">{s.marks || 0}%</td>
                    <td className="p-4 text-gray-300">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${s.attendance >= 75 ? 'bg-green-500/20 text-green-400' : s.attendance >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {s.attendance || 0}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-colors mr-2"
                        onClick={() => navigate(`/mark-attendance/${s._id}`)}
                        title="Mark Attendance"
                      >
                        <ClipboardCheck size={18} />
                      </button>
                      <button
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors mr-2"
                        onClick={() => navigate(`/edit-student/${s._id}`)}
                        title="Edit Student"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(s._id)}
                        title="Delete Student"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white/5 glass-panel rounded-xl p-4">
        <p className="text-sm text-gray-400">Showing page <span className="text-white font-medium">{page}</span></p>
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-lg border transition-colors ${
              page === 1 
                ? "border-white/5 text-gray-600 cursor-not-allowed" 
                : "border-white/10 text-gray-300 hover:bg-white/10"
            }`}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            className="p-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Students;