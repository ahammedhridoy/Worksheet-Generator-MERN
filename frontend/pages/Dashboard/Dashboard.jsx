import { Button } from "@/components/ui/button";
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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./../../context/authcontext";
import { Link, useNavigate } from "react-router-dom";
import { QuestionContext } from "./../../context/questionContext";
import toast from "react-hot-toast";
import apiRequest from "../../Config/config";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const { questions, fetchQuestions } = useContext(QuestionContext);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(5);
  useEffect(() => {
    if (!user || !token) {
      navigate("/dashboard");
    }
  }, []);

  // Delete Question
  const deleteQuestion = async (id) => {
    console.log(id);
    try {
      const { data } = await apiRequest.delete(`/questions/${Number(id)}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data.message);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Function to load more posts
  const loadMore = () => {
    setVisible((prevVisible) => prevVisible + 5);
  };

  return (
    <div className="p-4 dashboard w-[100%]">
      {questions.slice(0, visible)?.map((q, index) => (
        <div
          className="flex-col md:flex-row flex mb-4 items-center justify-between gap-2 p-2 rounded-sm shadow-lg bg-[var(--color-green)]"
          key={index}
        >
          <div
            className="text-white line-clamp-1 dashb-question"
            dangerouslySetInnerHTML={{
              __html: q ? q.question : "",
            }}
          ></div>
          <div className="flex gap-2 mt-3 md:m-0 ">
            <Link to={`/question/edit/${q.id}`}>
              <Button>Edit</Button>
            </Link>

            {/* AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure want to delete?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteQuestion(q.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
      {questions.length > visible ? (
        <div className="mt-4 text-center">
          <Button onClick={loadMore}>Load More</Button>
        </div>
      ) : (
        <div className="mt-4 text-2xl font-semibold text-center">
          No More Questions Found
        </div>
      )}
    </div>
  );
};

export default Dashboard;
