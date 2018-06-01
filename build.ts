import * as gulp from "gulp";
import { Service, Arc, project, logLn } from "@wasm/studio-utils";

gulp.task("build", async () => {
    const options = { debug: true, cargo: true };
    const data = await Service.compileFiles([
        project.getFile("src/lib.rs"),
        project.getFile("src/arc_module.rs"),
        project.getFile("src/color.rs"),
        project.getFile("src/utils.rs"),
        project.getFile("Cargo.toml")            
    ], "rust", "wasm", options);
    const outWasm = project.newFile("out/lib.wasm", "wasm", true);
    outWasm.setData(data["a.wasm"]);
});

gulp.task("publish", async () => {
    const rows = 44, cols = 36, frameCount = 50, fps = 35;
    const { transform } = await (await Service.import('src/module.js')).default();
    const buffer = new ArrayBuffer(cols * rows * frameCount * 3);
    try {
      transform(buffer, rows, cols, frameCount, fps, true);
    } catch (e) {
      logLn("Running the module caused a panic: " + e);
      logLn(e.stack);
      return;
    }
    const animation = Arc.animationBufferToJSON(buffer, rows, cols, frameCount);

    const jsModule = project.getFile("src/module.js").getData();
    const rsSource = project.getFile("src/lib.rs").getData();
    const wasmModule = project.getFile("out/lib.wasm").getData();
    Arc.publish({
        description: "WASM Module Example",
        author: "",
        animation: {
            rows,
            cols,
            frameCount,
            fps,
            data: animation,
        },
        entry: "src/module.js",
        files: {
            "src/module.js": jsModule,
            "src/lib.rs": rsSource,
            "out/lib.wasm": wasmModule,
        }
    });
    logLn("Rust Module was published.")
});

gulp.task("default", ["build"], async () => {});
