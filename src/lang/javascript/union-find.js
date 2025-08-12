export function useUnionFind(n) {
    const parent = new Array(n).fill(0).map((_, i) => i)
    const size = new Array(n).fill(1)
    function find(x) {
        if (parent[x] !== x) parent[x] = find(parent[x])
        return parent[x]
    }
    function union(x, y) {
        let rx = find(x)
        let ry = find(y)
        if (rx === ry) return false
        if (size[rx] > size[ry]) [rx, ry] = [ry, rx]
        parent[rx] = ry
        size[ry] += size[rx]
        return true
    }
    function isUnion(x, y) {
        return find(x) === find(y)
    }
    function setSize(x) {
        return size[find(x)]
    }
    return {
        union,
        find,
        isUnion,
        setSize,
    }
}
