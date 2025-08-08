import path from 'path'
import fastGlob from 'fast-glob'
import fs from 'fs'

const { globSync } = fastGlob

interface CodeProps {
  codes: any[]
  chName: string
  enName: string
  keywords: string[]
}

const priority = ['ts', 'js', 'rs', 'java', 'py', 'go', 'cpp', 'cs', 'c'] as const

let cache: Record<string, CodeProps> | null = null

export async function fetchCodes() {
  if (!cache)
    await fetch()
  return cache
}

const plugins: ((code: string) => string)[] = []

export function addPlugin(plugin: (code: string) => string) {
  plugins.push(plugin)
}

addPlugin((code: string) => convertTabToSpace(code, 4))
addPlugin(removeHiddens)

async function fetch() {
  cache = {}
  const { config } = await import('../lang/config')
  for (const { name: lang, include } of config) {
    const globs = globSync(include, { cwd: "src/lang", absolute: true })
    for (const file of globs) {
      // 读取文件
      const rawCode = await fs.promises.readFile(file, { encoding: "utf-8" })
      const code = plugins.reduce((code, plugin) => plugin(code), rawCode)

      // 提取文件名
      let fileName = path.parse(file).name
      // 转成统一的键
      fileName = toSnakeCase(fileName)
      const algoObj = cache[fileName] || (cache[fileName] = {} as CodeProps)

      const codes = algoObj.codes || (algoObj.codes = [])
      codes.push({
        lang,
        code
      })

    }
  }
  // const globs = import.meta.glob(
  //   [
  //     '/src/code/**/*',
  //     '!/src/code/**/*.md',
  //   ],
  //   { as: 'raw' },
  // )

  // for (const [path, promise] of Object.entries<() => Promise<string>>(globs)) {
  //   const ext = extname(path).slice(1)
  //   const lang = ext
  //   const post = dirname(path).split('/').at(-1)
  //   if (!post || post === 'code')
  //     continue
  //   const rawCode = await promise()

  //   const code = plugins.reduce((code, plugin) => plugin(code), rawCode)

  //   const obj = cache[post] || (cache[post] = {} as CodeProps)

  //   obj.enName ??= post
  //     .split('_')
  //     .map(word => word.at(0)?.toUpperCase() + word.slice(1))
  //     .join(' ')

  //   if (!lang) {
  //     const chName = path.split('/').at(-1) || obj.enName
  //     obj.chName ??= chName
  //     continue
  //   }

  //   const codes = obj.codes || (obj.codes = [])
  //   codes.push({
  //     code,
  //     lang,
  //   })
  // }

  for (const { codes } of Object.values(cache)) {
    codes.sort(
      (a, b) => priority.indexOf(a.lang) - priority.indexOf(b.lang),
    )
  }
}

function removeHiddens(code: string) {
  const lines = code.split('\r\n')
  const newLines: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('--{{begin}}--')) {
      let j = i + 1
      while (j < lines.length && !lines[j].includes('--{{end}}--')) j++
      if (j < lines.length) {
        i = j
        continue
      }
    }
    newLines.push(lines[i])
  }
  return newLines.join('\r\n')
}

function convertTabToSpace(code: string, spaceCount = 4) {
  return code.replace(/^\t+/gm, (str: string) => ' '.repeat(spaceCount * str.length))
}

function toSnakeCase(str: string) {
  return str
    // 处理 PascalCase / camelCase -> 在大写字母前加空格
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    // 处理连字符和空格为下划线
    .replace(/[-\s]+/g, '_')
    // 处理多重下划线 -> 单个下划线
    .replace(/_+/g, '_')
    // 去掉首尾下划线
    .replace(/^_+|_+$/g, '')
    // 全部转小写
    .toLowerCase();
}