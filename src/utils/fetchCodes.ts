import { dirname, extname } from "path";

const priority = [
    "ts",
    "js",
    "rs",
    "java",
    "py",
    "go"
]

let cache: Record<string, any[]> | null = null
let mapper: Record<string, string> | null = null

export async function fetchCodes() {
    if (!cache) fetch()
    return cache
}

export async function fetchTitle() {
    if (!mapper) await fetch()
    return mapper
}

async function fetch() {
    cache = {}
    mapper = {}
    const globs = import.meta.glob("/src/code/**/*", { as: "raw" });

    for (const [path, promise] of Object.entries<() => Promise<string>>(globs)) {
        const code = await promise();
        const lang = extname(path).slice(1);
        const post = dirname(path).split("/").at(-1);
        if (!post || post === 'code') continue

        if (!lang) {
            const chName = path.split('/').at(-1) || post
            mapper[post] = chName
            continue
        }
        
        const codes = cache[post] || (cache[post] = [])
        codes.push({
            code,
            lang
        })        
    }



    for (const value of Object.values(cache)) {
        value.sort((a, b) => priority.indexOf(a.lang) - priority.indexOf(b.lang))
    }
}

