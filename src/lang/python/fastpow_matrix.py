MOD = 10**9 + 7


def matrix_mul(a: list[list[int]], b: list[list[int]]) -> list[list[int]]:
    m, p, n = len(a), len(a[0]), len(b[0])
    result = [[0] * n for _ in range(m)]
    for i in range(m):
        for j in range(n):
            total = 0
            for k in range(p):
                total += a[i][k] * b[k][j] % MOD
            result[i][j] = total % MOD
    return result


def matrix_fast_pow(matrix: list[list[int]], power: int) -> list[list[int]]:
    size = len(matrix)
    result = [[1 if i == j else 0 for j in range(size)] for i in range(size)]
    base = matrix

    while power > 0:
        if power & 1:
            result = matrix_mul(result, base)
        base = matrix_mul(base, base)
        power >>= 1

    return result
