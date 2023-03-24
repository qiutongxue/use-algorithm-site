export function useTrie() {
  class TrieNode {
    children: TrieNode[] = []
    isEnd = false
  }

  const root = new TrieNode()

  function insert(word: string) {
    let node = root
    for (let i = 0; i < word.length; i++) {
      const c = word[i].charCodeAt(0) - 'a'.charCodeAt(0)
      if (!node.children[c])
        node.children[c] = new TrieNode()

      node = node.children[c]
    }
    node.isEnd = true
  }

  function search(word: string): boolean {
    let node = root
    for (let i = 0; i < word.length; i++) {
      const c = word[i].charCodeAt(0) - 'a'.charCodeAt(0)
      if (!node.children[c])
        return false

      node = node.children[c]
    }
    return node.isEnd
  }

  function startsWith(prefix: string): boolean {
    let node = root
    for (let i = 0; i < prefix.length; i++) {
      const c = prefix[i].charCodeAt(0) - 'a'.charCodeAt(0)
      if (!node.children[c])
        return false

      node = node.children[c]
    }
    return true
  }

  return {
    insert,
    search,
    startsWith,
  }
}
