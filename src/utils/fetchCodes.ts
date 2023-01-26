import { dirname, extname } from "path";

interface CodeProps {
    chName: string
    enName: string
    codes: any[]
    keywords: string
}

const priority = [
    "ts",
    "js",
    "rs",
    "java",
    "py",
    "go",
    "cpp",
    "c#",
    "c",
]

const langMapper = {
    'cs': 'c#'
}

let cache: Record<string, CodeProps> | null = null

export async function fetchCodes() {
    if (!cache) await fetch()
    return cache
}

async function fetch() {
    cache = {}
    const globs = import.meta.glob("/src/code/**/*", { as: "raw" });

    for (const [path, promise] of Object.entries<() => Promise<string>>(globs)) {
        const code = await promise();
        let lang = extname(path).slice(1);
        lang = langMapper[lang] || lang
        const post = dirname(path).split("/").at(-1);
        if (!post || post === 'code') continue

        const obj = cache[post] || (cache[post] = {} as CodeProps)

        obj.enName ??= post.split('_').map(word => word.at(0)?.toUpperCase() + word.slice(1)).join(' ')

        if (!lang) {
            const chName = path.split('/').at(-1) || obj.enName
            obj.chName ??= chName
            continue
        }
        
        const codes = obj.codes || (obj.codes = [])
        codes.push({
            code,
            lang
        })        
    }

    for (const [post, props] of Object.entries(cache)) {
        props.codes.sort((a, b) => priority.indexOf(a.lang) - priority.indexOf(b.lang))
        props.keywords = `${props.enName} ${props.chName} ${post} ${props.enName.split(' ').map(s => s.at(0)).join('')}`.toLowerCase()
    }
}

