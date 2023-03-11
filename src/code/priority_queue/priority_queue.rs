struct PriorityQueue<T, F>
where
    F: Fn(&T, &T) -> i32,
{
    compare: F,
    data: Vec<T>,
}

impl<T, F> PriorityQueue<T, F>
where
    F: Fn(&T, &T) -> i32,
{
    fn new(compare: F) -> Self {
        Self {
            compare,
            data: Vec::new(),
        }
    }

    fn push(&mut self, value: T) {
        self.data.push(value);
        let mut i = self.data.len() - 1;
        while i > 0 {
            let parent = (i - 1) / 2;
            if (self.compare)(&self.data[i], &self.data[parent]) <= 0 {
                self.data.swap(parent, i);
                i = parent;
            } else {
                break;
            }
        }
    }

    fn pop(&mut self) -> Option<T> {
        if self.data.is_empty() {
            return None;
        }
        let result = self.data.swap_remove(0);
        let mut i = 0;
        while i * 2 + 1 < self.data.len() {
            let left = i * 2 + 1;
            let right = i * 2 + 2;
            let mut next = left;
            if right < self.data.len() && (self.compare)(&self.data[left], &self.data[right]) > 0 {
                next = right;
            }
            if (self.compare)(&self.data[next], &self.data[i]) < 0 {
                self.data.swap(next, i);
                i = next;
            } else {
                break;
            }
        }
        Some(result)
    }

    fn peek(&self) -> Option<&T> {
        self.data.first()
    }

    fn is_empty(&self) -> bool {
        self.data.is_empty()
    }

    fn len(&self) -> usize {
        self.data.len()
    }

    fn clear(&mut self) {
        self.data.clear();
    }
}