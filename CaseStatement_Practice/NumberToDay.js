//Read a Number and Display the week day (Sunday, Monday,...)

const dayNumber = parseInt(process.argv[2], 10);

if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
  console.log("Please enter a number between 1 and 7.");
  process.exit(1);
}

switch (dayNumber) {
  case 1:
    console.log("Sunday");
    break;
  case 2:
    console.log("Monday");
    break;
  case 3:
    console.log("Tuesday");
    break;
  case 4:
    console.log("Wednesday");
    break;
  case 5:
    console.log("Thursday");
    break;
  case 6:
    console.log("Friday");
    break;
  case 7:
    console.log("Saturday");
    break;
}
