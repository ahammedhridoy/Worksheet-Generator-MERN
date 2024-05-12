import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./../../context/authcontext";
import apiRequest from "./../../Config/config";
import toast, { Toaster } from "react-hot-toast";
import { QuestionContext } from "./../../context/questionContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getUserAndTokenFromCookie, user, setUser, setToken, token } =
    useContext(AuthContext);
  const { fetchQuestions } = useContext(QuestionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      navigate("/");
    }
  }, [user, token]);

  // User Login
  const userLogin = async () => {
    try {
      const response = await apiRequest.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      setUser(JSON.parse(localStorage.getItem("user")));
      setToken(JSON.parse(localStorage.getItem("token")));
      getUserAndTokenFromCookie();
      if (response?.status === 200) {
        toast.success("Login Successful");
        fetchQuestions();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };
  return (
    <div className="login">
      <Toaster />
      <div className="container min-h-[100vh] flex justify-center items-center">
        <div>
          <Card className="md:w-[400px] w-[350px]">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Login Here</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid items-center w-full gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="name"
                    type="email"
                    placeholder="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="name"
                    type="password"
                    placeholder="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={userLogin}>Login</Button>
              <p>
                Forgot Password?{" "}
                <Link
                  to={"/forgot-password"}
                  className="link text-[var(--primary-color)]"
                >
                  Click Here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
