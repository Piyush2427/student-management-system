import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, ArrowLeft, Save, Loader2 } from "lucide-react";

function EditStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");
  
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
        const student = res.data;
        setName(student.name);
        setEmail(student.email);
        setCourse(student.course || "");
        setMarks(student.marks || "");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch student details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudent();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.put(`http://localhost:5000/api/students/${id}`, 
        { name, email, course, marks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/students");
    } catch (err) {
      console.error(err);
      alert("Failed to update student");
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

  if (error) {
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
    <div className="animate-fade-in max-w-2xl mx-auto">
      <button 
        onClick={() => navigate("/students")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Directory</span>
      </button>

      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Student Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
              <input 
                type="text" 
                placeholder="e.g. Computer Science" 
                value={course} 
                onChange={(e) => setCourse(e.target.value)} 
                required 
                className="glass-input w-full px-4 py-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Marks</label>
              <input 
                type="number" 
                placeholder="0-100" 
                min="0"
                max="100"
                value={marks} 
                onChange={(e) => setMarks(e.target.value)} 
                required 
                className="glass-input w-full px-4 py-2.5 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="glass-button px-6 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              <span>{saving ? "Saving Updates..." : "Update Student"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;
