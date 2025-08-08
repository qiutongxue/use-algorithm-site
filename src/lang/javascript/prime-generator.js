function primesIn(n) {
	const vis = new Array(n + 1).fill(false);
	const primes = [];
	for (let i = 2; i <= n; i++) {
		if (vis[i]) continue;
		primes.push(i);
		for (let j = i * i; j <= n; j += i) vis[j] = true;
	}
	return primes;
}
