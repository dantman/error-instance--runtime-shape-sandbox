# Error-instance runtime shape sandbox

This repository is a sandbox used to inspect the shape of an Error instance in any given runtime.

The main implementation can be found at [analyze.js](./analyze.js). This is where we analyze the shape of an Error instance, including its own properties, prototype properties, and stack trace formatting.

There are 3 ways you can view the error information produced by analyze.js all built with Vite by `pnpm build`.

1. A HTML sandbox in `dist/sandbox/`, where the results of analyze.js are displayed in a readonly textarea you can copy. Useful for inspecting the error information of a browser runtime.
2. The ECMAScript module in `dist/lib/` can be run in other JavaScript runtimes to display the error information to the console.
3. The ECMAScript module also exports a `errorInfo` const containing the analyzed error information. You can use this in runtimes like a serverless function where you need to return a response from a handler function.

To develop `pnpm watch` will run the development server, pack in watch mode, build in watch mode, and execute the ECMAScript module from `dist/lib/` in Node.js when changes are detected.

## Running known runtimes

After you use `pnpm build`, the following known runtimes can be run:

```bash
# Node.js
node dist/lib/analyze.mjs
# Deno
docker run --rm -v "$PWD/dist:/mnt/dist" denoland/deno deno /mnt/dist/lib/analyze.mjs
# Bun
docker run --rm -v "$PWD/dist:/mnt/dist" oven/bun /mnt/dist/lib/analyze.mjs
# Cloudflare Workers
cd examples/cloudflare; pnpm install && pnpm dev # Use [b] to open a browser and see the output
# Convex
cd examples/convex; pnpm install && pnpm start # Run the Convex example
```
