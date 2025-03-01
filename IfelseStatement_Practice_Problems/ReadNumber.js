/*Read a Number 1, 10, 100, 1000, etc and display unit, ten, hundred,...*/

const number = parseInt(process.argv[2], 10);

if (isNaN(number) || number < 1) {
  console.log("Please enter a valid positive number (1, 10, 100, 1000, etc.).");
  process.exit(1);
}

const placeValues = {
  1: "Unit",
  10: "Ten",
  100: "Hundred",
  1000: "Thousand",
  10000: "Ten Thousand",
  100000: "Lakh",
  1000000: "Ten Lakh",
  10000000: "Crore",
  100000000: "Ten Crore",
};

console.log(placeValues[number] || "Invalid Input");
