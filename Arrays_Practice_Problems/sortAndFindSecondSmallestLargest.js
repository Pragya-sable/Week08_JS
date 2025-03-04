function getRandomNumber() {
  return Math.floor(Math.random() * (999 - 100 + 1)) + 100; // Generates a 3-digit number
}

// Step a & b: Generate 10 random 3-digit numbers and store them in an array
let numbers = Array.from({ length: 10 }, getRandomNumber);
console.log("Generated numbers:", numbers);

// Step c: Sort the array in ascending order
numbers.sort((a, b) => a - b);
console.log("Sorted numbers:", numbers);

// Find the 2nd smallest and 2nd largest elements
let secondSmallest = numbers[1];
let secondLargest = numbers[numbers.length - 2];

console.log("Second Smallest Number:", secondSmallest);
console.log("Second Largest Number:", secondLargest);
