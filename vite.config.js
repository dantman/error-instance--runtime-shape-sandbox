import { defineConfig } from "vite-plus";

export default defineConfig({
  // Build the browser sandbox
  build: {
    outDir: "dist/sandbox",
    // Avoid minification to make outputs easier to read, but attempt to transpile
    // as far back as we can go without breaking ESM or modern JavaScript syntax
    minify: false,
    target: "es2017",
    sourcemap: true,
    rollupOptions: {
      output: {
        compact: false,
      },
    },
  },
  // Pack a library output if needed
  pack: {
    outDir: "dist/lib",
    entry: ["analyze.js"],
    format: ["esm"],
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
