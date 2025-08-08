import path from 'path'

const transpiler = new Bun.Transpiler({"loader": "ts"})

const glob = new Bun.Glob("src/lang/typescript/*.ts")

for (const file of glob.scanSync()) {
    const typescript = await Bun.file(file).text()
    const name = path.parse(file).name
    const javascript = transpiler.transformSync(typescript)
    await Bun.file(`src/lang/javascript/${name}.js`).write(javascript)
}

console.log("✅将 lang/typescript 编译为 lang/javaScript");