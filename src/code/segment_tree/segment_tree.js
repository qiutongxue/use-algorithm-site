"use strict";
function useSegmentTree(nums) {
    const UNUSE = Symbol('UNUSE');
    const getLeftNode = (node) => node * 2 + 1;
    const getRightNode = (node) => node * 2 + 2;
    const getMid = (left, right) => Math.trunc((left + right) / 2);
    const n = nums.length;
    const tree = new Array(4 * n).fill(0);
    const lazy = new Array(4 * n).fill(UNUSE);
    function buildTree(node, start, end) {
        if (start === end) {
            tree[node] = nums[start];
            return;
        }
        const mid = getMid(start, end);
        const leftNode = getLeftNode(node);
        const rightNode = getRightNode(node);
        buildTree(leftNode, start, mid);
        buildTree(rightNode, mid + 1, end);
        tree[node] = tree[leftNode] + tree[rightNode];
    }
    buildTree(0, 0, n - 1);
    function pushDown(node, start, end) {
        if (lazy[node] === UNUSE)
            return;
        const leftNode = getLeftNode(node);
        const rightNode = getRightNode(node);
        const mid = getMid(start, end);
        // 区间增值的话将以下四个 = 改成 +=
        tree[leftNode] = lazy[node] * (mid - start + 1);
        lazy[leftNode] = lazy[node];
        tree[rightNode] = lazy[node] * (end - mid);
        lazy[rightNode] = lazy[node];
        lazy[node] = UNUSE;
    }
    function updateTree(node, start, end, left, right, val) {
        if (left <= start && end <= right) {
            // 如果方案为区间增值，把下面两个 = 改成 += 即可
            tree[node] = (end - start + 1) * val;
            lazy[node] = val;
            return;
        }
        pushDown(node, start, end);
        const mid = getMid(start, end);
        const leftNode = getLeftNode(node);
        const rightNode = getRightNode(node);
        if (left <= mid) {
            updateTree(leftNode, start, mid, left, right, val);
        }
        if (right > mid) {
            updateTree(rightNode, mid + 1, end, left, right, val);
        }
        tree[node] = tree[leftNode] + tree[rightNode];
    }
    function queryTree(node, start, end, left, right) {
        if (right < start || left > end) {
            return 0;
        }
        if (start >= left && end <= right) {
            return tree[node];
        }
        pushDown(node, start, end);
        const mid = getMid(start, end);
        const leftNode = getLeftNode(node);
        const rightNode = getRightNode(node);
        const leftSum = queryTree(leftNode, start, mid, left, right);
        const rightSum = queryTree(rightNode, mid + 1, end, left, right);
        return leftSum + rightSum;
    }
    function updateByIndex(index, val) {
        updateTree(0, 0, n - 1, index, index, val);
    }
    function updateByInterval(left, right, val) {
        updateTree(0, 0, n - 1, left, right, val);
    }
    function query(left, right) {
        return queryTree(0, 0, n - 1, left, right);
    }
    return {
        updateByIndex,
        updateByInterval,
        query,
    };
}
