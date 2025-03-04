/*Find the Magic Number

a. Ask the user to think of a number n between 1 to 100
b. Then check with the user if the number is less then n/2 or greater
c. Repeat till the Magic Number is reached.*/

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Think of a number between 1 and 100.");
console.log("I will guess it by asking a few questions.");

let low = 1,
  high = 100;

function findMagicNumber() {
  if (low > high) {
    console.log("Something went wrong! Please try again.");
    rl.close();
    return;
  }

  let mid = Math.floor((low + high) / 2);

  rl.question(`Is your number ${mid}? (yes/no) `, (answer) => {
    if (answer.toLowerCase() === "yes") {
      console.log(`Yay! Your magic number is ${mid}.`);
      rl.close();
    } else {
      rl.question(
        `Is your number greater than ${mid}? (yes/no) `,
        (isGreater) => {
          if (isGreater.toLowerCase() === "yes") {
            low = mid + 1; // Search in the upper half
          } else {
            high = mid - 1; // Search in the lower half
          }
          findMagicNumber(); // Recursively call the function
        }
      );
    }
  });
}

// Start the magic number search
findMagicNumber();
