struct UnionFind {
    parent: Vec<usize>,
    size: Vec<usize>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        let parent = vec![0; n]
            .iter()
            .enumerate()
            .map(|(i, _)| i)
            .collect::<Vec<usize>>();

        let size = vec![1; n];
        Self { parent, size }
    }

    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            self.parent[x] = self.find(self.parent[x]);
        }
        self.parent[x]
    }

    fn union(&mut self, x: usize, y: usize) {
        let (mut rx, mut ry) = (self.find(x), self.find(y));
        if rx == ry {
            return;
        }
        if self.size[rx] > self.size[ry] {
            (rx, ry) = (ry, rx);
        }
        self.parent[rx] = ry;
        self.size[ry] += self.size[rx];
    }
}
