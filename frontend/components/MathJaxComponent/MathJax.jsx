// /* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";

// const MathJax = ({ children }) => {
//   const [mathJaxReady, setMathJaxReady] = useState(false);

//   useEffect(() => {
//     if (window.MathJax) {
//       window.MathJax.startup.promise.then(() => {
//         setMathJaxReady(true);
//       });
//     } else {
//       console.error("MathJax is not loaded.");
//     }
//   }, []);

//   useEffect(() => {
//     if (mathJaxReady) {
//       window.MathJax.typesetPromise([document.body]).catch((err) =>
//         console.error(err)
//       );
//     }
//   }, [mathJaxReady, children]);

//   if (!mathJaxReady) {
//     return <div>Loading MathJax...</div>;
//   }

//   return <div>{children}</div>;
// };

// export default MathJax;
