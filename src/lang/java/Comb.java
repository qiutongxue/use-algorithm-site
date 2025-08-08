
class Comb {

    long[] fac;
    long[] inv;
    int MOD = (int) 1e9 + 7;
    int size;

    public Comb(int size) {
        this.size = size;
        fac = new long[size + 1];
        inv = new long[size + 1];
        fac[0] = inv[0] = 1;
        for (int i = 1; i <= size; i++) {
            fac[i] = fac[i - 1] * i % MOD;
            // 快速幂计算乘法逆元
            inv[i] = fastPow(fac[i], MOD - 2);
        }
    }

    public long comb(int n, int k) {
        if (n > size || k > size) {
            throw new Error("超出范围");
        }
        return fac[n] * inv[k] % MOD * inv[n - k] % MOD;
    }

    private long fastPow(long a, long b) {
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
}
