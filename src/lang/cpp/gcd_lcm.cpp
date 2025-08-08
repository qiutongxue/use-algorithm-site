#include<algorithm>

int lcm(int a, int b) {
    return a * b / __gcd(a, b);
}
