/*Write a program to compute Factors of a number N using prime factorization method.

Logic -> Traverse till i*i <= N instead of i <= N for efficiency.
O/P -> Print the prime factors of number N.*/

const num = parseInt(process.argv[2], 10); // Read input from command line

if (isNaN(num) || num < 2) {
  console.log("Please enter a valid number (≥2).");
} else {
  function primeFactors(n) {
    let factors = [];

    // Step 1: Divide n by 2 while it's even
    while (n % 2 === 0) {
      factors.push(2);
      n = n / 2;
    }

    // Step 2: Check odd numbers from 3 to sqrt(n)
    for (let i = 3; i * i <= n; i += 2) {
      while (n % i === 0) {
        factors.push(i);
        n = n / i;
      }
    }

    // Step 3: If n is a prime number greater than 2, add it to factors
    if (n > 2) {
      factors.push(n);
    }

    return factors;
  }

  console.log(`Prime factors of ${num}: ${primeFactors(num).join(", ")}`);
}
