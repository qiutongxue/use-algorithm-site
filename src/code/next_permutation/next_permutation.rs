trait NextPermutation {
    fn next_permutation(&mut self) -> bool;
}

impl<T: Ord> NextPermutation for Vec<T> {
    fn next_permutation(&mut self) -> bool {
        let n = self.len();
        if n < 2 {
            return false;
        }
        let (mut i, mut j) = (n - 2, n - 1);
        while i < n && self[i] >= self[i + 1] {
            i -= 1;
        }
        if i >= n {
            return false;
        }
        while j > i && self[j] <= self[i] {
            j -= 1;
        }
        self.swap(i, j);
        let mut k = i + 1;
        let mut l = n - 1;
        while k < l {
            self.swap(k, l);
            k += 1;
            l -= 1;
        }
        true
    }
}
