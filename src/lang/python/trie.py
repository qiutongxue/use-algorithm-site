class TrieNode:
    __slots__ = ("children", "is_end")

    def __init__(self):
        # 固定 26 个字母位置
        self.children = [None] * 26
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            index = ord(ch) - ord('a')
            if node.children[index] is None:
                node.children[index] = TrieNode()
            node = node.children[index]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            index = ord(ch) - ord('a')
            if node.children[index] is None:
                return False
            node = node.children[index]
        return node.is_end

    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            index = ord(ch) - ord('a')
            if node.children[index] is None:
                return False
            node = node.children[index]
        return True
