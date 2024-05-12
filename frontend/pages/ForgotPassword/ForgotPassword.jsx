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
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import apiRequest from "./../../Config/config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../context/authcontext";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      navigate("/");
    }
  }, [user, token]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.post("/auth/forgot-password", {
        email,
      });
      toast.success(res.data?.message);
      console.log(res);
    } catch (error) {
      console.log(error);
      const message = error.response?.data;
      toast.error(message);
    } finally {
      setLoading(false);
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
                Forgot Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid items-center w-full gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="name"
                    type="email"
                    placeholder="enter email to reset the password"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleSubmit}>
                {loading ? "Sending..." : "Submit"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
