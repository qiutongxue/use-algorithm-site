import { dirname, extname } from "path";

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
}

