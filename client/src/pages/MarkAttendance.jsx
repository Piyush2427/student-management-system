import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Loader2, ClipboardList } from "lucide-react";

function MarkAttendance() {
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(res.data);
        setSubjects(res.data.subjects || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch student details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudent();
  }, [id, token]);

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: "", attendedClasses: 0, totalClasses: 0 }]);
  };

  const handleRemoveSubject = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const isValid = subjects.every(sub => sub.name.trim() !== "" && sub.attendedClasses <= sub.totalClasses);
    if (!isValid) {
      return alert("Please ensure all subjects have names and attended classes do not exceed total classes.");
    }

    setSaving(true);
    
    try {
      await axios.put(`http://localhost:5000/api/students/${id}/attendance`, 
        { subjects },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/students");
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => navigate("/students")} className="text-blue-400 hover:underline">
          Go back to directory
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button 
        onClick={() => navigate("/students")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Directory</span>
      </button>

      <div className="glass-panel p-8 rounded-2xl mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/20">
            <ClipboardList size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Mark Attendance</h2>
            <p className="text-gray-400">Manage subject-wise attendance for <span className="text-white font-medium">{student.name}</span></p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-8">
            {subjects.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                <p className="text-gray-400 mb-4">No subjects added yet.</p>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={18} /> Add First Subject
                </button>
              </div>
            ) : (
              subjects.map((sub, index) => {
                const percentage = sub.totalClasses > 0 
                  ? Math.round((sub.attendedClasses / sub.totalClasses) * 100) 
                  : 0;

                return (
                  <div key={index} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Subject Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Mathematics" 
                        value={sub.name} 
                        onChange={(e) => handleSubjectChange(index, "name", e.target.value)} 
                        required 
                        className="glass-input w-full px-4 py-2.5 rounded-lg"
                      />
                    </div>
                    
                    <div className="w-full md:w-32">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Attended</label>
                      <input 
                        type="number" 
                        min="0"
                        value={sub.attendedClasses} 
                        onChange={(e) => handleSubjectChange(index, "attendedClasses", parseInt(e.target.value) || 0)} 
                        required 
                        className="glass-input w-full px-4 py-2.5 rounded-lg text-center"
                      />
                    </div>

                    <div className="hidden md:block text-gray-500 mt-4">/</div>

                    <div className="w-full md:w-32">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Total Classes</label>
                      <input 
                        type="number" 
                        min="0"
                        value={sub.totalClasses} 
                        onChange={(e) => handleSubjectChange(index, "totalClasses", parseInt(e.target.value) || 0)} 
                        required 
                        className="glass-input w-full px-4 py-2.5 rounded-lg text-center"
                      />
                    </div>

                    <div className="w-full md:w-24 mt-4 md:mt-0 flex flex-col items-center justify-center">
                      <label className="block text-xs font-medium text-gray-400 mb-1">%</label>
                      <div className={`font-bold text-lg ${percentage >= 75 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {percentage}%
                      </div>
                    </div>

                    <div className="mt-4 md:mt-5">
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(index)}
                        className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove Subject"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {subjects.length > 0 && (
            <button
              type="button"
              onClick={handleAddSubject}
              className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2 mb-8"
            >
              <Plus size={18} /> Add Another Subject
            </button>
          )}

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="glass-button px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              <span>{saving ? "Saving Attendance..." : "Save Attendance"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MarkAttendance;
