class Comb:
    def __init__(self, size: int):
        self.MOD = 10**9 + 7
        self.fac = [1] * (size + 1)
        self.inv = [1] * (size + 1)
        self._init(size)

    def _fast_pow(self, a: int, n: int) -> int:
        res = 1
        base = a % self.MOD
        while n > 0:
            if n & 1:
                res = (res * base) % self.MOD
            base = (base * base) % self.MOD
            n >>= 1
        return res

    def _init(self, size: int):
        for i in range(1, size + 1):
            self.fac[i] = self.fac[i - 1] * i % self.MOD
            self.inv[i] = self._fast_pow(self.fac[i], self.MOD - 2)

    def comb(self, n: int, k: int) -> int:
        if k < 0 or k > n:
            return 0
        return (self.fac[n] * self.inv[k] % self.MOD) * self.inv[n - k] % self.MOD
