pub struct Comb {
    fac: Vec<i64>,
    inv: Vec<i64>,
    modulo: i64,
    capacity: usize,
}

impl Comb {
    pub fn with_capacity(capacity: usize) -> Self {
        let modulo = (1e9) as i64 + 7;
        let mut fac = vec![0 as i64; capacity + 1];
        let mut inv = vec![0 as i64; capacity + 1];
        fac[0] = 1;
        inv[0] = 1;
        for i in 1..=capacity {
            fac[i] = (fac[i - 1] * i as i64) % modulo;
            inv[i] = Self::fast_pow(fac[i], modulo - 2, modulo);
        }
        Self {
            fac,
            inv,
            modulo,
            capacity,
        }
    }

    pub fn new() -> Self {
        let fac = vec![1];
        let inv = vec![1];
        let modulo = (1e9) as i64 + 7;
        Self {
            fac,
            inv,
            modulo,
            capacity: 0,
        }
    }

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

    pub fn comb(&mut self, n: usize, k: usize) -> i64 {
        assert!(n >= k);

        while self.capacity < n {
            let i = self.capacity + 1;
            self.fac.push((self.fac[i - 1] * i as i64) % self.modulo);
            self.inv
                .push(Self::fast_pow(self.fac[i], self.modulo - 2, self.modulo));
            self.capacity += 1;
        }

        return (self.fac[n] * self.inv[k] % self.modulo) * self.inv[n - k] % self.modulo;
    }
}