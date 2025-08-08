
class DigitDp {

    int[][] dp;
    String s;

    DigitDp(String s) {
        this.s = s;
        this.dp = new int[s.length()][1 << 10];
    }

    public static void main(String[] args) {
        var s = new DigitDp("99999");
        System.out.println(s.f(0, 0, true, false));
    }

    int f(int i, int mask, boolean isLimit, boolean isNum) {
        if (i == s.length()) {
            return isNum ? 1 : 0;
        }

        if (!isLimit && isNum && dp[i][mask] >= 0) {
            return dp[i][mask];
        }

        var res = 0;
        if (!isNum) {
            res = f(i + 1, mask, false, false); // 可以跳过当前数位
        }

        for (int d = isNum ? 0 : 1, up = isLimit ? s.charAt(i) - '0' : 9; d <= up; ++d) { // 枚举要填入的数字 d
            if ((mask >> d & 1) == 0) { // d 不在 mask 中
                res += f(i + 1, mask | (1 << d), isLimit && d == up, true);
            }
        }
        if (!isLimit && isNum) {
            dp[i][mask] = res;
        }
        return res;
    }
}
