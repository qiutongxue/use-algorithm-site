pub fn use_comb(size: usize) -> impl Fn(usize, usize) -> i64 {
    let _mod = (1e9) as i64 + 7;

    let mut fac = vec![0 as i64; size + 1];
    let mut inv = vec![0 as i64; size + 1];
    fac[0] = 1;
    inv[0] = 1;

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

    for i in 1..=size {
        fac[i] = (fac[i - 1] * i as i64) % _mod;
        inv[i] = fast_pow(fac[i], _mod - 2, _mod);
    }

    let comb = move |n: usize, k: usize| -> i64 {
        return (fac[n] * inv[k] % _mod) * inv[n - k] % _mod;
    };

    return comb;
}
