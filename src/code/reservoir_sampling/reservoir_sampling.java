import java.util.Random;

class ReservoirSampling {

    /**
     * 按照水塘抽样从 nums 数组中随机抽取 k 个数，每个数被抽到的概率相同
     * 
     * @params nums 待抽取数据
     * @params k 抽取的样本数
     * @return 返回抽取样本
     */
    static int[] calc(int[] nums, int k) {
        int[] res = new int[k];
        Random r = new Random();
        for (int i = 0; i < k; i++) {
            res[i] = nums[i];
        }
        for (int i = k; i < nums.length; i++) {
            int t = r.nextInt(i + 1);
            // 抽到了
            if (t < k) {
                res[t] = nums[i];
            }
        }
        return res;
    }
}