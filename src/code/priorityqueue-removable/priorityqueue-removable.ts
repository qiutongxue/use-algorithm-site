function useRemovablePriorityQueue<T>(compare: Comparator<T> = (a, b) => a === b ? 0 : (a > b ? 1 : -1)) {
    const pq = usePriorityQueue(compare)
    const map = new Map<T, number>()
    let _size = 0

    const removeUnusable = () => {
        while (!pq.isEmpty() && !map.has(pq.peek()!)) {
            pq.pop()
        }
    }

    const del = (e: T) => {
        if (!map.has(e)) {
            return false
        } 
        map.set(e, map.get(e)! - 1)
        if (map.get(e)! <= 0) {
            map.delete(e)
        }
        return true
    }

    const push = (e: T) => {
        pq.push(e)

        map.set(e, (map.get(e) || 0) + 1)
        _size++
    }

    const peek = () => {
        removeUnusable()
        return pq.peek()
    }

    const pop = () => {
        removeUnusable()
        if (pq.isEmpty()) {
            return null
        }
        const res = pq.pop()!
        _size--
        del(res)
        return res
    }

    const remove = (e: T) => {
        const hasElement = del(e)
        if (hasElement) {
            _size--
        }
        return hasElement
    }

    const size = () => _size

    const isEmpty = () => size() === 0

    return { push, pop, isEmpty, size, remove, peek }
}