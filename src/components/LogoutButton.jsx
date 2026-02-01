import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LogoutButton({ className, children = "Logout " }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <button type="button" className={className} onClick={onLogout}>
      {children}
    </button>
  );
}