import axios from "axios";

// Base URL setup
const URL = import.meta.env.VITE_URL;

export const publicRequest = axios.create({
  baseURL: URL,
  withCredentials: true,
});

// Create an Axios instance
const apiRequest = axios.create({
  baseURL: URL,
  withCredentials: true,
});

// Function to retrieve the token
function getToken() {
  const token = localStorage.getItem("token");
  return JSON.parse(token);
}

// Use an interceptor to add the token to each request
apiRequest.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export the Axios instance
export default apiRequest;
