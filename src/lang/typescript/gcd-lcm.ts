export const gcd = (a: number, b: number) => (b === 0 ? a : gcd(b, a % b))

export const lcm = (a: number, b: number) => (a * b) / gcd(a, b)
