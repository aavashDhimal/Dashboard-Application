import { Link, Navigate, useOutlet } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  if (!localStorage.getItem("auth_token")) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;