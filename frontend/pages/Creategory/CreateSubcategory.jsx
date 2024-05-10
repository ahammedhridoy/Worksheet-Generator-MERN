import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "./../../context/authcontext";
import { useNavigate } from "react-router-dom";
import { QuestionContext } from "./../../context/questionContext";
import apiRequest from "./../../Config/config";

const CreateSubcategory = () => {
  const [name, setName] = useState("");
  const [sidebarCategoryState, setSidebarCategoryState] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { user, token } = useContext(AuthContext);
  const { category, getsubCategories, subcategory } =
    useContext(QuestionContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || (user && user.role !== "ADMIN") || !token) {
      navigate("/");
    }
  }, [user, token]);

  // create subcategory
  const createsubCategory = async () => {
    try {
      const res = await apiRequest.post("/sub-category", {
        name,
        categoryId,
      });
      if (res.status === 201) {
        toast.success("Subcategory created successfully");
        setName("");
        getsubCategories();
      }
    } catch (error) {
      console.log(error, "Error on creating Subcategory");
      toast.error("Error on creating Subcategory");
    }
  };

  // delete subcategory
  const deleteSubcategory = async (id) => {
    try {
      const res = await apiRequest.delete(`/sub-category/${id}`);
      if (res.status === 204) {
        toast.success("Subcategory deleted successfully");
        getsubCategories();
      }
    } catch (error) {
      console.log(error, "Error on deleting Subcategory");
      toast.error("Error on deleting Subcategory");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-4 add-user md:my-0">
      <div className="w-[100%] flex gap-4 flex-wrap mb-4">
        {subcategory?.map((cat, i) => (
          <div
            className="flex-col flex mb-4 items-center justify-between gap-2 p-2 rounded-sm shadow-lg bg-[var(--color-green)]"
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
                    <AlertDialogAction
                      onClick={() => deleteSubcategory(cat?.id)}
                    >
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
            <CardTitle>Create Subcategory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid items-center w-full gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Select a Category First</Label>
                <Select
                  value={sidebarCategoryState}
                  onValueChange={(value) => {
                    const selectedCategory = category.find(
                      (selCat) => selCat.name === value
                    );
                    setCategoryId(selectedCategory?.id);
                    setSidebarCategoryState(value);
                  }}
                >
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {category &&
                      category.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Subcategory Name</Label>
                <Input
                  type="text"
                  placeholder="username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={createsubCategory}>Create Subcategory</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateSubcategory;
