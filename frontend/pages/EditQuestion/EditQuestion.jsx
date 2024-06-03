import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AuthContext } from "./../../context/authcontext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { QuestionContext } from "./../../context/questionContext";
import { formats, modules } from "../../constants";
import apiRequest from "../../Config/config";
import { Input } from "@/components/ui/input";

const EditQuestion = () => {
  const { questions, category, fetchQuestions } = useContext(QuestionContext);
  const [qss, setQss] = useState({});

  const [updateQuestion, setUpdateQuestion] = useState({
    question: "",
    question_equation: "",
    answer: "",
    answer_equation: "",
    solution: "",
    solution_equation: "",
    categoryId: null,
    subcategoryId: null,
    filterlevel: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [categoryState, setCategoryState] = useState(); // our category state
  const [subCategoryState, setSubCategoryState] = useState("");
  const [subCategory, setSubCategory] = useState({});

  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!user || (user && user.role !== "ADMIN") || !token) {
      navigate("/");
    }
  }, [user, token]);

  useEffect(() => {
    const fetchQuestion = () => {
      const qs = questions.find((ques) => ques.id === Number(id));
      if (qs) {
        setUpdateQuestion({
          question: qs.question,
          question_equation: qs.question_equation,
          answer: qs.answer,
          answer_equation: qs.answer_equation,
          solution: qs.solution,
          solution_equation: qs.solution_equation,
          categoryId: qs.categoryId,
          subcategoryId: qs.subcategoryId,
          filterlevel: qs.filterlevel,
          image: qs.image,
        });

        setCategoryState(qs.category?.name);
        setQss(qs);
      }
    };
    fetchQuestion();
  }, [id, questions]);

  // Update the question
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("question", updateQuestion.question);
    formData.append("answer", updateQuestion.answer);
    formData.append("solution", updateQuestion.solution);
    formData.append("categoryId", updateQuestion.categoryId);
    formData.append("subcategoryId", updateQuestion.subcategoryId);
    formData.append("filterlevel", updateQuestion.filterlevel);
    formData.append("question_equation", updateQuestion.question_equation);
    formData.append("answer_equation", updateQuestion.answer_equation);
    formData.append("solution_equation", updateQuestion.solution_equation);

    if (updateQuestion.image) {
      formData.append("image", updateQuestion.image);
    }

    try {
      if (
        !updateQuestion.question ||
        !updateQuestion.answer ||
        !updateQuestion.solution
      ) {
        toast.error("All fields are required");
        setLoading(false);
        return;
      }

      const { data } = await apiRequest.put(
        `/questions/${Number(id)}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("update data: ", data);
      fetchQuestions();
      toast.success("Question updated successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to Update question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 add-question w-[90%] md:w-[80%]">
      <form onSubmit={handleSubmit} encType="multipart/form-data" method="post">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle>Edit Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid items-center w-full gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="image" name="image">
                  Update Image (Optional)
                </Label>
                <Input
                  id="imagefile"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setUpdateQuestion((prevState) => ({
                      ...prevState,
                      image: file,
                    }));
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="question">Question Title</Label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  className=""
                  theme="snow"
                  value={updateQuestion?.question}
                  onChange={(content) => {
                    setUpdateQuestion({ ...updateQuestion, question: content });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="question">Question Equation</Label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  className=""
                  theme="snow"
                  value={updateQuestion?.question_equation}
                  onChange={(content) => {
                    setUpdateQuestion({
                      ...updateQuestion,
                      question_equation: content,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="answer">Answer Title</Label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  className=""
                  theme="snow"
                  value={updateQuestion?.answer ?? "fail to show"}
                  onChange={(content) => {
                    setUpdateQuestion({ ...updateQuestion, answer: content });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="answer">Answer Equation</Label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  className=""
                  theme="snow"
                  value={updateQuestion?.answer_equation ?? "fail to show"}
                  onChange={(content) => {
                    setUpdateQuestion({
                      ...updateQuestion,
                      answer_equation: content,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="solution">Solution Title</Label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  className=""
                  theme="snow"
                  value={updateQuestion?.solution}
                  onChange={(content) => {
                    setUpdateQuestion({ ...updateQuestion, solution: content });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="solution">Solution Equation</Label>
                <ReactQuill
                  modules={modules}
                  formats={formats}
                  className=""
                  theme="snow"
                  value={updateQuestion?.solution_equation}
                  onChange={(content) => {
                    setUpdateQuestion({
                      ...updateQuestion,
                      solution_equation: content,
                    });
                  }}
                />
              </div>

              {/* old category */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  // defaultValue={qs.category?.name}
                  value={categoryState}
                  onValueChange={(value) => {
                    const selectedCategory = category?.find(
                      (selCat) => selCat.name === value
                    );
                    console.log("value", value);
                    setCategoryState((prev) => (value !== prev ? value : prev));
                    setUpdateQuestion({
                      ...updateQuestion,
                      categoryId: selectedCategory?.id,
                    });
                    setSubCategory(selectedCategory);
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {category &&
                      category?.map((cat, i) => (
                        <SelectItem key={i} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* old  sub category */}
              {subCategory && subCategory.subcategories?.length > 0 ? (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="sub-category">Sub Category</Label>
                  <Select
                    value={subCategoryState}
                    onValueChange={(value) => {
                      setSubCategoryState(value);
                      setUpdateQuestion({
                        ...updateQuestion,
                        subcategoryId: subCategory.subcategories.find(
                          (subCat) => subCat.name === value
                        )?.id,
                      });
                    }}
                  >
                    <SelectTrigger id="sub-category-filter">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {subCategory.subcategories &&
                        subCategory.subcategories?.map((subCat) => (
                          <SelectItem key={subCat.name} value={subCat.name}>
                            {subCat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="level">Select Level</Label>
                <Select
                  value={updateQuestion.filterlevel}
                  onValueChange={(value) =>
                    setUpdateQuestion({ ...updateQuestion, filterlevel: value })
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">
              {loading ? "Question Updating..." : "Update Question"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EditQuestion;
