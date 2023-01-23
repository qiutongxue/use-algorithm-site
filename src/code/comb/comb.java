static int size = 100000; 
static int MOD = (int) 1e9 + 7;
static long[] fac, inv; // fac[i] 为 i!，inv[i] 表示 fac[i] 的乘法逆元
// 初始化，计算 fac 和 inv
static void initialize(int size) {
    fac = new long[size + 1]; inv = new long[size + 1];
    fac[0] = inv[0] = 1;
    for (int i = 1; i <= size; i++) {
        fac[i] = fac[i-1] * i % MOD;
        // 快速幂计算乘法逆元
        inv[i] = fastPow(fac[i], MOD - 2);
    }
}

// 计算 C(n, k)
long comb(int n, int k) {
    // n! / (k! * (n-k)!)
    return fac[n] * inv[k] % MOD * inv[n-k] % MOD;
}

static long fastPow(long a, long b) {
    // int MOD = 1000000007;
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