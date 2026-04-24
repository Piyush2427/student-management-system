import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, LogOut, User as UserIcon, ClipboardCheck } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const allNavLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} />, roles: ["admin"] },
    { name: "Students", path: "/students", icon: <Users size={20} />, roles: ["admin"] },
    { name: "Add Student", path: "/add-student", icon: <UserPlus size={20} />, roles: ["admin"] },
    { name: "Class Register", path: "/class-register", icon: <ClipboardCheck size={20} />, roles: ["admin"] },
    { name: "My Profile", path: "/my-profile", icon: <UserIcon size={20} />, roles: ["student"] },
  ];

  const navLinks = allNavLinks.filter(link => link.roles.includes(role));

  return (
    <div className="w-64 glass-panel h-screen flex flex-col fixed left-0 top-0 border-r border-white/10">
      <div className="p-6 mb-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          EduManage Pro
        </h1>
        <p className="text-xs text-gray-400 mt-1">Capstone Project</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
