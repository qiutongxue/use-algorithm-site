fn fast_pow(a: i64, mut n: i64, m: i64) -> i64 {
    let mut b = a % m;
    let mut res = 1;
    while n > 0 {
        if n & 1 == 1 {
            res = (res * b) % m;
        }
        b = (b * b) % m;
        n = n / 2;
    }
    return res % m;
}