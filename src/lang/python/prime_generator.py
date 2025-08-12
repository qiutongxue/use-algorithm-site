def primes_in(n: int) -> list[int]:
    primes = []
    vis = [False] * (n + 1)
    for i in range(2, n + 1):
        if vis[i]:
            continue
        primes.append(i)
        for j in range(i * i, n + 1, i):
            vis[j] = True
    return primes
