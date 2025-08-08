function useMask(array: number[], m: number) {
	const nums = [...array];
	const n = nums.length;
	const pow = new Array(n + 1).fill(0).map((_, idx) => m ** idx);

	let data = 0;
	for (let i = n - 1; i >= 0; i--) {
		if (typeof nums[i] !== "number" || nums[i] >= m || nums[i] < 0) {
			throw new Error(
				`数组元素不正确：下标为 ${i} 的值 ${nums[i]}。请确保元素为正整数，且不超过最大进制`,
			);
		}
		data = data * m + nums[i];
	}
	if (data > Number.MAX_SAFE_INTEGER)
		throw new Error("超出最大数字范围，要不还是换个语言吧");

	const get = (index: number) => {
		return nums[index];
	};

	const set = (index: number, val: number) => {
		if (index < 0 || index >= n || val >= m || val < 0) return false;
		const l = Math.trunc(data / pow[index + 1]);
		const r = data % pow[index];
		data = (l * m + val) * pow[index] + r;

		nums[index] = val;
		return true;
	};

	const toArray = () => {
		return [...nums];
	};

	const value = () => data;

	return { get, set, value, toArray };
}
