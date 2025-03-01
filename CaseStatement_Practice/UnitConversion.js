/*Write a program that takes User Inputs and does Unit Conversion of

different Length units
1. Feet to Inch 3. Inch to Feet
2. Feet to Meter 4. Meter to Feet*/

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Choose conversion:");
console.log("1. Feet to Inch");
console.log("2. Feet to Meter");
console.log("3. Inch to Feet");
console.log("4. Meter to Feet");

rl.question("Enter your choice (1-4): ", function (choice) {
  rl.question("Enter the value to convert: ", function (value) {
    value = parseFloat(value);
    let result;

    switch (parseInt(choice, 10)) {
      case 1:
        result = value * 12;
        console.log(`${value} Feet = ${result} Inches`);
        break;
      case 2:
        result = value * 0.3048;
        console.log(`${value} Feet = ${result} Meters`);
        break;
      case 3:
        result = value / 12;
        console.log(`${value} Inches = ${result} Feet`);
        break;
      case 4:
        result = value / 0.3048;
        console.log(`${value} Meters = ${result} Feet`);
        break;
      default:
        console.log("Invalid choice. Please enter a number between 1 and 4.");
    }
    rl.close();
  });
});
