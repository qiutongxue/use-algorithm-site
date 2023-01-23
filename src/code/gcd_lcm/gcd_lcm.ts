const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)

const lcm = (a: number, b: number) => a * b / gcd(a, b)