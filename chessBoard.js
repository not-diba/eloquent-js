/*
 * CHESSBOARD - Eloquent JS Chapter 2
 *
 * KEY CONCEPTS:
 * - Nested loops: outer loop for rows (y), inner loop for columns (x)
 * - Coordinate math: (x + y) % 2 determines alternating pattern
 * - String building: concatenating characters to form output
 *
 * The pattern works because:
 * - When x + y is even: print space
 * - When x + y is odd: print #
 * This creates the checkerboard alternation
 */

// Solution 1: Nested for loops
console.log("=== Solution 1: Nested for loops ===");
var size = 8;
var board = "";

for (var y = 0; y < size; y++) {
  for (var x = 0; x < size; x++) {
    if ((x + y) % 2 == 0) board += " ";
    else board += "#";
  }
  board += "\n";
}
console.log(board);

// Solution 2: Using Array.from() with mapping (functional approach)
// Array.from(Array(n), callback) creates array of length n and maps each element
console.log("=== Solution 2: Functional with Array.from ===");
var hash = Array.from(Array(size), (_, i) =>
  Array.from(Array(size), (_, j) => ((i + j) % 2 ? "#" : " ")).join("")
).join("\n");
console.log(hash);

// Solution 3: Using repeat and ternary
console.log("\n=== Solution 3: Using repeat patterns ===");
let pattern1 = " #".repeat(size / 2);
let pattern2 = "# ".repeat(size / 2);
let board3 = "";
for (let row = 0; row < size; row++) {
  board3 += (row % 2 === 0 ? pattern1 : pattern2) + "\n";
}
console.log(board3);

/*
 * ADDITIONAL EXAMPLES:
 */

// Example: Different characters for the pattern
console.log("=== Custom characters (X and O) ===");
let customBoard = "";
for (let y = 0; y < 4; y++) {
  for (let x = 0; x < 4; x++) {
    customBoard += (x + y) % 2 === 0 ? "X " : "O ";
  }
  customBoard += "\n";
}
console.log(customBoard);

// Example: Visualizing coordinate math
console.log("=== Coordinate (x+y) values ===");
let coordBoard = "";
for (let y = 0; y < 4; y++) {
  for (let x = 0; x < 4; x++) {
    coordBoard += (x + y) + " ";
  }
  coordBoard += "\n";
}
console.log(coordBoard);
console.log("Notice: diagonal lines have same sum!");
