import { execSync } from 'node:child_process'
import path from 'node:path'

const transpiler = new Bun.Transpiler({ loader: 'ts' })

const glob = new Bun.Glob('src/lang/typescript/*.ts')

for (const file of glob.scanSync()) {
    const typescript = await Bun.file(file).text()
    const name = path.parse(file).name
    const javascript = transpiler.transformSync(typescript)
    await Bun.file(`src/lang/javascript/${name}.js`).write(javascript)
}

// 跑一下 biome
execSync('bunx biome format --write src/lang/javascript')

console.log('✅将 lang/typescript 编译为 lang/javaScript')
