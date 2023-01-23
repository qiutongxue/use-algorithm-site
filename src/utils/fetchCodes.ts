import { dirname, extname } from "path";

let cache: Record<string, any[]> | null = null

export async function fetchCodes() {
    if (cache) return cache
    cache = {}
    const globs = import.meta.glob("/src/code/**/*.{js,ts}", { as: "raw" });

    for (const [path, promise] of Object.entries<() => Promise<string>>(globs)) {
        const code = await promise();
        const lang = extname(path).slice(1);
        const post = dirname(path).split("/").at(-1);

        if (!post) continue
        
        const codes = cache[post] || (cache[post] = [])
        codes.push({
            code,
            lang
        })        
    }
    return cache
}

