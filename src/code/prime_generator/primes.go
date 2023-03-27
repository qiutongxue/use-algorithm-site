func primesIn(n int) []int {
    primes := []int{}
    vis := make([]bool, n + 1)
    for i := 2; i < n; i++ {
        if vis[i] {
            continue
        }
        primes = append(primes, i)
        for j := i * i; j <= n; j += i {
            vis[j] = true
        }
    }
    return primes
}