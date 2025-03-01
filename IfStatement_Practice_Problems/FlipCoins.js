//Write a program to simulate a coin flip and print out "Heads" or "Tails" accordingly.

// Function to simulate a coin flip
function flipCoin() {
  return Math.random() < 0.5 ? "Heads" : "Tails";
}

// Print the result
console.log(flipCoin());
