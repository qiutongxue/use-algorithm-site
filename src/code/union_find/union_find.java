class UnionFind {
    int[] parent, size;

    public UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    /**
     * 合并两个节点所在的集合
     * 
     * @param x 待合并的一个节点
     * @param y 待合并的另一个节点
     * @return null
     */
    public boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) { // 在同一个集合中
            return false;
        }
        if (size[rootX] > size[rootY]) { // 按秩合并，优化时间
            int t = rootX;
            rootX = rootY;
            rootY = t;
        }
        parent[rootX] = rootY;
        size[rootY] += size[rootX];
        return true;
    }

    public boolean isUnion(int x, int y) {
        return find(x) == find(y);
    }

    /**
     * 查找根节点
     * 
     * @param x 待查找的节点
     * @return 返回根节点
     */
    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // 路径压缩
        }
        return parent[x];
    }
}