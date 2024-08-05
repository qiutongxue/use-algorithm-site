// 数位 dp
fn f(
    i: usize,
    mask: usize,
    is_limit: bool,
    is_num: bool,
    s: &[u8],
    memo: &mut Vec<Vec<i32>>,
) -> i32 {
    if i == s.len() {
        return is_num as i32;
    }

    if !is_limit && is_num && memo[i][mask] != -1 {
        return memo[i][mask];
    }

    let mut res = 0;

    if !is_num {
        res += f(i + 1, mask, false, false); // 可以跳过当前数位
    }

    let up = if !is_limit { 9 } else { s[i] - b'0' };

    for d in (!is_num as u8)..=up {
        if mask && (1 << d) == 0 {
            res += f(i + 1, mask | (1 << d), is_limit && d == up, true, s, memo);
        }
    }

    if !is_limit && is_num {
        memo[i][mask] = res;
    }

    res
}
