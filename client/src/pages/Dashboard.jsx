import { useEffect, useState } from "react";
import axios from "axios";
import { Users, GraduationCap, CalendarCheck, BarChart3, TrendingUp, Trophy, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, averageMarks: 0, averageAttendance: 0, topPerformers: [] });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch stats
        const statsRes = await axios.get(
          "http://localhost:5000/api/students/stats/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(statsRes.data);

        // Fetch chart data
        const chartRes = await axios.get(
          "http://localhost:5000/api/students/stats/charts",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChartData(chartRes.data);
      } catch (error) {
        console.log("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <Users size={24} className="text-blue-400" />,
      color: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20"
    },
    {
      title: "Average Marks",
      value: `${stats.averageMarks}%`,
      icon: <GraduationCap size={24} className="text-indigo-400" />,
      color: "from-indigo-500/20 to-indigo-600/5",
      border: "border-indigo-500/20"
    },
    {
      title: "Avg Attendance",
      value: `${stats.averageAttendance}%`,
      icon: <CalendarCheck size={24} className="text-purple-400" />,
      color: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/20"
    }
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className={`glass-panel p-6 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} hover:-translate-y-1 transition-transform duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                {card.icon}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-white">
                {loading ? <span className="animate-pulse bg-white/20 h-8 w-16 rounded inline-block"></span> : card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">Students per Course</h2>
            </div>
            
            <div className="h-[250px] w-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="animate-pulse bg-white/10 h-full w-full rounded-xl block"></span>
                </div>
              ) : chartData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No data available for chart.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                    <XAxis dataKey="course" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: '#ffffff10' }} 
                      contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    />
                    <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Students Enrolled" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-white">Average Attendance Trend</h2>
            </div>
            
            <div className="h-[250px] w-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="animate-pulse bg-white/10 h-full w-full rounded-xl block"></span>
                </div>
              ) : chartData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No data available for chart.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                    <XAxis dataKey="course" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="avgAttendance" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Avg Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Top Performers Column */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-400" size={24} />
                <h2 className="text-xl font-bold text-white">Top Performers</h2>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white/10 h-16 rounded-xl w-full"></div>
                ))}
              </div>
            ) : !stats.topPerformers || stats.topPerformers.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                No students available.
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topPerformers.map((student, index) => (
                  <div key={student._id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{student.name}</p>
                      <p className="text-xs text-gray-400 truncate">{student.course}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                        {student.marks || 0}<span className="text-xs text-gray-400">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-center text-gray-400">Ranked by overall percentage marks.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;