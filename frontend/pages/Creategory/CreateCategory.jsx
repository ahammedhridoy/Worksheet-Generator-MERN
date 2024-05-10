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
import { AuthContext } from "./../../context/authcontext";
import { useNavigate } from "react-router-dom";
import apiRequest from "./../../Config/config";
import { QuestionContext } from "./../../context/questionContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const CreateCategory = () => {
  const [name, setName] = useState("");
  const { user, token } = useContext(AuthContext);
  const { category, getCategories } = useContext(QuestionContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || (user && user.role !== "ADMIN") || !token) {
      navigate("/");
    }
  }, [user, token]);

  // create category
  const createCategory = async () => {
    try {
      const res = await apiRequest.post("/categories", {
        name,
      });
      if (res.status === 201) {
        toast.success("Category created successfully");
        setName("");
        getCategories();
      }
    } catch (error) {
      console.log(error, "Error on creating category");
      toast.error("Error on creating category");
    }
  };

  // delete category
  const deleteCategory = async (id) => {
    try {
      const res = await apiRequest.delete(`/categories/${id}`);
      if (res.status === 200) {
        toast.success("Category deleted successfully");
        getCategories();
      }
    } catch (error) {
      console.log(error, "Error on deleting category");
      toast.error("Error on deleting category");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-4 add-user md:my-0">
      <div className="w-[100%] flex gap-4 flex-wrap mb-4">
        {category?.map((cat, i) => (
          <div
            className=" flex-col flex mb-4 items-center justify-between gap-2 p-2 rounded-sm shadow-lg bg-[var(--color-green)]"
            key={i}
          >
            <div className="text-white dashb-question">{cat?.name}</div>
            <div className="flex gap-2 mt-3 md:m-0 ">
              {/* AlertDialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure want to delete?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCategory(cat?.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
      <Toaster />
      <div className="">
        <Card className="w-[350px] md:w-[450px]">
          <CardHeader>
            <CardTitle>Create Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid items-center w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Category Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="username"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={createCategory}>Create</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateCategory;
