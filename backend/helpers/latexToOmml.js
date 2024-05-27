// const mjAPI = require("mathjax-node");
// const { create } = require("xmlbuilder");

// mjAPI.config({
//   MathJax: {
//     // traditional MathJax configuration
//   },
// });
// mjAPI.start();

// const latexToOmml = (latex) => {
//   return new Promise((resolve, reject) => {
//     mjAPI.typeset(
//       {
//         math: latex,
//         format: "TeX",
//         mml: true,
//       },
//       function (data) {
//         if (data.errors) {
//           reject(data.errors);
//         } else {
//           const omml = mmlToOmml(data.mml);
//           resolve(omml);
//         }
//       }
//     );
//   });
// };

// const mmlToOmml = (mml) => {
//   // Convert MathML to OMML using xmlbuilder or similar
//   const omml = create("math")
//     .ele("oMath")
//     .ele("r")
//     .ele("t", mml)
//     .end({ pretty: true });
//   return omml;
// };

// module.exports = { latexToOmml };
