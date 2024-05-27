// MathJaxContext.js
import { createContext, useEffect, useRef } from "react";

export const MathJaxContext = createContext();

const MathJaxProvider = ({ children }) => {
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
  }, [children]);

  return <div ref={contentRef}>{children}</div>;
};

export default MathJaxProvider;
