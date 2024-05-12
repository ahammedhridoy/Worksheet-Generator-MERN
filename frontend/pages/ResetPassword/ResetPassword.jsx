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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "./../../Config/config";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const token = location.pathname
    ?.split(/reset-password/)[1]
    .split("%")[0]
    .split("/")[1];

  // Reset password
  const handleSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match");
      }
      if (!password || !confirmPassword) {
        return toast.error("Please fill in all fields");
      }
      if (password.length < 6) {
        return toast.error("Password must be at least 6 characters");
      }
      const res = await apiRequest.post(`/auth/reset-password`, {
        token,
        newPassword: password,
      });
      if (res?.status === 200) {
        toast.success("Password updated successfully");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error.response.data.error);
    }
  };

  return (
    <div className="forgot-password">
      <Toaster />
      <div className="container min-h-[100vh] flex justify-center items-center">
        <div>
          <Card className="md:w-[400px] w-[350px]">
            <CardHeader>
              <CardTitle className="text-3xl text-center">
                Reset Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid items-center w-full gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="name"
                    type="password"
                    placeholder="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="name"
                    type="password"
                    placeholder="confirm-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleSubmit}>Reset</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
