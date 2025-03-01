// Write a program that takes day and month from the command line and prints true if day of month is between March 20 and June 20, false otherwise

const day = parseInt(process.argv[2], 10);
const month = parseInt(process.argv[3], 10);

if (isNaN(day) || isNaN(month)) {
  console.log("Please provide valid numeric day and month as arguments.");
  process.exit(1);
}
const isWithinRange =
  (month === 3 && day >= 20) ||
  (month > 3 && month < 6) ||
  (month === 6 && day <= 20);

console.log(isWithinRange);
