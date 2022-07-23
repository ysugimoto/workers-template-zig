import * as esbuild from "esbuild";
import * as path from "path";
import * as fs from "fs";

const dist = path.resolve("./worker");

const wasm = {
  name: 'wasm',
  setup(build) {
    build.onResolve({ filter: /\.wasm$/, namespace: "file" }, args => {
      const src = path.resolve(args.resolveDir, args.path);
      const dst = path.resolve(dist, args.path);
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst);
      return null;
    });
  }
};

(async () => {
  try {
    await esbuild.build({
      entryPoints: ["index.mjs"],
      bundle: true,
      format: "esm",
      outfile: path.join(dist, "index.mjs"),
      external: ["*.wasm"],
      plugins: [wasm],
    });
  } catch (err) {
    console.error(err);
  }
})();
