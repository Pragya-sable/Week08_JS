/*Write a program that computes a factorial of a number taken as input.

5 Factorial – 5! = 1 * 2 * 3 * 4 * 5*/
const num = parseInt(process.argv[2], 10); // Read input from command line

if (isNaN(num) || num < 0) {
  console.log("Please enter a valid non-negative integer.");
} else {
  function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  console.log(`${num}! = ${factorial(num)}`);
}
