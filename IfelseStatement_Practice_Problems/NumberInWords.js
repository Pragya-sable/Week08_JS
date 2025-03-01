//Read a single digit number and write the number in word

const digit = parseInt(process.argv[2], 10);

if (isNaN(digit) || digit < 0 || digit > 9) {
  console.log("Please enter a single digit number (0-9)");
  process.exit(1);
}

const words = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
console.log(words[digit]);
