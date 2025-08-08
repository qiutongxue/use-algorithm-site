pub struct PriorityQueue<T: Ord> {
    data: Vec<T>,
}

impl<T: Ord> PriorityQueue<T> {
    pub fn new() -> Self {
        Self { data: Vec::new() }
    }

    pub fn push(&mut self, value: T) {
        self.data.push(value);
        let mut i = self.data.len() - 1;
        while i > 0 {
            let parent = (i - 1) / 2;
            if self.data[i] <= self.data[parent] {
                self.data.swap(parent, i);
                i = parent;
            } else {
                break;
            }
        }
    }

    pub fn pop(&mut self) -> Option<T> {
        if self.data.is_empty() {
            return None;
        }
        let result = self.data.swap_remove(0);
        let mut i = 0;
        while i * 2 + 1 < self.data.len() {
            let left = i * 2 + 1;
            let right = i * 2 + 2;
            let mut next = left;
            if right < self.data.len() && self.data[left] > self.data[right] {
                next = right;
            }
            if self.data[next] < self.data[i] {
                self.data.swap(next, i);
                i = next;
            } else {
                break;
            }
        }
        Some(result)
    }

    pub fn peek(&self) -> Option<&T> {
        self.data.first()
    }

    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }

    pub fn len(&self) -> usize {
        self.data.len()
    }

    pub fn clear(&mut self) {
        self.data.clear();
    }
}
