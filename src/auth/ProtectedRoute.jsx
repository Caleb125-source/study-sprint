import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isBooting } = useAuth();
  const location = useLocation();

  if (isBooting) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading… </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}