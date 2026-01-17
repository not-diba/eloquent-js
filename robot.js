// ============================================================================
// CHAPTER 7: PROJECT - A ROBOT
// ============================================================================
// This chapter builds a delivery robot that picks up and delivers parcels
// in a virtual village. Key concepts covered:
// - Data structures (graphs)
// - State management with immutable objects
// - Different robot strategies (random, route-based, goal-oriented)
// - Algorithm comparison
// ============================================================================

// ============================================================================
// PART 1: THE VILLAGE - Defining the Road Network
// ============================================================================
// The village is represented as a list of roads connecting locations.
// Each road is a string like "A-B" meaning there's a road between A and B.
// This is the RAW DATA that we'll convert into a more useful structure.

const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];

// ============================================================================
// PART 2: BUILDING A GRAPH DATA STRUCTURE
// ============================================================================
// A graph is a collection of nodes (places) connected by edges (roads).
// We convert the roads array into an "adjacency list" - an object where
// each key is a place, and its value is an array of connected places.
//
// Example output:
// {
//   "Alice's House": ["Bob's House", "Cabin", "Post Office"],
//   "Bob's House": ["Alice's House", "Town Hall"],
//   ...
// }

function buildGraph(edges) {
  // Object.create(null) creates an object with NO prototype.
  // This avoids issues with inherited properties like "toString".
  // It's a "pure" dictionary/map.
  let graph = Object.create(null);

  // Helper function to add a one-way connection
  function addEdge(from, to) {
    if (from in graph) {
      // Place already exists, add new destination to its array
      graph[from].push(to);
    } else {
      // First time seeing this place, create new array
      graph[from] = [to];
    }
  }

  // Process each road string:
  // 1. edges.map(r => r.split("-")) turns ["A-B", "C-D"] into [["A","B"], ["C","D"]]
  // 2. Destructuring [from, to] extracts both parts
  // 3. We add BOTH directions because roads are two-way (undirected graph)
  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from); // Roads work both ways!
  }
  return graph;
}

const roadGraph = buildGraph(roads);

// ============================================================================
// PART 3: VILLAGE STATE - Immutable State Management
// ============================================================================
// VillageState represents the current state of the world:
// - Where the robot is (place)
// - Where all parcels are and where they need to go (parcels)
//
// IMPORTANT: This class is IMMUTABLE - move() returns a NEW state
// rather than modifying the existing one. This is a key functional
// programming concept that makes code easier to reason about.

class VillageState {
  constructor(place, parcels) {
    this.place = place; // Where the robot currently is
    this.parcels = parcels; // Array of {place, address} objects
    // place = where the parcel currently is
    // address = where it needs to be delivered
  }

  // Attempt to move to a destination. Returns a NEW VillageState.
  move(destinations) {
    // Can only move to connected places (check if road exists)
    if (!roadGraph[this.place].includes(destinations)) {
      return this; // Invalid move - return unchanged state
    } else {
      // Update parcels:
      // 1. map: Pick up parcels at current location (change their place to destination)
      // 2. filter: Remove delivered parcels (where place equals address)
      let parcels = this.parcels
        .map((p) => {
          // If parcel isn't here, leave it unchanged
          if (p.place != this.place) return p;
          // Parcel is here - it comes with us (robot picks it up)
          return { place: destinations, address: p.address };
        })
        .filter((p) => p.place != p.address); // Remove delivered parcels

      // Return NEW state (immutability!)
      return new VillageState(destinations, parcels);
    }
  }
}

// Example usage (commented out):
// let first = new VillageState("Post Office", [
//   { place: "Post Office", address: "Alice's House" },
// ]);
//
// let next = first.move("Alice's House");
//
// console.log(next.place);    // "Alice's House"
// console.log(next.parcels);  // [] (parcel was delivered!)
// console.log(first.place);   // "Post Office" (original unchanged - immutable!)

// ============================================================================
// PART 4: SIMULATION - Running the Robot
// ============================================================================
// This function runs a robot until all parcels are delivered.
// A "robot" is just a function that takes state + memory and returns
// {direction, memory} - where to go and what to remember.

function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    // Check if done (no more parcels)
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    // Ask robot what to do
    let action = robot(state, memory);
    // Execute the move
    state = state.move(action.direction);
    // Update memory for next turn
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

// ============================================================================
// PART 5: ROBOT STRATEGY #1 - Random Robot
// ============================================================================
// The simplest possible strategy: pick a random connected road.
// This is inefficient but will eventually complete (like a "random walk").

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  // Pick a random neighboring place. No memory needed.
  return { direction: randomPick(roadGraph[state.place]) };
}

// ============================================================================
// PART 6: GENERATING RANDOM TASKS
// ============================================================================
// Static method to create a random starting state with parcels.
// Note: This is added to VillageState as a "static" method (on the class, not instances).

VillageState.random = function (parclCount = 5) {
  let parcels = [];
  for (let i = 0; i < parclCount; i++) {
    // Random destination address
    let address = randomPick(Object.keys(roadGraph));
    let place;
    // Random starting place (but NOT the same as destination - that would be silly!)
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({ place, address });
  }
  // Robot always starts at Post Office
  return new VillageState("Post Office", parcels);
};

// runRobot(VillageState.random(), randomRobot);

// ============================================================================
// PART 7: ROBOT STRATEGY #2 - Route Robot (Fixed Path)
// ============================================================================
// A smarter strategy: follow a predetermined route that visits every location.
// This guarantees all parcels will be picked up and delivered.
// This is like a mail carrier who follows the same route every day.

