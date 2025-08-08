
class BinaryIndexedTree {

    int[] tree, nums;
    int n;

    public BinaryIndexedTree(int[] nums) {
        n = nums.length;
        this.nums = nums;
        // tree 下标以 1 开始
        tree = new int[n + 1];
        for (int i = 0; i < n; i++) {
            add(i, nums[i]);
        }
    }

    /**
     * 在指定下标增加值
     *
     * @param idx 指定数组下标
     * @param val 要增加的值（不是修改，是增加）
     */
    public final void add(int idx, int val) {
        for (int i = idx + 1; i <= n; i += lowbit(i)) {
            tree[i] += val;
        }
    }

    /**
     * 更新指定下标的值
     *
     * @param idx 指定数组下标
     * @param val 要更新的值
     */
    public void update(int idx, int val) {
        add(idx, val - nums[idx]);
        nums[idx] = val;
    }

    /**
     * 查找前缀和
     *
     * @param idx 查询的右端点
     * @return nums[0:idx] 的和
     */
    public int query(int idx) {
        int res = 0;
        for (int i = idx + 1; i > 0; i -= lowbit(i)) {
            res += tree[i];
        }
        return res;
    }

    /**
     * 查询[left, right]区间和
     *
     * @param left  左端点（闭）
     * @param right 右端点（闭）
     */
    public int query(int left, int right) {
        return query(right) - query(left - 1);
    }

    private int lowbit(int x) {
        return x & -x;
    }
}
