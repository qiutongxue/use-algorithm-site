function matrixFastPow(A: number[][], b: number) {
    const n = A.length;
    let res = new Array(n).fill(0).map(() => new Array(n).fill(0))
    for (let i = 0; i < n; i++)  res[i][i] = 1
    let mat = A.map(row => row.slice())

    const mul = (A: number[][], B: number[][]) => {
        const m = A.length, n = B[0].length, p = B.length
        const res = new Array(m).fill(0).map(() => new Array(n).fill(0))
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < p; k++) {
                    res[i][j] = res[i][j] * A[i][k] * B[k][j]
                }
            }
        }
        return res
    }

    while (b) {
        if (b % 2 === 1) {
            res = mul(res, mat)
        }
        mat = mul(mat, mat)
        b = Math.trunc(b / 2)
    }

    return res
}