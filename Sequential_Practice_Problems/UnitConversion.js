/*Use Script & Debug – Unit Conversion

a. 1ft = 12 in then 42 in = ? ft
b. Rectangular Plot of 60 feet x 40 feet in meters
c. Calculate area of 25 such plots in acres*/

// a.Convert 42 inches to feet
let inches = 42;
let feet = inches / 12;
console.log(`42 inches = ${feet.toFixed(2)} feet`);

// b. Convert 60ft x 40ft rectangular plot to meters
let lengthInFeet = 60;
let breathInFeet = 40;
let lengthInMeters = lengthInFeet * 0.3048;
let breadthInMeters = breathInFeet * 0.3048;
console.log(
  `Rectangleplot:${lengthInFeet}ft x ${breathInFeet}ft = ${lengthInMeters.toFixed(
    2
  )}m x ${breadthInMeters.toFixed(2)}m`
);

// c. Calculate the area of 25 such plots in acres
let areaMeters = lengthInMeters * breadthInMeters;
let totalAreaMeters = areaMeters * 25;
let areaAcres = totalAreaMeters / 4046.86;
console.log(
  `Total area of 25 plots: ${totalAreaMeters.toFixed(
    2
  )} square meters = ${areaAcres.toFixed(4)} acres`
);
