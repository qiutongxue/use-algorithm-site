package algo

type UnionFind struct {
	parent []int
	size   []int
	groups int
}

func NewUnionFind(n int) *UnionFind {
	parent := make([]int, n)
	size := make([]int, n)
	for i := range n {
		parent[i] = i
		size[i] = 1
	}
	return &UnionFind{
		parent: parent,
		size:   size,
		groups: n,
	}
}

func (this *UnionFind) Find(x int) int {
	if this.parent[x] != x {
		this.parent[x] = this.Find(this.parent[x])
	}
	return this.parent[x]
}

func (this *UnionFind) Union(x, y int) {
	rx, ry := this.Find(x), this.Find(y)
	if rx == ry {
		return
	}
	this.groups--
	if this.size[rx] > this.size[ry] {
		rx, ry = ry, rx
	}
	this.parent[rx] = ry
	this.size[ry] += this.size[rx]
}

func (this *UnionFind) IsUnion(x, y int) bool {
	return this.Find(x) == this.Find(y)
}

func (this *UnionFind) Groups() int {
	return this.groups
}
