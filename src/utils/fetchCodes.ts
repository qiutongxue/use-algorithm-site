import fs from 'node:fs'
import path from 'node:path'
import fastGlob from 'fast-glob'

const { globSync } = fastGlob

interface CodeProps {
    codes: any[]
    chName: string
    enName: string
    keywords: string[]
}

const priority = [
    'ts',
    'js',
    'rs',
    'java',
    'py',
    'go',
    'cpp',
    'cs',
    'c',
] as const

let cache: Record<string, CodeProps> | null = null

export async function fetchCodes() {
    if (!cache) await fetch()
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
        const globs = globSync(include, { cwd: 'src/lang', absolute: true })
        for (const file of globs) {
            // 读取文件
            const rawCode = await fs.promises.readFile(file, {
                encoding: 'utf-8',
            })
            const code = plugins.reduce((code, plugin) => plugin(code), rawCode)

            // 提取文件名
            let fileName = path.parse(file).name
            // 转成统一的键
            fileName = toSnakeCase(fileName)

            cache[fileName] ??= {} as CodeProps
            const algoObj = cache[fileName]

            algoObj.codes ??= []
            algoObj.codes.push({
                lang,
                code,
            })
        }
    }

    for (const { codes } of Object.values(cache)) {
        codes.sort(
            (a, b) => priority.indexOf(a.lang) - priority.indexOf(b.lang),
        )
    }
}

const DELETE_START_REGEX = /DELETE:\s?START/
const DELETE_END_REGEX = /DELETE:\s?END/

function removeHiddens(code: string) {
    const lines = code.split('\r\n')
    const newLines: string[] = []
    for (let i = 0; i < lines.length; i++) {
        if (DELETE_START_REGEX.test(lines[i])) {
            let j = i + 1
            while (j < lines.length && !DELETE_END_REGEX.test(lines[j])) j++
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
    return code.replace(/^\t+/gm, (str: string) =>
        ' '.repeat(spaceCount * str.length),
    )
}

function toSnakeCase(str: string) {
    return (
        str
            // 处理 PascalCase / camelCase -> 在大写字母前加空格
            .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
            // 处理连字符和空格为下划线
            .replace(/[-\s]+/g, '_')
            // 处理多重下划线 -> 单个下划线
            .replace(/_+/g, '_')
            // 去掉首尾下划线
            .replace(/^_+|_+$/g, '')
            // 全部转小写
            .toLowerCase()
    )
}
