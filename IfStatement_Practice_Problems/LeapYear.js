/*Write a program that takes a year as input and outputs the Year is a Leap Year or not
a Leap Year. A Leap Year checks for 4 Digit Number, Divisible by 4 and not 100 unless
divisible by 400.*/

const year = parseInt(process.argv[2], 10);

if (year >= 1000 && year <= 9999) {
  // Check for a 4-digit number
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    console.log(year + " is a Leap Year");
  } else {
    console.log(year + " is not a Leap Year");
  }
} else {
  console.log("Please enter a valid 4-digit year");
}
