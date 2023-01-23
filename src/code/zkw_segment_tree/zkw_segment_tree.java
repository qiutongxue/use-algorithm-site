class ZKWSegmentTree {
    int[] tree;
    int base = 1;
    public ZKWSegmentTree(int[] nums) {
        int n = nums.length;
        // 找到能容纳整个 nums 的满二叉树的层
        while (base <= n) base <<= 1;
        // 最后一层有 base 个节点，那么前面几层加起来就有 base - 1 个节点，总共就有 base*2 - 1 个节点
        tree = new int[base << 1];
        // 把 nums 放到最后一层，注意 base 位置是空的
        for (int i = 0; i < nums.length; i++) {
            tree[base + 1 + i] = nums[i];
        }
        // 向上更新
        for (int i = base - 1; i > 0; i--) {
            tree[i] = tree[i << 1] + tree[i << 1 | 1];
        }
    }

    public void update(int index, int val) {
        // 树的起始节点为 1
        index = base + index + 1;
        tree[index] = val;
        // 向上更新
        for (int i = index >> 1; i > 0; i >>= 1) {
            tree[i] = tree[i << 1] + tree[i << 1 | 1];
        }
    }

    public int query(int left, int right) {
        // 将 [left, right] 变为开区间的 (left - 1, right + 1)
        // 这里不用担心 right 超出范围的情况
        left = base + left;
        right = base + right + 2;
        int res = 0;
        // left ^ right ^ 1 == 0 表示 left 和 right 是兄弟节点
        while ((left ^ right ^ 1) != 0) {
            // left 是左孩子，说明右孩子在范围里
            if ((left & 1) == 0) {
                res += tree[left ^ 1];
            }
            // right 是右孩子，说明左孩子在范围里
            if ((right & 1) == 1) {
                res += tree[right ^ 1];
            }
            // 到父节点
            left >>= 1;
            right >>= 1;
        }
        return res;
    }
}