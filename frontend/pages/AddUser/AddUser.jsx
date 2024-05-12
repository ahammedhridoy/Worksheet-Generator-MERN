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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiRequest from "./../../Config/config";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "./../../context/authcontext";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const { user, token, fetchUsers } = useContext(AuthContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!user || (user && user.role !== "ADMIN") || !token) {
      navigate("/");
    }
  }, [user, token]);

  // User Registration
  const registerUser = async () => {
    try {
      const res = await apiRequest.post(`/auth/register`, {
        username,
        email,
        password,
        role,
      });
      if (!username || !email || !password) {
        return toast.error("Please fill in all fields");
      }
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match");
      }
      if (res?.status === 201) {
        toast.success("User created successfully");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
        fetchUsers();
      }
    } catch (error) {
      console.log(error, "Error registering");
    }
  };

  return (
    <div className="flex items-center justify-center my-4 add-user md:my-0">
      <Toaster />
      <div className="">
        <Card className="w-[350px] md:w-[450px]">
          <CardHeader>
            <CardTitle>Add User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid items-center w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="name"
                  type="password"
                  placeholder="confirm-password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={registerUser}>Add User</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AddUser;
