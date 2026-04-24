import { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, BookOpen, CalendarCheck, Phone, MapPin, Loader2, Award, BookOpenCheck, GraduationCap, Calendar, ClipboardList } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError(err.response?.data?.message || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center mt-10 p-8 glass-panel rounded-2xl max-w-lg mx-auto border border-red-500/20 bg-red-500/5">
        <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
        <p className="text-gray-400 mb-4">{error || "Your student record is not linked properly."}</p>
        <p className="text-sm text-gray-500">Please contact the administrator to link your email to a student record.</p>
      </div>
    );
  }

  // Format data for Radar Chart
  const radarData = profile.subjects?.length > 0 
    ? profile.subjects.map(sub => {
        const percentage = sub.totalClasses === 0 ? 0 : Math.round((sub.attendedClasses / sub.totalClasses) * 100);
        return {
          subject: sub.name,
          attendance: percentage,
          fullMark: 100,
        };
      })
    : [];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-900">
              <User size={64} className="text-white" />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
            <p className="text-xl text-blue-400 font-medium mb-4">{profile.course || "Not Assigned"}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Mail size={16} className="text-gray-400" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Information */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Circular Progress Stats */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="text-yellow-400" size={20} />
              Overall Performance
            </h2>
            
            <div className="flex flex-col items-center gap-8">
              {/* Overall Attendance Circle */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="#1f2937" strokeWidth="12" />
                  <circle 
                    cx="80" cy="80" r="70" fill="transparent" 
                    stroke="url(#purpleGradient)" strokeWidth="12" 
                    strokeDasharray={`${(profile.attendance / 100) * 440} 440`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold text-white">{profile.attendance || 0}%</span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Attendance</span>
                </div>
              </div>
              
              {/* Overall Marks Circle */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="#1f2937" strokeWidth="12" />
                  <circle 
                    cx="80" cy="80" r="70" fill="transparent" 
                    stroke="url(#blueGradient)" strokeWidth="12" 
                    strokeDasharray={`${((profile.marks || 0) / 100) * 440} 440`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold text-white">{profile.marks || 0}%</span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Marks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Radar Chart for Subjects */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpenCheck className="text-green-400" size={20} />
              Subject-Wise Analysis
            </h2>

            {profile.subjects && profile.subjects.length > 0 ? (
              <div className="h-[400px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      stroke="#ffffff20"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Radar 
                      name="Attendance %" 
                      dataKey="attendance" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.5} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                <BookOpen size={48} className="mb-4 opacity-50 text-gray-600" />
                <p>No subject data available.</p>
                <p className="text-sm mt-2">Ask your administrator to mark your attendance.</p>
              </div>
            )}
            
            {profile.subjects && profile.subjects.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.subjects.map((sub, idx) => {
                  const percentage = sub.totalClasses === 0 ? 0 : Math.round((sub.attendedClasses / sub.totalClasses) * 100);
                  return (
                    <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-xs text-gray-400 truncate" title={sub.name}>{sub.name}</p>
                      <div className="flex justify-between items-end mt-1">
                        <span className={`text-lg font-bold ${percentage >= 75 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {percentage}%
                        </span>
                        <span className="text-[10px] text-gray-500">{sub.attendedClasses}/{sub.totalClasses}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
