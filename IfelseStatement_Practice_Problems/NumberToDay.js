//Read a Number and Display the week day (Sunday, Monday,...)

const dayNumber = parseInt(process.argv[2], 10);

if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
  console.log("Please enter a number between 1 and 7 ");
  process.exit(1);
}

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

console.log(weekDays[dayNumber - 1]);
