---
title: 数位DP
subtitle: Digit DP
keywords: [数位DP, Digit DP, shuweidp, swdp]
description: 按数位拆分状态，统计满足条件的数的数量
tags: [动态规划, 数位dp, 状态压缩]
---

:::leetcode
[600. 不含连续1的非负整数](https://leetcode.cn/problems/non-negative-integers-without-consecutive-ones/)

[6151. 统计特殊整数](https://leetcode.cn/problems/count-special-integers/) 

[1012. 至少有 1 位重复的数字](https://leetcode.cn/problems/numbers-with-repeated-digits/)
:::

-   `i`: 当前的数位（从左往右，0 代表最高位）
-   `mask`: 已经使用的数字 -> 状态压缩
-   `isLimit`: 是否受到上界限制
-   `isNum`: 是否已经确定是一个数字（前导 0）


**初始化**：`f(0, 0, true, false)`

