export function useUnionFind(n: number) {
    const parent: number[] = new Array(n).fill(0).map((_, i) => i)
    const size: number[] = new Array(n).fill(1)

    function find(x: number) {
        if (parent[x] !== x) parent[x] = find(parent[x])

        return parent[x]
    }
    function union(x: number, y: number) {
        let rx = find(x)
        let ry = find(y)
        if (rx === ry) return false
        if (size[rx] > size[ry]) [rx, ry] = [ry, rx]

        parent[rx] = ry
        size[ry] += size[rx]
        return true
    }

    function isUnion(x: number, y: number) {
        return find(x) === find(y)
    }

    function setSize(x: number) {
        return size[find(x)]
    }

    return {
        union,
        find,
        isUnion,
        setSize,
    }
}
