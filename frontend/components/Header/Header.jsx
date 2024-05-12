import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./../../context/authcontext";
import apiRequest from "../../Config/config";
import toast from "react-hot-toast";

const Header = () => {
  const { setUser, setToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear state
    setUser(null);
    setToken(null);

    const { data } = await apiRequest.post("/auth/logout");
    toast.success(data.message);
    setTimeout(() => {
      // Redirect to login page
      navigate("/login");
    }, 2000);
  };
  return (
    <div
      className="fixed top-0 px-4 py-4 shadow-lg header w-[100%] z-50"
      style={{ backgroundColor: "var(--color-green)" }}
    >
      <div className="flex justify-between">
        <div className="text-white left">
          <h1>Logo</h1>
        </div>
        <div className="flex gap-4 text-white right">
          {user && (
            <Link to={"/"} className="link">
              Home
            </Link>
          )}
          {user ? (
            <>
              {user && user.role == "ADMIN" && (
                <Link to={"/dashboard"} className="link">
                  Dashboard
                </Link>
              )}
              <Link to={"/"} onClick={handleLogout} className="link">
                Logout
              </Link>
            </>
          ) : (
            <Link to={"/login"} className="link">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
