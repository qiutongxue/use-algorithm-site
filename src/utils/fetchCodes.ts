import { dirname, extname } from 'path'

interface CodeProps {
  chName: string
  enName: string
  codes: any[]
  keywords: string
}

const priority = ['ts', 'js', 'rs', 'java', 'py', 'go', 'cpp', 'c#', 'c']

const langMapper = {
  cs: 'c#',
}

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
  const globs = import.meta.glob(
    [
      '/src/code/**/*',
      '!/src/code/**/*.md',
    ],
    { as: 'raw' },
  )

  for (const [path, promise] of Object.entries<() => Promise<string>>(globs)) {
    const ext = extname(path).slice(1)
    const lang = langMapper[ext] || ext
    const post = dirname(path).split('/').at(-1)
    if (!post || post === 'code')
      continue
    const rawCode = await promise()

    const code = plugins.reduce((code, plugin) => plugin(code), rawCode)

    const obj = cache[post] || (cache[post] = {} as CodeProps)

    obj.enName ??= post
      .split('_')
      .map(word => word.at(0)?.toUpperCase() + word.slice(1))
      .join(' ')

    if (!lang) {
      const chName = path.split('/').at(-1) || obj.enName
      obj.chName ??= chName
      continue
    }

    const codes = obj.codes || (obj.codes = [])
    codes.push({
      code,
      lang,
    })
  }

  for (const [post, props] of Object.entries(cache)) {
    props.codes.sort(
      (a, b) => priority.indexOf(a.lang) - priority.indexOf(b.lang),
    )
    props.keywords = `${props.enName} ${props.chName} ${post} ${props.enName
      .split(' ')
      .map(s => s.at(0))
      .join('')}`.toLowerCase()
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
