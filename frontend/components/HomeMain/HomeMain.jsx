import { saveAs } from "file-saver";
import { useContext, useState } from "react";
import { QuestionContext } from "./../../context/questionContext"; // Assuming the path is correct
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
} from "docx";
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

  const latexToBase64 = async (equation) => {
    try {
      // Render LaTeX to SVG and get the Base64 string
      const base64String = await latexToSVG(equation);

      return base64String;
    } catch (error) {
      console.error("Error converting LaTeX to Base64:", error);
      throw error;
    }
  };

  const latexToSVG = (equation) => {
    try {
      // Render LaTeX to HTML using KaTeX
      const html = katex.renderToString(equation, {
        throwOnError: false,
        displayMode: true,
      });

      // Extract the <math> element from the HTML
      const div = document.createElement("div");
      div.innerHTML = html;
      const mathElement = div.querySelector(".katex-mathml > math");

      if (!mathElement) {
        console.error("Failed to extract MathML content.");
        return Promise.reject(new Error("Failed to extract MathML content."));
      }

      // Serialize the MathML content
      const serializer = new XMLSerializer();
      const mathmlString = serializer.serializeToString(mathElement);

      // Convert MathML string to SVG format
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${mathmlString}
            </div>
          </foreignObject>
        </svg>
      `;

      // Log SVG content for debugging

      // Create a new image element
      const img = new Image();
      const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        svgString
      )}`;

      // Set the image source to the SVG URL
      img.src = svgUrl;

      // Return a promise that resolves with the Base64 string
      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Create a canvas element
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas dimensions to match the image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Convert the canvas to a Base64 string
          const base64 = canvas.toDataURL("image/png").split(",")[1];
          resolve(base64);
        };

        img.onerror = (error) => {
          console.error("Failed to load SVG image", error);
          reject(new Error("Failed to load SVG image"));
        };
      });
    } catch (error) {
      console.error("Error converting LaTeX to SVG:", error);
      return Promise.reject(error);
    }
  };

  // Generate the document
  const generateDocument = async () => {
    const selectedQuestions = questions.filter((q) => q.selected);

    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question.");
      return;
    }

    let questionData = [];
    let question_equationData = [];
    let answerData = [];
    let answer_equationData = [];
    let solutionData = [];
    let solution_equationData = [];

    for (const [index, question] of selectedQuestions.entries()) {
      console.log("question: ", question.question);

      const processedQuestion = extractLatex(question.question);
      const processedQuestionEquation = extractLatex(
        question.question_equation
      );
      const processedAnswer = extractLatex(question.answer);
      const processedAnswerEquation = extractLatex(question.answer_equation);
      const processedSolution = extractLatex(question.solution);
      const processedSolutionEquation = extractLatex(
        question.solution_equation
      );

      console.log("processedEquation: ", processedQuestionEquation);

      // Convert MathML in each section to base64 and HTML to RTF
      const questionRTF = await htmlToRtfFunction(processedQuestion);
      const processedQuestionEquationRTF = await htmlToRtfFunction(
        processedQuestionEquation
      );
      const processedAnswerEquationRTF = await htmlToRtfFunction(
        processedAnswerEquation
      );
      const processedSolutionEquationRTF = await htmlToRtfFunction(
        processedSolutionEquation
      );
      const answerRTF = await htmlToRtfFunction(processedAnswer);
      const solutionRTF = await htmlToRtfFunction(processedSolution);

      console.log("equationRTF: ", processedQuestionEquationRTF);

      const questionSvg = await latexToBase64(processedQuestionEquationRTF);
      const answerSvg = await latexToBase64(processedAnswerEquationRTF);
      const solutionSvg = await latexToBase64(processedSolutionEquationRTF);

      console.log("svg: ", questionSvg);

      // Push data for each section
      questionData.push(questionRTF);
      question_equationData.push(questionSvg);
      answer_equationData.push(answerSvg);
      solution_equationData.push(solutionSvg);
      answerData.push(answerRTF);
      solutionData.push(solutionRTF);

      console.log("questionData: ", questionData);
    }

    // Create paragraphs for manual data section
    const manualDataParagraphs = [
      new Paragraph({
        text: `Example School`,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 500,
        },
      }),
    ];

    // Create paragraphs for dynamic data section
    const dynamicDataParagraphs = selectedQuestions.flatMap(
      (question, index) => [
        new Paragraph({
          text: `Question ${index + 1}:`,
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 50,
          },
        }),
        new Paragraph({
          text: `${questionData[index]}`,
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            after: 100,
          },
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: Uint8Array.from(atob(question_equationData[index]), (c) =>
                c.charCodeAt(0)
              ),
              transformation: {
                width: 200,
                height: 100,
              },
              spacing: {
                after: 200,
              },
            }),
          ],
        }),
        new Paragraph({
          text: `Answer ${index + 1}:`,
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 50,
          },
        }),
        new Paragraph({
          text: `${answerData[index]}`,
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            after: 100,
          },
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: Uint8Array.from(atob(answer_equationData[index]), (c) =>
                c.charCodeAt(0)
              ),
              transformation: {
                width: 200,
                height: 100,
              },
              spacing: {
                after: 200,
              },
            }),
          ],
        }),
        new Paragraph({
          text: `Solution ${index + 1}:`,
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 50,
          },
        }),
        new Paragraph({
          text: `${solutionData[index]}`,
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            after: 100,
          },
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: Uint8Array.from(atob(solution_equationData[index]), (c) =>
                c.charCodeAt(0)
              ),
              transformation: {
                width: 200,
                height: 100,
              },
              spacing: {
                after: 200,
              },
            }),
          ],
        }),
        new Paragraph({
          text: `______________________________`,
          spacing: {
            after: 200,
          },
        }),
      ]
    );

    // Combine both manual and dynamic data paragraphs
    const allDataParagraphs = manualDataParagraphs.concat(
      dynamicDataParagraphs
    );

    // Create the document with all data paragraphs in one section
    const doc = new Document({
      sections: [
        {
          children: allDataParagraphs,
        },
      ],
    });

    // Generate document and handle errors
    Packer.toBlob(doc)
      .then((blob) => {
        saveAs(blob, "example.docx");
      })
      .catch((error) => {
        console.error("Error generating document:", error);
      });
  };

  // Extract LaTeX from HTML
  const extractLatex = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const spans = div.querySelectorAll("span.ql-formula");

    spans.forEach((span) => {
      const latex = span.getAttribute("data-value");
      // Replace the span with its LaTeX content
      span.outerHTML = latex;
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

                          <AlertDescription
                            className="answer-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.question : "",
                            }}
                          ></AlertDescription>

                          <AlertDescription
                            className="answer-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.question_equation : "",
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

                                <AlertDescription
                                  className="answer-text"
                                  dangerouslySetInnerHTML={{
                                    __html: q ? q.answer_equation : "",
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

                                <AlertDescription
                                  className="solution-text"
                                  dangerouslySetInnerHTML={{
                                    __html: q ? q.solution_equation : "",
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

                          <AlertDescription
                            className="answer-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.question : "",
                            }}
                          ></AlertDescription>

                          <AlertDescription
                            className="answer-text"
                            dangerouslySetInnerHTML={{
                              __html: q ? q.question_equation : "",
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

                                <AlertDescription
                                  className="answer-text"
                                  dangerouslySetInnerHTML={{
                                    __html: q ? q.answer_equation : "",
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

                                <AlertDescription
                                  className="solution-text"
                                  dangerouslySetInnerHTML={{
                                    __html: q ? q.solution_equation : "",
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
