import { useContext } from "react";
import { AuthContext } from "./../context/authcontext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { token, user } = useContext(AuthContext);
  return <div>{token && user ? <Outlet /> : <Navigate to="/login" />}</div>;
};

export default ProtectedRoute;
