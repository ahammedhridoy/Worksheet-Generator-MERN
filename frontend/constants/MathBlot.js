// // src/constants/MathBlot.js
// import Quill from "quill";

// const Embed = Quill.import("blots/block/embed");

// class MathBlot extends Embed {
//   static create(value) {
//     const node = super.create();
//     node.setAttribute("data-value", value);
//     node.classList.add("math");
//     node.innerHTML = value;
//     return node;
//   }

//   static value(node) {
//     return node.getAttribute("data-value");
//   }
// }

// MathBlot.blotName = "math";
// MathBlot.tagName = "span";
// MathBlot.className = "math";

// Quill.register(MathBlot);

// export default MathBlot;
