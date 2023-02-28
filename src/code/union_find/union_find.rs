struct UnionFind {
    parent: Vec<usize>,
    size: Vec<usize>,
    groups: i32,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        let parent = vec![0; n]
            .iter()
            .enumerate()
            .map(|(i, _)| i)
            .collect::<Vec<usize>>();

        let size = vec![1; n];
        Self { parent, size, groups: n as i32 }
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
        self.groups -= 1;
        if self.size[rx] > self.size[ry] {
            let t = rx;
            rx = ry;
            ry = t;
        }
        self.parent[rx] = ry;
        self.size[ry] += self.size[rx];
    }
}
