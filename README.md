## Smart Maze Game 
A browser-based interactive maze game developed using HTML, CSS and JavaScript with Artificial Intelligence concepts like DFS maze generation, A* Search Algorithm, heuristic pathfinding, and game-state decision logic.
The player manually solves the maze while the AI system can also compute and display the shortest possible path using A* Search

#  AIM
To design and implement an intelligent maze game using Artificial Intelligence concepts such as state-space search, heuristic pathfinding, and decision-making algorithms.
To study the practical application of A* Search Algorithm, maze generation logic, and game playing strategies for solving shortest path problems in real-time interactive systems.

# WORK DONE / PROGRESS
Tools and Technologies Used
•	HTML5
•	CSS3
•	JavaScript (Vanilla JS)
•	Canvas API
•	DOM Manipulation
•	Browser Event Handling
•	A* Search Algorithm
•	DFS Recursive Backtracking
•	Min-Heap Priority Queue
•	Open-source browser deployment

# Algorithms Used
# DFS Recursive Backtracking (Maze Generation)
Purpose:
Used to generate the initial perfect maze.
Logic:
•	Start from one cell
•	Mark it as visited
•	Randomly move to an unvisited neighboring cell
•	Remove walls between connected cells
•	Continue recursively until all cells are visited
•	Backtrack when no unvisited neighbors remain

Result:
A perfect maze with exactly one path between any two cells.

# Braid Maze Logic (Multi-Path Maze)
Purpose:
Used to convert the perfect maze into a multi-path maze.
Logic:
•	After DFS maze generation, remaining internal walls are checked
•	Around 25% of walls are removed randomly
•	This creates loops and multiple valid paths
Result:
The player gets multiple route choices instead of only one path.
Benefit:
Improves gameplay complexity and makes A* Search more meaningful.

# A* Search Algorithm (AI Solver)
Purpose:
Used to calculate the shortest possible path from start to goal.
Heuristic Used:
Manhattan Distance
h(n) = |x1 - x2| + |y1 - y2|
Logic:
•	Every maze cell is treated as a node
•	Open set stores nodes to be explored
•	Closed set stores visited nodes
•	Min-Heap Priority Queue selects node with lowest f(n)
•	Parent tracking reconstructs the final shortest path
Formula Used:
f(n) = g(n) + h(n)
where:
•	g(n) = actual distance travelled
•	h(n) = estimated distance to goal
Result:
A* guarantees the optimal shortest path with minimum number of steps.

# Game Features Implemented
Player Controls
•	Arrow key movement
•	Touch swipe movement for mobile devices
•	Smooth drag and swipe controls
Difficulty Levels
•	Easy (10×10)
•	Medium (15×15)
•	Hard (25×25)
•	Extreme (38×38)
Timer System
Solve Button
Visual Effects

Game Management
•	Start Game
•	Solve Maze
•	Quit Game
•	Play Again system


## CONCLUSION
The Smart Maze Game project successfully demonstrates the practical implementation of Artificial Intelligence using Search Algorithms and Heuristic Problem Solving.

