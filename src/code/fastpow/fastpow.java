long fastPow(long a, long b) {
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