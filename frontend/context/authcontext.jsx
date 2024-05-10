/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import apiRequest from "./../Config/config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);

  // Function to retrieve user and token from cookies
  function getUserAndTokenFromCookie() {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = storedToken ? JSON.parse(storedToken) : null;

    return { user, token };
  }

  //   Fetch user
  const fetchUsers = async () => {
    try {
      const { data } = await apiRequest.get("/users");
      setUsers(data || []);
    } catch (error) {
      console.log(error, "Error fetching users");
    }
  };

  useEffect(() => {
    const { token, user } = getUserAndTokenFromCookie();
    setUser(user);
    setToken(token);
    fetchUsers();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        getUserAndTokenFromCookie,
        setUser,
        setToken,
        user,
        token,
        users,
        fetchUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
