function useSimpleSegmentTree<T>(
  inputArray: T[],
  operation: (a: T, b: T) => T,
  operationFallback: T
) {
  const operate = operation
  const fallback = operationFallback
  const array = [...inputArray]
  const n = array.length

  const getLeftNode = (node: number) => node * 2 + 1
  const getRightNode = (node: number) => node * 2 + 2
  const getMid = (left: number, right: number) => Math.trunc((left + right) / 2)

  const getInfo = (node: number, start: number, end: number) => {
    return {
      mid: getMid(start, end),
      leftNode: getLeftNode(node),
      rightNode: getRightNode(node),
    }
  }

  function initTree(array: T[]) {
    let treeLength
    const length = array.length
    if (Number.isInteger(Math.log2(length))) {
      // 正好占据完美二叉树的所有叶子节点
      treeLength = 2 * length - 1
    } else {
      const pow = Math.ceil(Math.log2(length))
      treeLength = 2 * 2 ** pow - 1
    }
    return new Array(treeLength).fill(fallback)
  }

  const tree: T[] = initTree(array)

  function buildTree(node: number, start: number, end: number) {
    if (start === end) {
      tree[node] = array[start]
      return
    }
    const { mid, leftNode, rightNode } = getInfo(node, start, end)

    buildTree(leftNode, start, mid)
    buildTree(rightNode, mid + 1, end)

    tree[node] = operate(tree[leftNode], tree[rightNode])
  }

  buildTree(0, 0, n - 1)

  function updateTree(
    node: number,
    start: number,
    end: number,
    index: number,
    value: T
  ) {
    if (start === end && index === start) {
      tree[node] = value
      return
    }
    const { mid, leftNode, rightNode } = getInfo(node, start, end)

    if (index <= mid) {
      updateTree(leftNode, start, mid, index, value)
    } else {
      updateTree(rightNode, mid + 1, end, index, value)
    }

    tree[node] = operate(tree[leftNode], tree[rightNode])
  }

  function queryTree(
    node: number,
    start: number,
    end: number,
    left: number,
    right: number
  ): T {
    if (right < start || left > end) {
      return fallback
    }
    if (left <= start && end <= right) {
      return tree[node]
    }

    const { mid, leftNode, rightNode } = getInfo(node, start, end)

    const leftResult = queryTree(leftNode, start, mid, left, right)
    const rightResult = queryTree(rightNode, mid + 1, end, left, right)

    return operate(leftResult, rightResult)
  }

  const query = (left: number, right: number) => {
    if (left > right || left < 0 || right >= n) {
      throw new Error('left 或 right 超出了范围')
    }
    return queryTree(0, 0, n - 1, left, right)
  }

  const update = (index: number, value: T) => {
    if (index < 0 || index >= n) {
      throw new Error('index 超出了数组范围')
    }
    updateTree(0, 0, n - 1, index, value)
  }

  return {
    update,
    query,
  }
}
