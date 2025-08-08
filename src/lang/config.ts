interface LanguageConfig {
	name: "js" | "ts" | "rs" | "go" | "java" | "cpp" | "cs";
	include: string[];
	exclude?: string[];
}

export const config = [
	{
		name: "js",
		include: ["./javascript/*.js"],
	},
	{
		name: "ts",
		include: ["./typescript/*.ts"],
	},
	{
		name: "rs",
		include: ["./rust/src/*.rs", "!./rust/src/lib.rs"],
	},
	{
		name: "java",
		include: ["./java/*.java"],
	},
	{
		name: "go",
		include: ["./go/*.go"],
	},
	{
		name: "cpp",
		include: ["./cpp/*.cpp"],
	},
	{
		name: "cs",
		include: ["./cs/*.cs"],
	},
] as const satisfies readonly LanguageConfig[];
