import { useContext, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
import { Input } from "@/components/ui/input";
import { AuthContext } from "./../../context/authcontext";
import { QuestionContext } from "./../../context/questionContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiRequest from "./../../Config/config";
import { formats, modules } from "./../../constants/index";

const AddQuestion = () => {
  const [createQuestion, setCreateQuestion] = useState({
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
  const [categoryState, setCategoryState] = useState("");
  const [subCategoryState, setSubCategoryState] = useState("");
  const [subCategory, setSubCategory] = useState({});

  const { user, token } = useContext(AuthContext);
  const { category, fetchQuestions } = useContext(QuestionContext);
  const navigate = useNavigate();

  const questionRef = useRef(null);
  const answerRef = useRef(null);
  const solutionRef = useRef(null);
  const question_equationRef = useRef(null);
  const answer_equationRef = useRef(null);
  const solution_equationRef = useRef(null);

  useEffect(() => {
    if (!user || (user && user.role !== "ADMIN") || !token) {
      navigate("/");
    }
  }, [user, token, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !createQuestion.question ||
        !createQuestion.answer ||
        !createQuestion.solution ||
        !createQuestion.categoryId
      )
        return toast.error("All fields are required");

      const formData = new FormData();
      formData.append("question", createQuestion.question);
      formData.append("answer", createQuestion.answer);
      formData.append("solution", createQuestion.solution);
      formData.append("categoryId", createQuestion.categoryId);
      formData.append("subcategoryId", createQuestion.subcategoryId);
      formData.append("filterlevel", createQuestion.filterlevel);
      formData.append("question_equation", createQuestion.question_equation);
      formData.append("answer_equation", createQuestion.answer_equation);
      formData.append("solution_equation", createQuestion.solution_equation);

      if (createQuestion.image) {
        formData.append("image", createQuestion.image);
      }

      const { data } = await apiRequest.post(`/questions`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      fetchQuestions();
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      const message = error?.response?.data;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 add-question w-[90%] md:w-[80%]">
      <form
        onSubmit={submitHandler}
        encType="multipart/form-data"
        method="post"
      >
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid items-center w-full gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="image" name="image">
                  Add Image (Optional)
                </Label>
                <Input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setCreateQuestion({
                      ...createQuestion,
                      image: e.target.files[0],
                    })
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="question">Question Title</Label>

                <ReactQuill
                  ref={questionRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  className="quill"
                  value={createQuestion.question}
                  onChange={(content) => {
                    setCreateQuestion({ ...createQuestion, question: content });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="question">Question Equation</Label>

                <ReactQuill
                  ref={question_equationRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  className="quill"
                  value={createQuestion.question_equation}
                  onChange={(content) => {
                    setCreateQuestion({
                      ...createQuestion,
                      question_equation: content,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="answer">Answer Title</Label>
                <ReactQuill
                  ref={answerRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  className="quill"
                  value={createQuestion.answer}
                  onChange={(content) => {
                    setCreateQuestion({ ...createQuestion, answer: content });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="answer">Answer Equation</Label>
                <ReactQuill
                  ref={answer_equationRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  className="quill"
                  value={createQuestion.answer_equation}
                  onChange={(content) => {
                    setCreateQuestion({
                      ...createQuestion,
                      answer_equation: content,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="solution">Solution Title</Label>
                <ReactQuill
                  ref={solutionRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  className="quill"
                  value={createQuestion.solution}
                  onChange={(content) => {
                    setCreateQuestion({ ...createQuestion, solution: content });
                  }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="solution">Solution Equation</Label>
                <ReactQuill
                  ref={solution_equationRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  className="quill"
                  value={createQuestion.solution_equation}
                  onChange={(content) => {
                    setCreateQuestion({
                      ...createQuestion,
                      solution_equation: content,
                    });
                  }}
                />
              </div>

              {/* old category */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={categoryState}
                  onValueChange={(value) => {
                    const selectedCategory = category?.find(
                      (selCat) => selCat.name === value
                    );
                    setCategoryState(value);
                    setCreateQuestion({
                      ...createQuestion,
                      categoryId: selectedCategory.id,
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
                      setCreateQuestion({
                        ...createQuestion,
                        subcategoryId: subCategory.subcategories.find(
                          (subCat) => subCat.name === value
                        ).id,
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
                  value={createQuestion.filterlevel}
                  onValueChange={(value) =>
                    setCreateQuestion({ ...createQuestion, filterlevel: value })
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
              {loading ? "Question Adding..." : "Add Question"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddQuestion;
