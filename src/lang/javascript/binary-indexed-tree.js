function useBIT(nums) {
	const lowbit = (x) => x & -x;
	const n = nums.length;
	const tree = new Array(n + 1).fill(0);
	for (let i = 0; i < n; i++) add(i, nums[i]);
	function add(idx, val) {
		for (let i = idx + 1; i <= n; i += lowbit(i)) tree[i] += val;
	}
	function update(idx, val) {
		add(idx, val - nums[idx]);
	}
	function query(idx) {
		let res = 0;
		for (let i = idx + 1; i > 0; i -= lowbit(i)) res += tree[i];
		return res;
	}
	function queryByInterval(left, right) {
		return query(right) - query(left - 1);
	}
	return {
		add,
		update,
		query,
		queryByInterval,
	};
}
