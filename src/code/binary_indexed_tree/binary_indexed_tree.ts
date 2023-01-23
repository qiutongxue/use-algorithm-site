function useBIT(nums: number[]) {
    const lowbit = (x: number) => x & -x

    const n = nums.length
    const tree = new Array(n + 1).fill(0)

    for (let i = 0; i < n; i++) add(i, nums[i])

    function add(idx: number, val: number) {
        for (let i = idx + 1; i <= n; i += lowbit(i)) tree[i] += val
    }

    function update(idx: number, val: number) {
        add(idx, val - nums[idx])
    }

    function query(idx: number) {
        let res = 0
        for (let i = idx + 1; i > 0; i -= lowbit(i)) res += tree[i]
        return res
    }

    function queryByInterval(left: number, right: number) {
        return query(right) - query(left - 1)
    }

    return {
        add, update, query, queryByInterval
    }
}