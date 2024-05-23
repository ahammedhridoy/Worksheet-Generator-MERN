import React, { useEffect, useRef } from "react";

const MathJaxComponent = ({ htmlContent }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const renderMath = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([contentRef.current])
          .then(() => {
            console.log("MathJax typesetting complete.");
          })
          .catch((err) => console.error("MathJax typesetting failed: ", err));
      } else {
        console.error("MathJax not loaded");
      }
    };

    renderMath();
  }, [htmlContent]);

  return (
    <div
      ref={contentRef}
      dangerouslySetInnerHTML={{ __html: htmlContent.replace(/\\\\/g, "\\") }}
    ></div>
  );
};

export default MathJaxComponent;
