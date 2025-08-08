pub struct UnionFind {
    parent: Vec<usize>,
    size: Vec<usize>,
    groups: usize,
}

impl UnionFind {
    pub fn new(n: usize) -> Self {
        let parent = (0..n).collect::<Vec<usize>>();
        let size = vec![1; n];
        Self {
            parent,
            size,
            groups: n,
        }
    }

    pub fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            self.parent[x] = self.find(self.parent[x]);
        }
        self.parent[x]
    }

    pub fn union(&mut self, x: usize, y: usize) -> bool {
        let (mut rx, mut ry) = (self.find(x), self.find(y));
        if rx == ry {
            return false;
        }
        self.groups -= 1;
        if self.size[rx] > self.size[ry] {
            std::mem::swap(&mut rx, &mut ry);
        }
        self.parent[rx] = ry;
        self.size[ry] += self.size[rx];
        true
    }
}
