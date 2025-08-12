use std::fmt::Debug;

/// 值的代数（幺半群/Monoid）
pub trait Monoid {
    type Item: Clone + Debug;
    /// 合并两个子区间的结果
    fn merge(a: &Self::Item, b: &Self::Item) -> Self::Item;
    /// 单位元
    fn identity() -> Self::Item;
}

/// 延迟操作接口：如何把 lazy 应用到节点值，以及如何合成延迟标记
pub trait LazyOp: Monoid {
    /// lazy 标记的类型
    type Lazy: Clone + Debug + PartialEq;
    /// 把延迟标记应用到节点值（注意：len 用于像求和那样按长度缩放）
    fn apply(value: &Self::Item, lazy: &Self::Lazy, len: usize) -> Self::Item;
    /// 把 newLazy 复合到 oldLazy（old <- compose(old, new)），语义由实现者定义。
    fn compose(old: &mut Self::Lazy, new: &Self::Lazy);
    /// lazy 的单位元（表示“无操作”）
    fn identity_lazy() -> Self::Lazy;
}

/// 通用线段树
pub struct SegmentTree<M: LazyOp> {
    n: usize,
    seg: Vec<M::Item>,
    lz: Vec<M::Lazy>,
}

impl<M: LazyOp> SegmentTree<M> {
    /// 从原始数组构建
    pub fn from_vec(a: &[M::Item]) -> Self {
        let n = a.len();
        let size = n.next_power_of_two() * 2;
        let seg = vec![M::identity(); size];
        let lz = vec![M::identity_lazy(); size];
        let mut st = SegmentTree { n, seg, lz };
        if n > 0 {
            st.build(1, 0, n - 1, a);
        }
        st
    }

    fn build(&mut self, idx: usize, l: usize, r: usize, a: &[M::Item]) {
        if l == r {
            self.seg[idx] = a[l].clone();
            return;
        }
        let mid = (l + r) >> 1;
        self.build(idx << 1, l, mid, a);
        self.build(idx << 1 | 1, mid + 1, r, a);
        self.pull(idx);
    }

    fn pull(&mut self, idx: usize) {
        self.seg[idx] = M::merge(&self.seg[idx << 1], &self.seg[idx << 1 | 1]);
    }

    fn apply_node(&mut self, idx: usize, l: usize, r: usize, lazy: &M::Lazy) {
        let len = r - l + 1;
        self.seg[idx] = M::apply(&self.seg[idx], lazy, len);
        M::compose(&mut self.lz[idx], lazy);
    }

    fn push(&mut self, idx: usize, l: usize, r: usize) {
        // 如果当前节点没有延迟标记（是 identity），则不下传
        let ident = M::identity_lazy();
        if self.lz[idx] != ident {
            let mid = (l + r) >> 1;
            self.apply_node(idx << 1, l, mid, &self.lz[idx].clone());
            self.apply_node(idx << 1 | 1, mid + 1, r, &self.lz[idx].clone());
            self.lz[idx] = M::identity_lazy();
        }
    }

    /// 区间更新 [ql, qr]
    pub fn update(&mut self, ql: usize, qr: usize, val: &M::Lazy) {
        assert!(ql <= qr && qr < self.n);
        self.update_rec(1, 0, self.n - 1, ql, qr, val);
    }

    fn update_rec(&mut self, idx: usize, l: usize, r: usize, ql: usize, qr: usize, val: &M::Lazy) {
        if ql <= l && r <= qr {
            self.apply_node(idx, l, r, val);
            return;
        }
        self.push(idx, l, r);
        let mid = (l + r) >> 1;
        if ql <= mid {
            self.update_rec(idx << 1, l, mid, ql, qr, val);
        }
        if qr > mid {
            self.update_rec(idx << 1 | 1, mid + 1, r, ql, qr, val);
        }
        self.pull(idx);
    }

    /// 区间查询 [ql, qr]
    pub fn query(&mut self, ql: usize, qr: usize) -> M::Item {
        assert!(ql <= qr && qr < self.n);
        self.query_rec(1, 0, self.n - 1, ql, qr)
    }

