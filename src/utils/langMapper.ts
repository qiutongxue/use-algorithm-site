const mapper = {
    "ts": "TypeScript",
    "js": "JavaScript",
    "rs": "Rust",
    "py": "Python",
    "cpp": "C++",
}

export function langMapper(lang: string) {
    return mapper[lang] ?? `${lang[0].toUpperCase()}${lang.slice(1)}`
}