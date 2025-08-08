use std::ops::Deref;

#[derive(Clone, Copy)]
struct NodeCtx {
    index: usize,
    start: usize,
    end: usize,
}

impl From<(usize, usize, usize)> for NodeCtx {
    fn from((index, start, end): (usize, usize, usize)) -> Self {
        Self { index, start, end }
    }
}

impl Deref for NodeCtx {
    type Target = usize;

    fn deref(&self) -> &usize {
        &self.index
    }
}

impl NodeCtx {
    fn split(&self) -> (NodeCtx, NodeCtx) {
        let mid = (self.start + self.end) >> 1;
        let left_node = (self.index * 2 + 1, self.start, mid).into();
        let right_node = (self.index * 2 + 2, mid + 1, self.end).into();
        (left_node, right_node)
    }

    fn is_leaf(&self) -> bool {
        self.start == self.end
    }

    fn contains(&self, index: usize) -> bool {
        self.start <= index && index <= self.end
    }

    fn is_contained_in_range(&self, start: usize, end: usize) -> bool {
        start <= self.start && self.end <= end
    }

    fn overlaps(&self, start: usize, end: usize) -> bool {
        !(self.end < start || self.start > end)
    }
}

pub struct SegmentTree<T, F>
where
    T: Copy,
    F: Fn(T, T) -> T,
{
    tree: Vec<T>,
    operate: F,
    fallback: T,
    size: usize,
}

impl<T, F> SegmentTree<T, F>
where
    T: Clone + Copy,
    F: Fn(T, T) -> T,
{
    pub fn new(input_array: &[T], operation: F, operation_fallback: T) -> Self {
        let operate = operation;
        let fallback = operation_fallback;
        let n = input_array.len();

        let m = n.next_power_of_two();
        let tree_length = 2 * m - 1;

        let tree = vec![fallback; tree_length];

        let mut result = Self {
            tree,
            operate,
            fallback,
            size: n,
        };
        result.build_tree((0, 0, n - 1).into(), input_array);

        result
    }

    fn build_tree(&mut self, node: NodeCtx, array: &[T]) {
        if node.is_leaf() {
            self.tree[*node] = array[node.start];
            return;
        }

        let (left_node, right_node) = node.split();

        self.build_tree(left_node, array);
        self.build_tree(right_node, array);
        self.tree[*node] = (self.operate)(self.tree[*left_node], self.tree[*right_node]);
    }

    fn update_tree(&mut self, node: NodeCtx, index: usize, value: T) {
        if node.is_leaf() {
            self.tree[*node] = value;
            return;
        }

        let (left_node, right_node) = node.split();

        if left_node.contains(index) {
            self.update_tree(left_node, index, value);
        } else if right_node.contains(index) {
            self.update_tree(right_node, index, value);
        }

        self.tree[*node] = (self.operate)(self.tree[*left_node], self.tree[*right_node]);
    }

    fn query_tree(&self, node: NodeCtx, left: usize, right: usize) -> T {
        if !node.overlaps(left, right) {
            return self.fallback;
        }
        if node.is_contained_in_range(left, right) {
            return self.tree[*node];
        }

        let (left_node, right_node) = node.split();

        let left_result = self.query_tree(left_node, left, right);
        let right_result = self.query_tree(right_node, left, right);

        (self.operate)(left_result, right_result)
    }

    pub fn query(&self, left: usize, right: usize) -> T {
        let n = self.size;
        if left > right || right >= n {
            panic!("超出范围");
        }

        self.query_tree((0, 0, n - 1).into(), left, right)
    }

    pub fn update(&mut self, index: usize, value: T) {
        let n = self.size;
        if index >= n {
            panic!("超出范围");
        }

        self.update_tree((0, 0, n - 1).into(), index, value)
    }
}
