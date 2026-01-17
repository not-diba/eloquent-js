/*
 * FIZZBUZZ - Eloquent JS Chapter 2
 *
 * KEY CONCEPTS:
 * - Modulo operator (%): returns remainder of division
 * - Conditional statements: if/else if/else
 * - Truthy/falsy values in JavaScript
 * - Short-circuit evaluation with || and &&
 *
 * RULES:
 * - Print "Fizz" for numbers divisible by 3
 * - Print "Buzz" for numbers divisible by 5
 * - Print "FizzBuzz" for numbers divisible by both
 * - Otherwise print the number
 */

// Solution 1: Classic if/else approach (commented in original)
console.log("=== Solution 1: Classic if/else ===");
for (let i = 1; i <= 20; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("FizzBuzz");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}

// Solution 2: Clever one-liner using array indexing
// How it works:
// - ["Fizz"][i % 3] returns "Fizz" when i % 3 === 0, undefined otherwise
// - ["Buzz"][i % 5] returns "Buzz" when i % 5 === 0, undefined otherwise
// - || "" converts undefined to empty string
// - The final || i returns the number if the string is empty
console.log("\n=== Solution 2: Array indexing trick ===");
for (let i = 1; i <= 20; i++) {
  console.log((["Fizz"][i % 3] || "") + (["Buzz"][i % 5] || "") || i);
}

// Solution 3: String concatenation approach
console.log("\n=== Solution 3: String building ===");
for (let i = 1; i <= 20; i++) {
  let output = "";
  if (i % 3 === 0) output += "Fizz";
  if (i % 5 === 0) output += "Buzz";
  console.log(output || i);
}

/*
 * ADDITIONAL EXAMPLES:
 */

// Example: FizzBuzzBang (add "Bang" for multiples of 7)
console.log("\n=== FizzBuzzBang (add 7) ===");
for (let i = 1; i <= 21; i++) {
  let output = "";
  if (i % 3 === 0) output += "Fizz";
  if (i % 5 === 0) output += "Buzz";
  if (i % 7 === 0) output += "Bang";
  console.log(output || i);
}

// Example: Using a mapping object for extensibility
console.log("\n=== Using mapping object ===");
const rules = { 3: "Fizz", 5: "Buzz" };
for (let i = 1; i <= 15; i++) {
  let output = Object.keys(rules)
    .filter((divisor) => i % divisor === 0)
    .map((divisor) => rules[divisor])
    .join("");
  console.log(output || i);
}
