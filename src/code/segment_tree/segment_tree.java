class SegmentTree {
    private int[] tree, nums, lazy;
    final int UNUSE = 0; // 注意这里，如果是区间赋值，UNUSE 需要保证一定不能等于区间赋值！
    public SegmentTree(int[] nums) {
        int n = nums.length;
        tree = new int[4*n];
        lazy = new int[4*n];    // lazy tag
        Arrays.fill(lazy, UNUSE);
        this.nums = nums;
        buildTree(0, 0, n-1);
    }

    /**
    * 构建线段树
    * @param node 当前节点对应到 tree 的下标
    * @param start 当前节点对应的 nums 区间起点
    * @param end 当前节点对应的 nums 区间终点
    */
    private void buildTree(int node, int start, int end) {
        if (start == end) {
            tree[node] = nums[start];
            return;
        }
        int mid = start + (end - start) / 2;
        int leftNode  = node * 2 + 1;
        int rightNode = node * 2 + 2;

        buildTree(leftNode, start, mid);
        buildTree(rightNode, mid+1, end);

        tree[node] = tree[leftNode] + tree[rightNode];
    }

    private void pushDown(int node, int start, int end) {
        if (lazy[node] == UNUSE) {
            return;
        }
        int leftNode = node * 2 + 1;
        int rightNode = node * 2 + 2;
        int mid = start + (end - start) / 2;
        
    	// 如果方案为区间增值，把下面四个 = 改成 += 即可
        tree[leftNode] = lazy[node] * (mid - start + 1);
        lazy[leftNode] = lazy[node];
        tree[rightNode] = lazy[node] * (end - mid);
        lazy[rightNode] = lazy[node];
        // 清空当前 lazy tag
        lazy[node] = UNUSE;
    }
    
    /**
    * 更新线段树
    * @param node 当前节点对应到 tree 的下标
    * @param start 当前节点对应的 nums 区间起点
    * @param end 当前节点对应的 nums 区间终点
    * @param left 待更新的 nums 左端点
    * @param right 待更新的 nums 右端点
    * @param val 区间设定的值
    */
    private void updateTree(int node, int start, int end, int left, int right, int val) {
        // 当前节点被区间完全覆盖，更新节点并设置 lazy tag，这样就没必要向下更新了
        if (left <= start && end <= right) {
            // 如果方案为区间增值，把下面两个 = 改成 += 即可
            tree[node] = (end - start + 1) * val;  
            lazy[node] = val;   
            return;
        }

        // 把当前节点的 lazy tag 传递到下一层
        pushDown(node, start, end);

        int mid = start + (end - start) / 2;
        int leftNode = 2 * node + 1;
        int rightNode = 2 * node + 2;

        // 需要更新左子树
        if (left <= mid) {
            updateTree(leftNode, start, mid, left, right, val);
        } 
        // 需要更新右子树
        if (right > mid) {
            updateTree(rightNode, mid+1, end, left, right, val);
        } 
        // 更新当前节点
        tree[node] = tree[leftNode] + tree[rightNode];
    }

    /** 
    * 查询线段树
    * @param node 当前节点对应到 tree 的下标
    * @param start 当前节点对应的 nums 区间起点
    * @param end 当前节点对应的 nums 区间终点
    * @param left 待查询的 nums 区间起点
    * @param right 待查询的 nums 区间终点
    */
    private int queryTree(int node, int start, int end, int left, int right) {
        // 查找范围不在当前范围内
        if (right < start || left > end) {
            return 0;
        }
        // 当前范围就在查找范围中，直接返回
        if (start >= left && end <= right) {
            return tree[node];
        }
        
        // 部分范围在查找区间中，先把 lazy tag 传下去
        pushDown(node, start, end);

        int mid = start + (end - start) / 2;
        int leftNode = 2 * node + 1;
        int rightNode = 2 * node + 2;
        int leftSum = queryTree(leftNode, start, mid, left, right);
        int rightSum = queryTree(rightNode, mid+1, end, left, right);
        return leftSum + rightSum;
    }

    /**
    * 更新 nums 下标的值
    * @param index 对应的 nums 下标
    * @param val 更新的值
    */
    public void update(int index, int val) {
        updateTree(0, 0, nums.length-1, index, index, val);	
    }

    /**
     * 区间更改
     * @param left nums 左端点
     * @param right nums 右端点
     * @param val 设定的值
     */
    public void update(int left, int right, int val) {
        updateTree(0, 0, nums.length - 1, left, right, val);
    }
    
    /**
    * 查询 nums 的区间和
    * @param left 区间起点
    * @param right 区间终点
    */
    public int query(int left, int right) {
        return queryTree(0, 0, nums.length-1, left, right);
    }
}