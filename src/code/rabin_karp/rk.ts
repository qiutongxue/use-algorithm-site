function useStrHash(s: string, b = 1337, mod = 1e9 + 7) {
  const n = s.length
  const $ = BigInt
  const bb: number[] = new Array(n + 1).fill(0)
  const h: number[] = new Array(n + 1).fill(0)
  bb[0] = 1
  for (let i = 0; i < n; i++) {
    const val = s[i].charCodeAt(0)
    bb[i + 1] = bb[i] * b % mod
    h[i + 1] = (h[i] * b + val) % mod
  }

  // [l, r) 包含 l 不包含 r
  return (l: number, r: number) => {
    if (h[l] * bb[r - l] > Number.MAX_SAFE_INTEGER)
      return (Number($(h[r]) - ($(h[l]) * $(bb[r - l])) % $(mod)) + mod) % mod

    return (h[r] - (h[l] * bb[r - l] % mod) + mod) % mod
  }
}
