
class GcdLcm {

    /**
     * 求两个数的最大公约数
     *
     * @param a 待求的一个数
     * @param b 待求的另一个数，不用在意 a 和 b 的大小关系
     * @return a 和 b 的最大公约数
     */
    public static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    /**
     * 求两个数的最小公倍数
     *
     * @param a 待求的一个数
     * @param b 待求的另一个数
     * @return a 和 b 的最小公倍数
     */
    public static int lcm(int a, int b) {
        // a x b = gcd(a, b) * lcm(a, b)
        return a * b / gcd(a, b);
    }
}
