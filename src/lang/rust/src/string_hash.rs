use std::ops::{Bound, RangeBounds};

pub struct StrHash {
    hash: Vec<u64>,
    pow: Vec<u64>,
}

impl StrHash {
    const MOD: u64 = 1e9 as u64 + 7;
    const BASE: u64 = 1337;

    pub fn from_str(s: &str) -> Self {
        let s = s.as_bytes();
        let n = s.len();
        let mut hash = vec![0; n + 1];
        let mut pow = vec![0; n + 1];
        pow[0] = 1;
        for i in 0..n {
            hash[i + 1] = (hash[i] * Self::BASE + s[i] as u64) % Self::MOD;
            pow[i + 1] = pow[i] * Self::BASE % Self::MOD;
        }
        Self { hash, pow }
    }

    pub fn get<R: RangeBounds<usize>>(&self, range: R) -> u64 {
        let start = match range.start_bound() {
            Bound::Included(&s) => s,
            Bound::Excluded(&s) => s + 1,
            _ => 0,
        };
        let end = match range.end_bound() {
            Bound::Included(&e) => e + 1,
            Bound::Excluded(&e) => e,
            _ => self.hash.len() - 1,
        };

        let hl = self.hash[start];
        let hr = self.hash[end];
        let pow_len = self.pow[end - start];
        (hr + Self::MOD - (hl * pow_len) % Self::MOD) % Self::MOD
    }
}
