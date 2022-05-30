import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default [
  // nodejs & browsers
  {
    input: "src/index.js",
    indent: "\t",
    output: {
      name: "DOMTexture",
      file: pkg.main,
      format: "umd",
      globals: {
        three: "THREE"
      }
    },
    plugins: []
  },
  // browsers min
  {
    input: "src/index.js",
    indent: "\t",
    output: {
      name: "DOMTexture",
      file: pkg.browser,
      format: "umd",
      globals: {
        three: "THREE"
      }
    },
    plugins: [terser()]
  }
];
