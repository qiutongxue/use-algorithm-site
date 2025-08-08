
class FastpowMatrix {

    private static final int MOD = (int) 1e9 + 7;

    /**
     * 矩阵乘法运算 A(m*p) * B(p*n)
     */
    private static int[][] mul(int[][] A, int[][] B) {
        int m = A.length, n = B[0].length, p = B.length;
        int[][] res = new int[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                for (int k = 0; k < p; k++) {
                    res[i][j] = (int) ((1L * res[i][j] + 1L * A[i][k] * B[k][j]) % MOD);
                }
            }
        }
        return res;
    }

    /**
     * 矩阵快速幂，传入的矩阵必须是方阵，计算 A^b
     */
    public static int[][] calc(int[][] A, int b) {
        int n = A.length;
        int[][] mat = new int[n][n], res = new int[n][n];
        // res 初始化为单位矩阵
        for (int i = 0; i < n; i++) {
            res[i][i] = 1;
        }
        // mat 克隆 A
        for (int i = 0; i < n; i++) {
            System.arraycopy(A[i], 0, mat[i], 0, n);
        }
        // 代入常规的快速幂中
        while (b != 0) {
            if ((b & 1) == 1) {
                res = mul(res, mat);
            }
            mat = mul(mat, mat);
            b >>>= 1;
        }
        return res;
    }

}
