export function useComb(size: number) {
    const MOD = 1e9 + 7
    const $ = BigInt

    const fac: number[] = new Array(size + 1).fill(0) // 阶乘
    const inv: number[] = new Array(size + 1).fill(0) // fac[i]的乘法逆元
    fac[0] = inv[0] = 1

    function fastPow(a: number, n: number): number {
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

    for (let i = 1; i <= size; i++) {
        fac[i] = (fac[i - 1] * i) % MOD
        inv[i] = fastPow(fac[i], MOD - 2)
    }

    function comb(n: number, k: number): number {
        return Number(
            ((($(fac[n]) * $(inv[k])) % $(MOD)) * $(inv[n - k])) % $(MOD),
        )
    }

    return comb
}
