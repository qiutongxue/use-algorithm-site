pub fn gcd(a: i32, b: i32) -> i32 {
    if b == 0 {
        a
    } else {
        gcd(b, a % b)
    }
}

pub fn lcm(a: i32, b: i32) -> i32 {
    a * b / gcd(a, b)
}
