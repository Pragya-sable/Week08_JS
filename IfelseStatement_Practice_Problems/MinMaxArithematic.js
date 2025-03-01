/*Enter 3 Numbers do following arithmetic operation and find the one that
is maximum and minimum
1. a + b * c            3. c + a / b
2. a % b + c            4. a * b + c*/

const a = parseFloat(process.argv[2]);
const b = parseFloat(process.argv[3]);
const c = parseFloat(process.argv[4]);

if (isNaN(a) || isNaN(b) || isNaN(c)) {
  console.log("Please enter three valid numbers.");
  process.exit(1);
}

const results = {
  "a + b * c": a + b * c,
  "a % b + c": b !== 0 ? (a % b) + c : NaN,
  "c + a / b": b !== 0 ? c + a / b : NaN,
  "a * b + c": a * b + c,
};

const validResults = Object.entries(results).filter(
  ([_, value]) => !isNaN(value)
);
const maxOperation = validResults.reduce((max, curr) =>
  curr[1] > max[1] ? curr : max
);
const minOperation = validResults.reduce((min, curr) =>
  curr[1] < min[1] ? curr : min
);

console.log("Results:", results);
console.log("Maximum:", maxOperation[0], "=", maxOperation[1]);
console.log("Minimum:", minOperation[0], "=", minOperation[1]);
