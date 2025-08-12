export const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
export const lcm = (a, b) => (a * b) / gcd(a, b)
