pub struct SegmentTree<T>
where
    T: Clone + Copy,
{
    tree: Vec<T>,
    array: Vec<T>,
    operate: Box<dyn Fn(T, T) -> T>,
    fallback: T,
}

impl<T> SegmentTree<T>
where
    T: Clone + Copy,
{
    pub fn new(
        input_array: &Vec<T>,
        operation: Box<dyn Fn(T, T) -> T>,
        operation_fallback: T,
    ) -> Self {
        let operate = operation;
        let fallback = operation_fallback;
        let array: Vec<T> = input_array.iter().map(|&x| x).collect();
        let n = array.len();

        let tree_length = match n.is_power_of_two() {
            true => 2 * n - 1,
            _ => {
                let mut len = 0;
                let mut m = n;
                while m > 0 {
                    len += 1;
                    m >>= 1;
                }
                let length = 2 * ((n >> (len - 1)) << len) - 1;
                length
            }
        };

        let tree = vec![fallback; tree_length];

        let mut result = Self {
            tree,
            array,
            operate,
            fallback,
        };
        result.build_tree(0, 0, n - 1);

        result
    }

    fn build_tree(&mut self, node: usize, start: usize, end: usize) {
        if start == end {
            self.tree[node] = self.array[start];
            return;
        }

        let (mid, left_node, right_node) = Self::get_info(node, start, end);

        self.build_tree(left_node, start, mid);
        self.build_tree(right_node, mid + 1, end);
        self.tree[node] = self.operate.as_ref()(self.tree[left_node], self.tree[right_node]);
    }

    fn update_tree(&mut self, node: usize, start: usize, end: usize, index: usize, value: T) {
        if start == end && index == start {
            self.tree[node] = value;
            return;
        }
        let (mid, left_node, right_node) = Self::get_info(node, start, end);

        if index <= mid {
            self.update_tree(left_node, start, mid, index, value);
        } else {
            self.update_tree(right_node, mid + 1, end, index, value);
        }

        self.tree[node] = self.operate.as_ref()(self.tree[left_node], self.tree[right_node]);
    }

    fn query_tree(
        &mut self,
        node: usize,
        start: usize,
        end: usize,
        left: usize,
        right: usize,
    ) -> T {
        if right < start || left > end {
            return self.fallback;
        }
        if left <= start && end <= right {
            return self.tree[node];
        }

        let (mid, left_node, right_node) = Self::get_info(node, start, end);

        let left_result = self.query_tree(left_node, start, mid, left, right);
        let right_result = self.query_tree(right_node, mid + 1, end, left, right);

        self.operate.as_ref()(left_result, right_result)
    }

    pub fn query(&mut self, left: usize, right: usize) -> T {
        let n = self.array.len();
        if left > right || right >= self.array.len() {
            panic!("超出范围");
        }

        self.query_tree(0, 0, n - 1, left, right)
    }

    pub fn update(&mut self, index: usize, value: T) {
        let n = self.array.len();
        if index >= n {
            panic!("超出范围");
        }

        self.update_tree(0, 0, n - 1, index, value)
    }

    fn get_info(node: usize, start: usize, end: usize) -> (usize, usize, usize) {
        let mid = (start + end) >> 1;
        let left_node = node * 2 + 1;
        let right_node = node * 2 + 2;
        (mid, left_node, right_node)
    }
}
