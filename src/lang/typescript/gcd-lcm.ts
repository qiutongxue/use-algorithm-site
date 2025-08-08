const gcd = (a: number, b: number) => (b === 0 ? a : gcd(b, a % b));

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
