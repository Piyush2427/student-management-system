import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Layout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 relative overflow-y-auto h-screen">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
        
        {/* Main content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
