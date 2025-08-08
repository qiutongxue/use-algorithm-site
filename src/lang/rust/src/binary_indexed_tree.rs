pub struct BIT {
    n: usize,
    tree: Vec<i64>,
}

impl BIT {
    pub fn new(n: usize) -> Self {
        BIT {
            n,
            tree: vec![0; n + 1],
        }
    }

    pub fn add(&mut self, i: usize, x: i64) {
        let mut i = i + 1;
        while i <= self.n {
            self.tree[i] += x;
            i += i & i.wrapping_neg();
        }
    }

    pub fn query(&self, i: usize) -> i64 {
        let mut s = 0;
        let mut i = i + 1;
        while i > 0 {
            s += self.tree[i];
            i -= i & i.wrapping_neg();
        }
        s
    }
}
