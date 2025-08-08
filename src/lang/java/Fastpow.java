
class Fastpow {

    public static long fastpow(long a, long b, long MOD) {
        long base = a % MOD, res = 1;
        while (b != 0) {
            if ((b & 1) == 1) {
                res = res * base % MOD;
            }
            base = base * base % MOD;
            b >>>= 1;
        }
        return res % MOD;
    }

    public static long fastpow(long a, long b) {
        int MOD = (int) 1e9 + 7;
        return fastpow(a, b, MOD);
    }
}
