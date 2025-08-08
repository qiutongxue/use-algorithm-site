package algo

func NewPriorityQueue[T any](compare func(a, b T) int) *PriorityQueue[T] {
	return &PriorityQueue[T]{compare, []T{}}
}

type PriorityQueue[T any] struct {
	compare func(a, b T) int
	data    []T
}

func (pq *PriorityQueue[T]) heapifyUp() {
	curr := len(pq.data) - 1
	for p := (curr - 1) / 2; curr > 0 && pq.compare(pq.data[curr], pq.data[p]) <= 0; p = (curr - 1) / 2 {
		pq.data[curr], pq.data[p] = pq.data[p], pq.data[curr]
		curr = p
	}
}

func (pq *PriorityQueue[T]) heapifyDown() {
	curr := 0
	for curr<<1+1 < len(pq.data) {
		child := curr<<1 + 1
		if child+1 < len(pq.data) && pq.compare(pq.data[child+1], pq.data[child]) < 0 {
			child++
		}
		if pq.compare(pq.data[child], pq.data[curr]) >= 0 {
			break
		}
		pq.data[curr], pq.data[child] = pq.data[child], pq.data[curr]
		curr = child
	}
}

func (pq *PriorityQueue[T]) Push(v T) {
	pq.data = append(pq.data, v)
	pq.heapifyUp()
}

func (pq *PriorityQueue[T]) Pop() (T, bool) {
	var res T
	if pq.Len() == 0 {
		return res, false
	}
	res = pq.data[0]
	pq.data[0] = pq.data[len(pq.data)-1]
	pq.data = pq.data[:len(pq.data)-1]
	pq.heapifyDown()
	return res, true
}

func (pq *PriorityQueue[T]) Peek() (T, bool) {
	var value T
	if pq.Len() == 0 {
		return value, false
	}
	return pq.data[0], true
}

func (pq *PriorityQueue[T]) Len() int {
	return len(pq.data)
}
