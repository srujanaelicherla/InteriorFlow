import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Fix: Import both from the same file
import { AuthProvider, useAuth } from "./context/AuthContext"; 
import Dashboard from "./pages/Dashboard";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center font-bold">Loading InteriorFlow...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/room/:id" element={<ProtectedRoute><RoomDetails /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}