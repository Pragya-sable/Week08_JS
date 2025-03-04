function getPrimeFactors(n) {
  let factors = [];

  // Step 1: Divide n by 2 until it's odd
  while (n % 2 === 0) {
    factors.push(2);
    n = n / 2;
  }

  // Step 2: Check for odd factors from 3 to sqrt(n)
  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n = n / i;
    }
  }

  // Step 3: If n is still greater than 2, it's a prime number
  if (n > 2) {
    factors.push(n);
  }

  return factors;
}

// Example Usage
let number = 84; // Change this number to test
let primeFactors = getPrimeFactors(number);

console.log(`Prime factors of ${number}:`, primeFactors);
