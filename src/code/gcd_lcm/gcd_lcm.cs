int Gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

int Lcm(int a, int b) {
    return a * b / gcd(a, b);
}