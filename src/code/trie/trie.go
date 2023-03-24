type TrieNode struct {
	children [26]*TrieNode
	isEnd    bool
}

func NewTrieNode() *TrieNode {
	return &TrieNode{
		children: [26]*TrieNode{},
		isEnd:    false,
	}
}

type Trie struct {
	root *TrieNode
}

func NewTrie() *Trie {
	return &Trie{root: NewTrieNode()}
}

func (trie *Trie) Insert(word string) {
	curr := trie.root
	for _, c := range word {
		index := c - 'a'
		if curr.children[index] == nil {
			curr.children[index] = NewTrieNode()
		}
		curr = curr.children[index]
	}
	curr.isEnd = true
}

func (trie *Trie) Search(word string) bool {
	curr := trie.root
	for _, c := range word {
		index := c - 'a'
		if curr.children[index] == nil {
			return false
		}
		curr = curr.children[index]
	}
	return curr.isEnd
}

func (trie *Trie) StartsWith(prefix string) bool {
	curr := trie.root
	for _, c := range prefix {
		index := c - 'a'
		if curr.children[index] == nil {
			return false
		}
		curr = curr.children[index]
	}
	return true
}
