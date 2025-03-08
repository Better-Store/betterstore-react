import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import tailwindcss from "tailwindcss";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/index.mjs",
      format: "esm",
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      plugins: [tailwindcss(), autoprefixer()],
      extract: "styles.css",
      extract: false,
      modules: false,
      minimize: true,
      inject: true,
      autoModules: false,
    }),
  ],
  external: [
    "react",
    "react-dom",
    "@stripe/react-stripe-js",
    "@stripe/stripe-js",
    "zustand",
  ],
};
