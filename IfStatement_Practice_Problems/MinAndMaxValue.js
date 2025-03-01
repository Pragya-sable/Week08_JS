//Write a program that reads 5 Random 3 Digit values and then outputs the minimum and the maximum value

// Function to generatee a random 3-digit number (100-999)
function getRandomNumber() {
  return Math.floor(Math.random() * 900) + 100;
}

// Generate 5 random numbers
const numbers = Array.from({ length: 5 }, getRandomNumber);

// Find min and max
const min = Math.min(...numbers);
const max = Math.max(...numbers);

// Print result
console.log("Generated numbers:", numbers);
console.log("Minimum value:", min);
console.log("Maximum value:", max);
