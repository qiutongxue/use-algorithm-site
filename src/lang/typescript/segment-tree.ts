type MergeFn<T> = (a: T, b: T) => T
type ApplyFn<T, L> = (value: T, lazy: L, length: number) => T
type ComposeFn<L> = (oldLazy: L, newLazy: L) => L

interface Operation<T, L> {
    merge: MergeFn<T>
    /** 如何根据 lazy 更新 tree */
    apply: ApplyFn<T, L>
    /** 如何更新 lazy */
    compose: ComposeFn<L>
    identityValue: () => T
    identityLazy: () => L
}

export function useSegmentTree<T, L>(data: T[], op: Operation<T, L>) {
    const n = data.length
    const tree: T[] = Array(4 * n).fill(op.identityValue())
    const lazy: L[] = Array(4 * n).fill(op.identityLazy())

    function build(node: number, l: number, r: number) {
        if (l === r) {
            tree[node] = data[l]
        } else {
            const mid = (l + r) >> 1
            build(node * 2, l, mid)
            build(node * 2 + 1, mid + 1, r)
            tree[node] = op.merge(tree[node * 2], tree[node * 2 + 1])
        }
    }

    function applyToNode(node: number, val: L, length: number) {
        tree[node] = op.apply(tree[node], val, length)
        lazy[node] = op.compose(lazy[node], val)
    }

    function pushDown(node: number, l: number, r: number) {
        if (JSON.stringify(lazy[node]) !== JSON.stringify(op.identityLazy())) {
            const mid = (l + r) >> 1
            applyToNode(node * 2, lazy[node], mid - l + 1)
            applyToNode(node * 2 + 1, lazy[node], r - mid)
            lazy[node] = op.identityLazy()
        }
    }

    function updateRange(
        node: number,
        l: number,
        r: number,
        ql: number,
        qr: number,
        val: L,
    ) {
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

    function queryRange(
        node: number,
        l: number,
        r: number,
        ql: number,
        qr: number,
    ): T {
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
        query: (l: number, r: number) => queryRange(1, 0, n - 1, l, r),
        update: (l: number, r: number, val: L) =>
            updateRange(1, 0, n - 1, l, r, val),
    }
}

// 求区间和（区间增值）
{
    const seg = useSegmentTree<number, number>([1, 2, 3, 4, 5], {
        merge: (a, b) => a + b,
        apply: (value, lazy, length) => value + lazy * length,
        compose: (oldLazy, newLazy) => oldLazy + newLazy,
        identityValue: () => 0,
        identityLazy: () => 0,
    })

    console.log(seg.query(0, 4)) // 15
    seg.update(1, 3, 2)
    console.log(seg.query(0, 4)) // 21
}

// 求区间和（区间赋值）
{
    const seg = useSegmentTree<number, number>([1, 2, 3, 4, 5], {
        merge: (a, b) => a + b,
        apply: (_value, lazy, length) => lazy * length,
        compose: (_oldLazy, newLazy) => newLazy,
        identityValue: () => 0,
        identityLazy: () => 0,
    })

    console.log(seg.query(0, 4)) // 15
    seg.update(1, 3, 2)
    console.log(seg.query(0, 4)) // 12
}
