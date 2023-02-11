---
math: true
---
:::leetcode
[1830. 使字符串有序的最少操作次数](https://leetcode-cn.com/problems/minimum-number-of-operations-to-make-string-sorted/)

[2514. 统计同位异构字符串数目](https://leetcode.cn/problems/count-anagrams/)
:::

我们知道计算组合数的公式：

$$
C_n^k = \cfrac {n!} {k!(n-k)!}
$$

在数很大的情况下需要取模 $MOD = 1e9 + 7$ ，而取模的操作只包含了 `+ - *`，并不能使用 `/`，故需要用到乘法逆元。

**乘法逆元**：

$$
\cfrac b a \equiv b \cdot a^{-1} ~(mod ~m)
$$

即在取模运算中，只要找到一个数 $q$，使 $ a \cdot q \equiv 1 ~(mod ~m)$ ，则有 $\cfrac b a \equiv b \cdot q ~(mod ~m)$ 。计算乘法逆元需要用到费马小定理

**费马小定理**：若 $p$ 是质数，且 $a ~mod~ p \ne 0$， 则有

$$
a ^  {p-1} \equiv 1 ~ (mod ~p)
$$

把模数 $m$ 带入 $p$ 得：

$$
\begin{align*}
a ^ {m-1} &\equiv 1 ~(mod ~m) \\
\lrArr a^{m-1} a^{-1} &\equiv a ^{-1} ~(mod ~m) \\
\lrArr a^{m-2} aa^{-1} &\equiv a^{-1} ~(mod ~m) \\
\lrArr a^{-1} &\equiv a ^{m-2} ~(mod ~m)
\end{align*}
$$

故只需要计算 $a ^{m-2}$ 即可（用快速幂）
