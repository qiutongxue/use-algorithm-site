export function fastPow(a: number, n: number): number {
    const $ = BigInt
    const MOD = $(1e9 + 7)
    let b = $(a) % MOD
    let res = 1n
    while (n) {
        if (n % 2 === 1) res = (res * b) % MOD

        b = (b * b) % MOD
        n = Math.trunc(n / 2)
    }
    return Number(res % MOD)
}
