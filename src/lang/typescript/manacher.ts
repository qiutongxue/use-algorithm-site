export function useManacher(s: string) {
    const char = new Array(s.length * 2 + 1)
    const n = char.length
    let i = 1
    char[0] = '#'
    for (const ch of s) {
        char[i++] = ch
        char[i++] = '#'
    }
    const dp: number[] = new Array(n).fill(0)
    for (let i = 0, l = 0, r = -1; i < n; i++) {
        let k = i > r ? 1 : Math.min(dp[l + r - i], r - i + 1)
        while (i - k >= 0 && i + k < n && char[i - k] === char[i + k]) k++

        dp[i] = k--

        if (i + k > r) {
            r = i + k
            l = i - k
        }
    }

    return dp
}
