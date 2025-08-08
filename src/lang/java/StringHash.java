
public class StringHash {

    private final long[] hash;
    private final long[] pow;
    private final int b = 1337;
    private final int mod = 1000000007;

    public StringHash(String s) {
        int n = s.length();
        hash = new long[n + 1];
        pow = new long[n + 1];
        pow[0] = 1;
        for (int i = 0; i < n; i++) {
            hash[i + 1] = (hash[i] * b + s.charAt(i)) % mod;
            pow[i + 1] = pow[i] * b % mod;
        }
    }

    public long hash(int i, int j) {
        return (hash[j] - hash[i] * pow[j - i] % mod + mod) % mod;
    }
}
