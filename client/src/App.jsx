import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import MarkAttendance from "./pages/MarkAttendance";
import BulkAttendance from "./pages/BulkAttendance";
import StudentProfile from "./pages/StudentProfile";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/edit-student/:id" element={<EditStudent />} />
          <Route path="/mark-attendance/:id" element={<MarkAttendance />} />
          <Route path="/class-register" element={<BulkAttendance />} />
          <Route path="/my-profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;