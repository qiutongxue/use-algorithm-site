"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrie = void 0;
function useTrie() {
    class TrieNode {
        children = [];
        isEnd = false;
    }
    const root = new TrieNode();
    function insert(word) {
        let node = root;
        for (let i = 0; i < word.length; i++) {
            const c = word[i].charCodeAt(0) - 'a'.charCodeAt(0);
            if (!node.children[c])
                node.children[c] = new TrieNode();
            node = node.children[c];
        }
        node.isEnd = true;
    }
    function search(word) {
        let node = root;
        for (let i = 0; i < word.length; i++) {
            const c = word[i].charCodeAt(0) - 'a'.charCodeAt(0);
            if (!node.children[c])
                return false;
            node = node.children[c];
        }
        return node.isEnd;
    }
    function startsWith(prefix) {
        let node = root;
        for (let i = 0; i < prefix.length; i++) {
            const c = prefix[i].charCodeAt(0) - 'a'.charCodeAt(0);
            if (!node.children[c])
                return false;
            node = node.children[c];
        }
        return true;
    }
    return {
        insert,
        search,
        startsWith,
    };
}
exports.useTrie = useTrie;
