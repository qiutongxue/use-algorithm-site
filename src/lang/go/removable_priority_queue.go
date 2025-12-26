package algo

type RemovablePriorityQueue[T comparable] struct {
	pq    *PriorityQueue[T]
	exist map[T]int
	size  int
}

func NewRemovablePriorityQueue[T comparable](compare func(a, b T) int) *RemovablePriorityQueue[T] {
	return &RemovablePriorityQueue[T]{
		pq:    NewPriorityQueue(compare),
		exist: make(map[T]int),
		size:  0,
	}
}

func (rpq *RemovablePriorityQueue[T]) removeUnusable() {
	for !rpq.pq.IsEmpty() {
		if peek, ok := rpq.pq.Peek(); ok {
			if _, exists := rpq.exist[peek]; exists {
				break
			}
			rpq.pq.Pop()
		} else {
			break
		}
	}
}

func (rpq *RemovablePriorityQueue[T]) Push(v T) {
	rpq.pq.Push(v)
	rpq.exist[v]++
	rpq.size++
}

func (rpq *RemovablePriorityQueue[T]) Pop() (T, bool) {
	rpq.removeUnusable()

	if rpq.pq.IsEmpty() {
		var zero T
		return zero, false
	}

	res, _ := rpq.pq.Pop()
	rpq.size--
	rpq.del(res)
	return res, true
}

func (rpq *RemovablePriorityQueue[T]) Peek() (T, bool) {
	rpq.removeUnusable()
	return rpq.pq.Peek()
}

func (rpq *RemovablePriorityQueue[T]) Remove(v T) bool {
	if _, exists := rpq.exist[v]; !exists {
		return false
	}

	rpq.del(v)
	rpq.size--
	return true
}

func (rpq *RemovablePriorityQueue[T]) del(v T) {
	if count, exists := rpq.exist[v]; exists {
		if count > 1 {
			rpq.exist[v] = count - 1
		} else {
			delete(rpq.exist, v)
		}
	}
}

func (rpq *RemovablePriorityQueue[T]) Len() int {
	return rpq.size
}

func (rpq *RemovablePriorityQueue[T]) IsEmpty() bool {
	return rpq.size == 0
}
