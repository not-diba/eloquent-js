/*
 * LOOPING A TRIANGLE - Eloquent JS Chapter 2
 *
 * KEY CONCEPTS:
 * - for loops: initialize, condition, increment
 * - String.repeat(n): repeats a string n times
 *
 * The goal is to print a triangle of hash characters:
 * #
 * ##
 * ###
 * ...
 */

// Solution 1: Using String.repeat()
let i;
for (i = 0; i <= 7; i++) {
  console.log("#".repeat(i));
}

// Solution 2: Using string concatenation (traditional approach)
let hash = "";
for (let j = 0; j < 7; j++) {
  hash += "#";
  console.log(hash);
}

// Solution 3: Using while loop
let row = "#";
while (row.length <= 7) {
  console.log(row);
  row += "#";
}

/*
 * ADDITIONAL EXAMPLES:
 */

// Example: Print an inverted triangle
console.log("\nInverted triangle:");
for (let k = 7; k > 0; k--) {
  console.log("#".repeat(k));
}

// Example: Print a right-aligned triangle
console.log("\nRight-aligned triangle:");
const size = 7;
for (let m = 1; m <= size; m++) {
  console.log(" ".repeat(size - m) + "#".repeat(m));
}