    fn query_rec(&mut self, idx: usize, l: usize, r: usize, ql: usize, qr: usize) -> M::Item {
        if ql <= l && r <= qr {
            return self.seg[idx].clone();
        }
        self.push(idx, l, r);
        let mid = (l + r) >> 1;
        if qr <= mid {
            return self.query_rec(idx << 1, l, mid, ql, qr);
        }
        if ql > mid {
            return self.query_rec(idx << 1 | 1, mid + 1, r, ql, qr);
        }
        let left = self.query_rec(idx << 1, l, mid, ql, qr);
        let right = self.query_rec(idx << 1 | 1, mid + 1, r, ql, qr);
        M::merge(&left, &right)
    }
}

// 求区间和（同时支持区间赋值和区间增值）
#[derive(Clone, Debug, PartialEq)]
struct SumMonoid;

impl Monoid for SumMonoid {
    type Item = i64;
    fn merge(a: &Self::Item, b: &Self::Item) -> Self::Item {
        *a + *b
    }
    fn identity() -> Self::Item {
        0
    }
}

#[derive(Clone, PartialEq, Debug)]
pub enum SumLazy {
    None,
    Add(i64),
    Assign(i64),
}

impl LazyOp for SumMonoid {
    type Lazy = SumLazy;
    fn apply(value: &Self::Item, lazy: &Self::Lazy, len: usize) -> Self::Item {
        match lazy {
            SumLazy::Add(lazy) => *value + lazy * len as i64,
            SumLazy::Assign(lazy) => lazy * len as i64,
            _ => *value,
        }
    }
    fn compose(old: &mut Self::Lazy, new: &Self::Lazy) {
        match new {
            SumLazy::Assign(_) => *old = new.clone(),
            SumLazy::Add(n) => match old {
                SumLazy::Add(o) => *o += n,
                SumLazy::Assign(o) => *o += n,
                _ => *old = new.clone(),
            },
            _ => (),
        }
    }
    fn identity_lazy() -> Self::Lazy {
        SumLazy::None
    }
}

// DELETE: START
#[cfg(test)]
mod tests {
    use super::*;

    // --------- 示例实现：区间赋值 + 区间最大值 ---------
    #[derive(Clone, Debug, PartialEq)]
    struct MaxAssignMonoid;

    impl Monoid for MaxAssignMonoid {
        type Item = i64; // 存当前区间的最大值
        fn merge(a: &Self::Item, b: &Self::Item) -> Self::Item {
            *a.max(b)
        }
        fn identity() -> Self::Item {
            i64::MIN / 4
        }
    }

    #[derive(Clone, Debug, PartialEq)]
    enum AssignLazy {
        None,
        Set(i64),
    }

    impl LazyOp for MaxAssignMonoid {
        type Lazy = AssignLazy;
        fn apply(value: &Self::Item, lazy: &Self::Lazy, _len: usize) -> Self::Item {
            match lazy {
                AssignLazy::None => *value,
                AssignLazy::Set(x) => *x,
            }
        }
        fn compose(old: &mut Self::Lazy, new: &Self::Lazy) {
            match new {
                AssignLazy::None => (),
                AssignLazy::Set(x) => *old = AssignLazy::Set(*x),
            }
        }
        fn identity_lazy() -> Self::Lazy {
            AssignLazy::None
        }
    }

    #[test]
    fn test_sum_range_add() {
        let a = vec![1i64, 2, 3, 4, 5];
        let mut st = SegmentTree::<SumMonoid>::from_vec(&a);
        assert_eq!(st.query(0, 4), 15);
        st.update(1, 3, &SumLazy::Add(10)); // a[1..3] += 10
        assert_eq!(st.query(0, 0), 1);
        assert_eq!(st.query(1, 1), 12);
        assert_eq!(st.query(0, 4), 45);
        assert_eq!(st.query(2, 4), 13 + 14 + 5);
        st.update(1, 3, &SumLazy::Assign(10)); // a[1..3] = 10
        assert_eq!(st.query(1, 1), 10);
        assert_eq!(st.query(0, 4), 36);
        assert_eq!(st.query(2, 4), 10 + 10 + 5);
    }

    #[test]
    fn test_max_range_set() {
        let a = vec![1i64, 7, 3, 9, 5];
        let mut st = SegmentTree::<MaxAssignMonoid>::from_vec(&a);
        assert_eq!(st.query(0, 4), 9);
        st.update(1, 3, &AssignLazy::Set(4));
        assert_eq!(st.query(0, 4), 5.max(4).max(1));
        assert_eq!(st.query(1, 2), 4);
    }
}

// DELETE: END
