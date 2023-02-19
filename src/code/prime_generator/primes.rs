fn primes_in(n: usize) -> Vec<i32> {
    let mut primes = vec![];
    let mut vis = vec![false; n + 1];
    for i in 2..=n {
        if vis[i] {
            continue;
        }
        primes.push(i as i32);
        for j in (i * i..=n).step_by(i) {
            vis[j] = true;
        }
    }
    primes
}