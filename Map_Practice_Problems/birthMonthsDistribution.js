function generateBirthMonths(numIndividuals) {
  let birthMonthMap = {};

  for (let i = 1; i <= 12; i++) {
    birthMonthMap[i] = []; // Initialize an array for each month
  }

  for (let i = 1; i <= numIndividuals; i++) {
    let birthMonth = Math.floor(Math.random() * 12) + 1; // Generate a month (1-12)
    birthMonthMap[birthMonth].push(`Person${i}`);
  }

  return birthMonthMap;
}

// Generate and store birth months for 50 individuals
let birthMonthData = generateBirthMonths(50);

// Print individuals grouped by birth month
console.log("Individuals grouped by Birth Month:");
for (let month in birthMonthData) {
  if (birthMonthData[month].length > 0) {
    console.log(`Month ${month}: ${birthMonthData[month].join(", ")}`);
  }
}
