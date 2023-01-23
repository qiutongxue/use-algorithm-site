"use strict";
function useZKWSegmentTree(nums) {
    const n = nums.length;
    let base = 1;
    while (base <= n)
        base <<= 1;
    const tree = new Array(base << 1).fill(0);
    for (let i = 0; i < n; i++) {
        tree[base + 1 + i] = nums[i];
    }
    for (let i = base - 1; i > 0; i--) {
        tree[i] = tree[i << 1] + tree[i << 1 | 1];
    }
    function update(index, val) {
        index = base + index + 1;
        tree[index] = val;
        for (let i = index >> 1; i > 0; i = i >> 1) {
            tree[i] = tree[i << 1] + tree[i << 1 | 1];
        }
    }
    function query(left, right) {
        left = base + left;
        right = base + right + 2;
        let res = 0;
        while ((left ^ right ^ 1)) {
            if (!(left & 1)) {
                res += tree[left ^ 1];
            }
            if (right & 1) {
                res += tree[right ^ 1];
            }
            left >>= 1;
            right >>= 1;
        }
        return res;
    }
    return {
        update, query
    };
}
