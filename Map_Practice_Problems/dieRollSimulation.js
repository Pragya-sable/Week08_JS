function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function simulateDieRolls() {
  let dieCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  let maxRolls = 10;
  let reachedMax = false;

  while (!reachedMax) {
    let roll = rollDie();
    dieCounts[roll]++;

    // Check if any number reached 10 times
    if (dieCounts[roll] === maxRolls) {
      reachedMax = true;
    }
  }

  console.log("Die Roll Counts:", dieCounts);

  // Finding the number with maximum and minimum occurrences
  let maxNum = Object.keys(dieCounts).reduce((a, b) =>
    dieCounts[a] > dieCounts[b] ? a : b
  );
  let minNum = Object.keys(dieCounts).reduce((a, b) =>
    dieCounts[a] < dieCounts[b] ? a : b
  );

  console.log(
    `Number that appeared the most: ${maxNum} (${dieCounts[maxNum]} times)`
  );
  console.log(
    `Number that appeared the least: ${minNum} (${dieCounts[minNum]} times)`
  );
}

// Run the simulation
simulateDieRolls();
