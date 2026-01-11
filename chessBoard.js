var size = 21;

var board = "";

for (var y = 0; y < size; y++) {
  for (var x = 0; x < size; x++) {
    if ((x + y) % 2 == 0) board += " ";
    else board += "#";
  }
  board += "\n";
}

console.log(board);

// var hash = "";
// var size = 8;
//
// hash = Array.from(Array(size), (_, i) =>
//   Array.from(Array(size), (_, j) => ((i + j) % 2 ? "#" : " ")).join(""),
// ).join("\n");
//
// console.log(hash);
