import uglify from "rollup-plugin-uglify";
import pkg from "./package.json";

const keyword = function() {
  return {
    transform(code, id) {
      if (/\.js$/.test(id) === false) return;

      return {
        code: code.replace(/let /g, "var ").replace(/const /g, "var ")
      };
    }
  };
};

const common = {
  input: "src/index.js",
  indent: "\t",
  external: ["three"],
  globals: {
    three: "THREE"
  }
};

export default [
  // nodejs & browsers
  {
    ...common,
    output: {
      name: "DOMTexture",
      file: pkg.main,
      format: "umd"
    },
    plugins: [keyword()]
  },
  // browsers min
  {
    ...common,
    output: {
      name: "DOMTexture",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [keyword(), uglify()]
  },
  // mjs
  {
    ...common,
    output: {
      name: "DOMTexture",
      file: pkg.module,
      format: "es"
    },
    plugins: [keyword()]
  }
];
