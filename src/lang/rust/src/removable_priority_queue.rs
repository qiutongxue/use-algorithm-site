use crate::priority_queue::PriorityQueue;

pub struct RemovablePriorityQueue<T>
where
    T: Eq + std::hash::Hash + Copy + Ord,
{
    pq: PriorityQueue<T>,
    exist: std::collections::HashMap<T, i32>,
    size: usize,
}

impl<T> RemovablePriorityQueue<T>
where
    T: Eq + std::hash::Hash + Copy + Ord,
{
    pub fn new() -> Self {
        let pq = PriorityQueue::new();
        let exist = std::collections::HashMap::new();
        Self { pq, exist, size: 0 }
    }

    pub fn push(&mut self, value: T) {
        self.pq.push(value);
        self.exist.entry(value).and_modify(|x| *x += 1).or_insert(1);
        self.size += 1;
    }

    pub fn pop(&mut self) -> Option<T> {
        self.remove_unusable();
        if self.pq.is_empty() {
            return None;
        }
        let result = self.pq.pop().unwrap();
        if let Some(x) = self.exist.get_mut(&result) {
            *x -= 1;
            if *x == 0 {
                self.exist.remove(&result);
            }
            self.size -= 1;
        }
        Some(result)
    }

    pub fn peek(&mut self) -> Option<&T> {
        self.remove_unusable();
        self.pq.peek()
    }

    pub fn remove(&mut self, value: T) {
        if let Some(x) = self.exist.get_mut(&value) {
            *x -= 1;
            if *x == 0 {
                self.exist.remove(&value);
            }
            self.size -= 1;
        }
    }

    fn remove_unusable(&mut self) {
        while !self.pq.is_empty() && self.exist.contains_key(self.pq.peek().unwrap()) {
            self.pq.pop();
        }
    }

    pub fn len(&self) -> usize {
        self.size
    }

    pub fn is_empty(&self) -> bool {
        self.size == 0
    }

    pub fn clear(&mut self) {
        self.pq.clear();
        self.exist.clear();
        self.size = 0;
    }
}
