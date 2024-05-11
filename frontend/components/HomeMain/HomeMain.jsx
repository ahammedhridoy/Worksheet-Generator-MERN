import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { useContext } from "react";
import { QuestionContext } from "./../../context/questionContext"; // Assuming the path is correct
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

const HomeMain = () => {
  const {
    questions,
    setQuestions,
    filteredQuestions,
    noQuestionsFound,
    handleReset,
    imageUrl,
  } = useContext(QuestionContext);

  const handleCheckboxChange = (index, checked) => {
    setQuestions((prevState) => {
      const updatedQuestions = [...prevState];
      updatedQuestions[index].selected = checked;
      return updatedQuestions;
    });
  };

  const htmFuc = (html) => {
    const processedHtml = html
      .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
      .replace(
        /&#(\d+);/g,
        (match, charCode) => String.fromCharCode(charCode) // Decode HTML entities
      )
      // Replace paragraph tags with line breaks
      .replace(/<p[^>]*>/g, "\n\n") // Match any type of <p> tag and replace with two line breaks
      .replace(/<\/p>/g, "") // Remove closing </p> tags
      // Remove specific tags (img, strong, etc.)
      .replace(/<img[^>]*>/g, "") // Remove image tags
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, "$1") // Remove strong tags and keep content
      .replace(/<[^>]+>/g, ""); // Remove all other HTML tags

    return processedHtml;
  };

  const generateDocument = () => {
    const selectedQuestions = questions.filter((q) => q.selected);

    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question.");
      return;
    }

    loadFile("/template.docx", function (error, content) {
      if (error) {
        console.error("Error loading template:", error);
        throw error;
      }

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const data = {};
      let questionData = "";

      // Static placeholders for selected questions
      data.question = "Question";
      data.answer = "Answer";
      data.solution = "Solution";

      // Dynamic placeholders for selected questions
      selectedQuestions.forEach((question, index) => {
        data[`question${index + 1}`] = htmFuc(question.question);
        data[`answer${index + 1}`] = htmFuc(question.answer);
        data[`solution${index + 1}`] = htmFuc(question.solution);
      });

      // Remove placeholders for unselected questions from the data
      const remainingPlaceholders = 100 - selectedQuestions.length;
      for (
        let i = selectedQuestions.length + 1;
        i <= selectedQuestions.length + remainingPlaceholders;
        i++
      ) {
        data[`question${i}`] = "";
        data[`answer${i}`] = "";
        data[`solution${i}`] = "";
      }

      // Concatenate data for selected questions into a single string
      selectedQuestions.forEach((question, index) => {
        questionData += `Question ${index + 1}: ${htmFuc(question.question)}\n`;
        questionData += `Answer ${index + 1}: ${htmFuc(question.answer)}\n`;
        questionData += `Solution ${index + 1}: ${htmFuc(
          question.solution
        )}\n\n`;
      });

      // Remove trailing empty lines
      questionData = questionData.trimRight();

      data["questions"] = questionData;

      doc.setData(data);
      doc.render();

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      console.log("Document generated successfully");

      saveAs(out, "output.docx");
    });
  };

  const selectedCount = questions.filter((q) => q.selected).length;

  return (
    <div className="">
      <Card className="w-[100%] p-5 min-h-screen rounded-none">
        {/* Selected Question Badge */}
        <div className="flex items-center justify-start gap-4 my-4">
          <Badge>Selected Question</Badge>{" "}
          <span className="py-[8px] px-[15px] text-white rounded-full selected bg-[var(--primary-color)]">
            {selectedCount}
          </span>
        </div>
        {/* Question Cards */}
        <div className="ques-wrap">
          {filteredQuestions?.length > 0 ? (
            <>
              {filteredQuestions ? (
                <>
                  {filteredQuestions.map((q, index) => (
                    <div className="mb-4" key={index}>
                      <Alert>
                        <div className="flex items-center my-2 space-x-2 q-check text-end">
                          <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer"
                            checked={q.selected}
                            onChange={(e) =>
                              handleCheckboxChange(index, e.target.checked)
                            }
                          />
                          <label
                            htmlFor="checkbox"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Select Question
                          </label>
                        </div>
                        <div className="mb-4">
                          <AlertTitle className="text-2xl">
                            Question:
                          </AlertTitle>
                          <img
                            className="w-[400px]"
                            src={`${imageUrl}/${q?.image}`}
                            alt=""
                          />
                          <AlertDescription
                            className="question-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.question : "",
                            }}
                          ></AlertDescription>
                        </div>
                        <div className="mb-4">
                          <AlertTitle className="text-2xl">Answer:</AlertTitle>
                          <AlertDescription
                            className="answer-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.answer : "",
                            }}
                          ></AlertDescription>
                        </div>
                        <div className="mb-4">
                          <AlertTitle className="text-2xl">
                            Solution:
                          </AlertTitle>
                          <AlertDescription
                            className="solution-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.solution : "",
                            }}
                          ></AlertDescription>
                        </div>
                      </Alert>
                    </div>
                  ))}
                </>
              ) : (
                <>No Questions Found</>
              )}
            </>
          ) : (
            <>
              {noQuestionsFound ? (
                <>
                  <p className="text-3xl font-semibold text-center text-red-500">
                    No questions found matching the selected filters.
                  </p>
                </>
              ) : (
                <>
                  {questions.map((q, index) => (
                    <div className="mb-4" key={index}>
                      <Alert>
                        <div className="flex items-center my-2 space-x-2 q-check text-end">
                          <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer"
                            checked={q.selected}
                            onChange={(e) =>
                              handleCheckboxChange(index, e.target.checked)
                            }
                          />
                          <label
                            htmlFor="checkbox"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Select Question
                          </label>
                        </div>
                        <div className="mb-4">
                          <AlertTitle className="text-2xl">
                            Question:
                          </AlertTitle>
                          <img
                            className="w-[400px]"
                            src={`${imageUrl}/${q?.image}`}
                            alt=""
                          />
                          <AlertDescription
                            className="question-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.question : "",
                            }}
                          ></AlertDescription>
                        </div>
                        <div className="mb-4">
                          <AlertTitle className="text-2xl">Answer:</AlertTitle>
                          <AlertDescription
                            className="answer-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.answer : "",
                            }}
                          ></AlertDescription>
                        </div>
                        <div className="mb-4">
                          <AlertTitle className="text-2xl">
                            Solution:
                          </AlertTitle>
                          <AlertDescription
                            className="solution-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.solution : "",
                            }}
                          ></AlertDescription>
                        </div>
                      </Alert>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
          {!noQuestionsFound && (
            <Button onClick={generateDocument}>Generate</Button>
          )}
          {noQuestionsFound && (
            <div className="mt-4 text-center">
              <Button onClick={handleReset}>Reset Filter</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomeMain;