const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office",
];

function routeRobot(state, memory) {
  // If we've finished the route, start over
  if (memory.length == 0) {
    memory = mailRoute;
  }
  // Go to first place in memory, remember the rest
  return { direction: memory[0], memory: memory.slice(1) };
}

// ============================================================================
// PART 8: PATHFINDING - Breadth-First Search (BFS)
// ============================================================================
// To make a smarter robot, we need to find the shortest path between places.
// BFS explores all neighbors first, then their neighbors, etc.
// This guarantees finding the SHORTEST path in an unweighted graph.
//
// How it works:
// 1. Start with a "work list" containing just the starting point
// 2. For each item, explore all neighbors
// 3. If neighbor is the destination, we're done!
// 4. Otherwise, add neighbor to work list (if not already explored)
// 5. The route is built up as we go

function findRoute(graph, from, to) {
  // Work list: each item tracks current location and route taken to get there
  let work = [{ at: from, route: [] }];

  // Loop through work list (it grows as we explore)
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];

    // Check all neighbors of current location
    for (let place of graph[at]) {
      if (place == to) {
        // Found it! Return the complete route
        return route.concat(place);
      }
      // Avoid revisiting places (prevents infinite loops)
      if (!work.some((w) => w.at == place)) {
        // Add to work list with extended route
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

// ============================================================================
// PART 9: ROBOT STRATEGY #3 - Goal-Oriented Robot
// ============================================================================
// Uses pathfinding to go directly to parcels and their destinations.
// Strategy: Pick first parcel, either go pick it up or deliver it.
// Much more efficient than random or fixed-route approaches!

function goalOrientedRobot({ place, parcels }, route) {
  // If no current route, calculate one
  if (route.length == 0) {
    let parcel = parcels[0]; // Just pick the first parcel
    if (parcel.place != place) {
      // Parcel not with us - go pick it up
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      // We have the parcel - go deliver it
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  // Follow the calculated route
  return { direction: route[0], memory: route.slice(1) };
}

// ============================================================================
// PART 10: COMPARING ROBOT PERFORMANCE
// ============================================================================
// To see which robot is better, we run many simulations and average the results.

// Helper: Count steps without logging (for benchmarking)
function countSteps(state, robot, memory) {
  for (let steps = 0; ; steps++) {
    if (state.parcels.length == 0) return steps;
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}

// Compare two robots over 100 random tasks
function compareRobots(robot1, memory1, robot2, memory2) {
  let total1 = 0,
    total2 = 0;
  for (let i = 0; i < 100; i++) {
    let state = VillageState.random();
    // Both robots get the SAME starting state for fair comparison
    total1 += countSteps(state, robot1, memory1);
    total2 += countSteps(state, robot2, memory2);
  }
  console.log(`Robot 1 needed ${total1 / 100} steps per task`);
  console.log(`Robot 2 needed ${total2 / 100}`);
}

// ============================================================================
// PART 11: ROBOT STRATEGY #4 - Lazy Robot (Optimized)
// ============================================================================
// An improved goal-oriented robot that makes smarter choices:
// - Considers ALL parcels, not just the first one
// - Prefers shorter routes
// - Gives bonus to picking up parcels (better to carry more at once)
// This is a simple heuristic/greedy algorithm.

function lazyRobot({ place, parcels }, route) {
  if (route.length == 0) {
    // Calculate routes for ALL parcels
    let routes = parcels.map((parcel) => {
      if (parcel.place != place) {
        // Route to pick up this parcel
        return {
          route: findRoute(roadGraph, place, parcel.place),
          pickUp: true,
        };
      } else {
        // Route to deliver this parcel
        return {
          route: findRoute(roadGraph, place, parcel.address),
          pickUp: false,
        };
      }
    });

    // Scoring function to rank routes:
    // - Shorter routes score higher (negative length)
    // - Picking up gets a 0.5 bonus (good to carry multiple parcels)
    // Higher score = better choice
    function score({ route, pickUp }) {
      return (pickUp ? 0.5 : 0) - route.length;
    }

    // Pick the route with the highest score
    route = routes.reduce((a, b) => (score(a) > score(b) ? a : b)).route;
  }

  return { direction: route[0], memory: route.slice(1) };
}

// Compare lazyRobot vs goalOrientedRobot
// lazyRobot should perform better on average!
compareRobots(lazyRobot, [], goalOrientedRobot, []);

// ============================================================================
// KEY CONCEPTS SUMMARY:
// ============================================================================
// 1. GRAPHS: Data structure where nodes are connected by edges
//    - Adjacency list: object mapping each node to its neighbors
//
// 2. IMMUTABILITY: State objects don't change; methods return new objects
//    - Makes code predictable and easier to debug
//    - Enables features like undo/time-travel debugging
//
// 3. BREADTH-FIRST SEARCH (BFS): Algorithm to find shortest path
//    - Explores level by level (all neighbors, then their neighbors)
//    - Guarantees shortest path in unweighted graphs
//
// 4. HIGHER-ORDER FUNCTIONS: Robots are functions passed to runRobot
//    - Strategy pattern: swap algorithms without changing simulation code
//
// 5. HEURISTICS: Simple rules that usually give good (not perfect) results
//    - lazyRobot uses scoring heuristic to make decisions
// ============================================================================
