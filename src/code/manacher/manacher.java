class Manacher {

    static int[] manacher(String s) {
        char[] c = new char[s.length() * 2 + 1];
        int n = c.length, _i = 1;
        c[0] = '#';
        for (char ch : s.toCharArray()) {
            c[_i++] = ch;
            c[_i++] = '#';
        }
        int[] dp = new int[n];
        for (int i = 0, l = 0, r = -1; i < n; i++) {
            int k = i > r ? 1 : Math.min(dp[l + r - i], r - i + 1);
            // 朴素的中心扩散法
            while (0 <= i - k && i + k < n && c[i - k] == c[i + k])
                k++;
            dp[i] = k--;
            // 更新 l,r
            if (i + k > r) {
                r = i + k;
                l = i - k;
            }
        }
        return dp;
    }
    // 实际情况长度 = dp[i] - 1
    /*
     * 求最长回文子串：
     * for (int d : dp) res = Math.max(res, d - 1);
     */

    /*
     * 求所有回文串个数：
     * for (int d : dp) {
     * int t = d - 1;
     * res += t / 2 + t % 2;
     * }
     */
}
