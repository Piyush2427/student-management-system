import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, ArrowLeft, Save } from "lucide-react";

function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      await axios.post("http://localhost:5000/api/students", 
        { name, email, course, marks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/students");
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-2xl font-bold text-white mb-6">Add New Student</h2>
        
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
              disabled={loading}
              className="glass-button px-6 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              <span>{loading ? "Saving..." : "Save Student"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;