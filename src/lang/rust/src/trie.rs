pub struct Trie {
    root: TrieNode,
}

impl Trie {
    pub fn new() -> Self {
        Trie {
            root: TrieNode::new(),
        }
    }

    pub fn insert(&mut self, word: String) {
        let mut node = &mut self.root;
        for c in word.chars() {
            let index = (c as u8 - b'a') as usize;
            node = node.children[index].get_or_insert_with(|| Box::new(TrieNode::new()));
        }
        node.is_end = true;
    }

    pub fn search(&self, word: String) -> bool {
        let mut node = &self.root;
        for c in word.chars() {
            let index = (c as u8 - b'a') as usize;
            if let Some(child) = &node.children[index] {
                node = child;
            } else {
                return false;
            }
        }
        node.is_end
    }

    pub fn starts_with(&self, prefix: String) -> bool {
        let mut node = &self.root;
        for c in prefix.chars() {
            let index = (c as u8 - b'a') as usize;
            if let Some(child) = &node.children[index] {
                node = child;
            } else {
                return false;
            }
        }
        true
    }
}

#[derive(Clone)]
struct TrieNode {
    children: Vec<Option<Box<TrieNode>>>,
    is_end: bool,
}

impl TrieNode {
    fn new() -> Self {
        TrieNode {
            children: vec![None.clone(); 26],
            is_end: false,
        }
    }
}
