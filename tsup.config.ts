// tsup.config.ts
import type { Options } from "tsup";
// import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
export const tsup: Options = {
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  // esbuildPlugins: [
  //   esbuildCommonjs([
  //     "extract-comments",
  //     "babel-extract-comments",
  //     "espree-extract-comments",
  //     "gulp-format-md",
  //     "mocha",
  //     "time-diff",
  //     "esprima-extract-comments",
  //     "parse-code-context",
  //   ]),
  // ],
};
