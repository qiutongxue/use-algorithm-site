export function useSegmentTree(data, op) {
    const n = data.length
    const tree = Array(4 * n).fill(op.identityValue())
    const lazy = Array(4 * n).fill(op.identityLazy())
    function build(node, l, r) {
        if (l === r) {
            tree[node] = data[l]
        } else {
            const mid = (l + r) >> 1
            build(node * 2, l, mid)
            build(node * 2 + 1, mid + 1, r)
            tree[node] = op.merge(tree[node * 2], tree[node * 2 + 1])
        }
    }
    function applyToNode(node, val, length) {
        tree[node] = op.apply(tree[node], val, length)
        lazy[node] = op.compose(lazy[node], val)
    }
    function pushDown(node, l, r) {
        if (JSON.stringify(lazy[node]) !== JSON.stringify(op.identityLazy())) {
            const mid = (l + r) >> 1
            applyToNode(node * 2, lazy[node], mid - l + 1)
            applyToNode(node * 2 + 1, lazy[node], r - mid)
            lazy[node] = op.identityLazy()
        }
    }
    function updateRange(node, l, r, ql, qr, val) {
        if (ql > r || qr < l) return
        if (ql <= l && r <= qr) {
            applyToNode(node, val, r - l + 1)
            return
        }
        pushDown(node, l, r)
        const mid = (l + r) >> 1
        updateRange(node * 2, l, mid, ql, qr, val)
        updateRange(node * 2 + 1, mid + 1, r, ql, qr, val)
        tree[node] = op.merge(tree[node * 2], tree[node * 2 + 1])
    }
    function queryRange(node, l, r, ql, qr) {
        if (ql > r || qr < l) return op.identityValue()
        if (ql <= l && r <= qr) return tree[node]
        pushDown(node, l, r)
        const mid = (l + r) >> 1
        return op.merge(
            queryRange(node * 2, l, mid, ql, qr),
            queryRange(node * 2 + 1, mid + 1, r, ql, qr),
        )
    }
    build(1, 0, n - 1)
    return {
        query: (l, r) => queryRange(1, 0, n - 1, l, r),
        update: (l, r, val) => updateRange(1, 0, n - 1, l, r, val),
    }
}
{
    const seg = useSegmentTree([1, 2, 3, 4, 5], {
        merge: (a, b) => a + b,
        apply: (value, lazy, length) => value + lazy * length,
        compose: (oldLazy, newLazy) => oldLazy + newLazy,
        identityValue: () => 0,
        identityLazy: () => 0,
    })
    console.log(seg.query(0, 4))
    seg.update(1, 3, 2)
    console.log(seg.query(0, 4))
}
{
    const seg = useSegmentTree([1, 2, 3, 4, 5], {
        merge: (a, b) => a + b,
        apply: (_value, lazy, length) => lazy * length,
        compose: (_oldLazy, newLazy) => newLazy,
        identityValue: () => 0,
        identityLazy: () => 0,
    })
    console.log(seg.query(0, 4))
    seg.update(1, 3, 2)
    console.log(seg.query(0, 4))
}
