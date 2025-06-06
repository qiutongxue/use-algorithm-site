// const MOD: i64 = 1e9 as i64 + 7;

fn matrix_mul<T: Into<i64> + Copy, const M: usize, const N: usize, const P: usize>(
    a: &[[T; P]; M],
    b: &[[T; N]; P],
) -> [[i64; N]; M] {
    let mut res = [[0; N]; M];
    for i in 0..M {
        for j in 0..N {
            for k in 0..P {
                res[i][j] = (res[i][j] + a[i][k].into() * b[k][j].into() % MOD) % MOD;
            }
        }
    }
    res
}

fn matrix_fast_pow<const N: usize>(mut m: [[i64; N]; N], mut t: i64) -> [[i64; N]; N] {
    let mut res = [[0; N]; N];
    // 初始化为单位矩阵
    for i in 0..N {
        res[i][i] = 1;
    }

    while t != 0 {
        if t & 1 == 1 {
            res = matrix_mul(&res, &m);
        }
        m = matrix_mul(&m, &m);
        t >>= 1;
    }
    res
}
