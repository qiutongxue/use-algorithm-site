export function reservoirSampling(nums, k) {
    const res = new Array(k).fill(0)
    for (let i = 0; i < k; i++) res[i] = nums[i]
    for (let i = k; i < nums.length; i++) {
        const t = Math.trunc(Math.random() * (i + 1))
        if (t < k) res[t] = nums[i]
    }
    return res
}
