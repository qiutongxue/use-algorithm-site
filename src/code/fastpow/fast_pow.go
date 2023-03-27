func fastPow(a, n, m int64) int64 {
    b := a % m
    res := int64(1)
    for n > 0 {
        if n & 1 == 1 {
            res = (res * b) % m
        }
        b = b * b % m
        n = n / 2
    }
    return res % m
}