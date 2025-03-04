function getRandomNumber() {
  return Math.floor(Math.random() * (999 - 100 + 1)) + 100; // Generates a 3-digit number
}

function findSecondLargestAndSmallest(arr) {
  let largest = -Infinity,
    secondLargest = -Infinity;
  let smallest = Infinity,
    secondSmallest = Infinity;

  for (let num of arr) {
    // Finding the largest and second largest
    if (num > largest) {
      secondLargest = largest;
      largest = num;
    } else if (num > secondLargest && num !== largest) {
      secondLargest = num;
    }

    // Finding the smallest and second smallest
    if (num < smallest) {
      secondSmallest = smallest;
      smallest = num;
    } else if (num < secondSmallest && num !== smallest) {
      secondSmallest = num;
    }
  }

  return { secondLargest, secondSmallest };
}

// Step a & b: Generate 10 random 3-digit numbers and store them in an array
let numbers = Array.from({ length: 10 }, getRandomNumber);
console.log("Generated numbers:", numbers);

// Step c: Find 2nd largest and 2nd smallest number
let { secondLargest, secondSmallest } = findSecondLargestAndSmallest(numbers);

console.log("Second Largest Number:", secondLargest);
console.log("Second Smallest Number:", secondSmallest);
