function primesIn(n: number): number[] {
  const vis: boolean[] = new Array(n + 1).fill(false)
  const primes: number[] = []
  for (let i = 2; i <= n; i++) {
    if (vis[i])
      continue
    primes.push(i)
    for (let j = i * i; j <= n; j += i)
      vis[j] = true
  }
  return primes
}
