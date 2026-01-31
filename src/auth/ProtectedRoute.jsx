import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // send user to login, and remember where they were trying to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}