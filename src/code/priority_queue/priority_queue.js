"use strict";
function usePriorityQueue(compare = (a, b) => a === b ? 0 : (a > b ? 1 : -1)) {
    const data = [];
    function getLeftChildIndex(idx) {
        return (idx << 1) + 1;
    }
    function getRightChildIndex(idx) {
        return (idx << 1) + 2;
    }
    function getParentIndex(idx) {
        return (idx - 1) >> 1;
    }
    function swap(x, y) {
        const t = data[x];
        data[x] = data[y];
        data[y] = t;
    }
    function heapifyUp() {
        let curr = data.length - 1;
        let p = getParentIndex(curr);
        while (curr > 0 && compare(data[curr], data[p]) <= 0) {
            swap(curr, p);
            curr = p;
            p = getParentIndex(curr);
        }
    }
    function heapifyDown() {
        let curr = 0;
        while (getLeftChildIndex(curr) < data.length) {
            let next = getLeftChildIndex(curr);
            if (getRightChildIndex(curr) < data.length
                && compare(data[getLeftChildIndex(curr)], data[getRightChildIndex(curr)]) > 0)
                next = getRightChildIndex(curr);
            if (compare(data[curr], data[next]) <= 0)
                break;
            swap(curr, next);
            curr = next;
        }
    }
    function push(e) {
        data.push(e);
        heapifyUp();
    }
    function pop() {
        if (data.length === 0)
            return null;
        if (data.length === 1)
            return data.pop();
        const result = data[0];
        data[0] = data.pop();
        heapifyDown();
        return result;
    }
    const peek = () => data.length ? data[0] : null;
    const size = () => data.length;
    const isEmpty = () => size() === 0;
    return {
        push, pop, size, isEmpty, peek
    };
}
