// Quill Editor
export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "bullet" }],
    ["clean"],
    ["math"],
    [{ script: "sub" }, { script: "super" }],
  ],
  clipboard: {
    matchVisual: true,
  },
};

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "formula",
  "clean",
  "math",
];
