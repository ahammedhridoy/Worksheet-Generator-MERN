import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import { useContext, useState } from "react";
import { QuestionContext } from "./../../context/questionContext"; // Assuming the path is correct
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import katex from "katex";
window.katex = katex;
import "katex/dist/katex.min.css";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

const HomeMain = () => {
  const [visible, setVisible] = useState(10);

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

  const generateDocument = async () => {
    const selectedQuestions = questions.filter((q) => q.selected);

    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question.");
      return;
    }

    loadFile("/template.docx", async (error, content) => {
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

      for (const [index, question] of selectedQuestions.entries()) {
        console.log("question: ", question.question);

        const processedQuestion = extractLatexAndConvertToMathML(
          question.question
        );
        const processedAnswer = extractLatexAndConvertToMathML(question.answer);
        const processedSolution = extractLatexAndConvertToMathML(
          question.solution
        );
        console.log("processedQuestion: ", processedQuestion);

        data[`question${index + 1}_title`] = `Question: ${index + 1}`;
        data[`answer${index + 1}_title`] = `Answer: ${index + 1}`;
        data[`solution${index + 1}_title`] = `Solution: ${index + 1}`;
        data[`horizontal${index + 1}_line`] =
          "________________________________________________";

        data[`question${index + 1}`] = htmlToRtfFunction(processedQuestion);
        data[`answer${index + 1}`] = htmlToRtfFunction(processedAnswer);
        data[`solution${index + 1}`] = htmlToRtfFunction(processedSolution);

        questionData += `Question ${index + 1}: ${htmlToRtfFunction(
          processedQuestion
        )}\n`;
        questionData += `Answer ${index + 1}: ${htmlToRtfFunction(
          processedAnswer
        )}\n`;
        questionData += `Solution ${index + 1}: ${htmlToRtfFunction(
          processedSolution
        )}\n`;
      }

      const remainingPlaceholders = 100 - selectedQuestions.length;
      for (
        let i = selectedQuestions.length + 1;
        i <= selectedQuestions.length + remainingPlaceholders;
        i++
      ) {
        data[`question${i}_title`] = "";
        data[`answer${i}_title`] = "";
        data[`solution${i}_title`] = "";
        data[`horizontal${i}_line`] = "";
        data[`question${i}`] = "";
        data[`answer${i}`] = "";
        data[`solution${i}`] = "";
      }

      questionData = questionData.trimEnd();
      data["questions"] = questionData;

      doc.setData(data);
      doc.render();

      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, "output.docx");
    });
  };

  const extractLatexAndConvertToMathML = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const spans = div.querySelectorAll("span.ql-formula");
    // console.log(spans);

    spans.forEach((span) => {
      const latex = span.getAttribute("data-value");
      const mathml = katex.renderToString(latex, {
        output: "mathml",
        throwOnError: false,
      });
      const mathmlz = mathml
        .replace(/<span class="katex">/g, "")
        .replace(/<\/span>/g, "");
      // Replace the span with its inner HTML content (the MathML)
      span.outerHTML = mathmlz;
    });

    // Return the innerHTML of the div after replacement, excluding the outer span
    return div.innerHTML;
  };

  const htmlToRtfFunction = (html) => {
    const processedHtml = html
      .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
      .replace(/&#(\d+);/g, (match, charCode) => String.fromCharCode(charCode)); // Decode HTML entities

    // Replace specific HTML tags with their RTF equivalents, excluding <math> tags
    const rtf = processedHtml
      .replace(/<b>/g, "{\\b ") // Bold start tag
      .replace(/<\/b>/g, "\\b0}") // Bold end tag
      .replace(/<p>/g, "\n") // Paragraph start tag
      .replace(/<\/p>/g, "\n") // Paragraph end tag
      .replace(/<blockquote>/g, "\n") // blockquote start tag
      .replace(/<\/blockquote>/g, "\n") // blockquote end tag
      .replace(/<strong>/g, "") //
      .replace(/<\/strong>/g, "") //
      .replace(/<ul>/g, "") //
      .replace(/<\/ul>/g, "") //
      .replace(/<em>/g, "") //
      .replace(/<\/em>/g, "") //
      .replace(/<s>/g, "") //
      .replace(/<\/s>/g, "") //
      .replace(/<u>/g, "") //
      .replace(/<\/u>/g, "") //
      .replace(/<h[1-6]>/g, "\n") // h1-h6 start tags
      .replace(/<\/h[1-6]>/g, "\n") // h1-h6 end tags
      .replace(/<br\s*\/?>/g, "\n") // Replace <br> with RTF line break
      .replace(
        /<li[^>]*>(.*?)<\/li>/g,
        (match, content) => `\n• ${content.trim()}\n`
      ) // List item tag with a line break
      .replace(/\n\s*\n/g, "\n") // Replace multiple consecutive newlines with a single newline
      .replace(/<math[^>]*>.*?<\/math>/g, (match) => match); // Exclude <math> tags from replacement

    return rtf;
  };

  const selectedCount = questions.filter((q) => q.selected).length;

  // Function to load more posts
  const loadMore = () => {
    setVisible((prevVisible) => prevVisible + 10);
  };

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
                  {filteredQuestions.slice(0, visible).map((q, index) => (
                    <div className="mb-4" key={index}>
                      <Alert>
                        <div className="flex items-center my-4 space-x-2 q-check text-end">
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
                        <div className="mb-4 question-div">
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

                        <hr className="my-3" />
                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1">
                            <AccordionTrigger>
                              <AlertTitle className="text-2xl">
                                Answer:
                              </AlertTitle>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="mb-4 answer-div">
                                <AlertDescription
                                  className="answer-text"
                                  dangerouslySetInnerHTML={{
                                    __html: q ? q.answer : "",
                                  }}
                                ></AlertDescription>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1">
                            <AccordionTrigger>
                              <AlertTitle className="text-2xl">
                                Solution:
                              </AlertTitle>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="my-3 solution-div">
                                <AlertDescription
                                  className="solution-text"
                                  dangerouslySetInnerHTML={{
                                    __html: q ? q.solution : "",
                                  }}
                                ></AlertDescription>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
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
                  {questions.slice(0, visible).map((q, index) => (
                    <div className="mb-4" key={index}>
                      <Alert>
                        <div className="flex items-center my-4 space-x-2 q-check text-end">
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
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                          >
                            Select Question
                          </label>
                        </div>
                        <div className="mb-4 question-div">
                          <AlertTitle className="text-2xl">
                            Question:
                          </AlertTitle>
                          <img
                            className="w-[400px]"
                            src={`${imageUrl}/${q?.image}`}
                            alt=""
                          />
                          {/* <AlertDescription>
                            <MathJaxComponent htmlContent={q?.question} />
                          </AlertDescription> */}
                          <AlertDescription
                            className="answer-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.question : "",
                            }}
                          ></AlertDescription>
                        </div>
                        <hr className="my-3" />
                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1">
                            <AccordionTrigger>
                              <AlertTitle className="text-2xl ">
                                Answer:
                              </AlertTitle>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="mb-4 answer-div">
                                <AlertDescription
                                  className="answer-text"
                                  dangerouslySetInnerHTML={{
                                    __html: q ? q.answer : "",
                                  }}
                                ></AlertDescription>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                          <AccordionItem value="item-1">
                            <AccordionTrigger>
                              <AlertTitle className="text-2xl">
                                Solution:
                              </AlertTitle>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="my-3 solution-div">
                                <AlertDescription
                                  className="solution-text"
                                  dangerouslySetInnerHTML={{
                                    __html: q ? q.solution : "",
                                  }}
                                ></AlertDescription>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
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
          {questions.length > visible || filteredQuestions.length > visible ? (
            <div className="mt-4 text-center">
              <Button onClick={loadMore}>Load More</Button>
            </div>
          ) : (
            <div className="mt-4 text-2xl font-semibold text-center">
              No More Questions Found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomeMain;
