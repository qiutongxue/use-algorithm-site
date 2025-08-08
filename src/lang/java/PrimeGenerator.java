
import java.util.ArrayList;

class PrimeGenerator {

    public static int[] primeIn(int n) {
        boolean[] vis = new boolean[n + 1];
        ArrayList<Integer> primes = new ArrayList();
        for (int i = 2; i <= n; i++) {
            if (vis[i]) {
                continue;
            }
            primes.add(i);
            for (int j = i * i; j <= n; j += i) {
                vis[j] = true;
            }
        }
        return primes.stream().mapToInt(Integer::intValue).toArray();
    }
}
