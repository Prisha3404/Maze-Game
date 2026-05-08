function rand(max) {
  return Math.floor(Math.random() * max);//rand(max)-generates a no between 0-1,math.floor-rounds off to  nearest integer
  }

function shuffle(a) {//This is an implementation of the Fisher–Yates shuffle algorithm, which randomizes the order of elements in an array.
//- The loop starts from the last index (a.length - 1) and moves backward.
//- For each position i, it picks a random index j between 0 and i (inclusive).
//- Then it swaps the elements at positions i and j.
//- By the end, every element has been swapped into a random position, ensuring a fair shuffle

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function changeBrightness(factor, sprite) {
  const virtCanvas = document.createElement("canvas");//create a virtual canvas
  virtCanvas.width = 500;
  virtCanvas.height = 500;
  const context = virtCanvas.getContext("2d");//2D rendering context
  context.drawImage(sprite, 0, 0, 500, 500);//draw the sprite
  const imgData = context.getImageData(0, 0, 500, 500);//access raw pixel data

  for (let i = 0; i < imgData.data.length; i += 4) {//core of brightness adjustment imgData.data-flat array of all RGBA values
    imgData.data[i] *= factor;       // R
    imgData.data[i + 1] *= factor;   // G
    imgData.data[i + 2] *= factor;   // B
  }//i+3= A alpha - transparency Multiply RGB by factor, scale the brightness

  context.putImageData(imgData, 0, 0);//canvas showed the brightened /darkened version of the sprite
  const spriteOutput = new Image();//creates a html <img> element in the memory
  spriteOutput.src = virtCanvas.toDataURL();//makes the <img> display the modified canvas content
  virtCanvas.remove();//Cleans up the temporary canvas element so it doesn’t clutter the DOM
  return spriteOutput;//returns the new <img>element, to use on the page or elsewhere
}

function displayVictoryMess(moves) {
  document.getElementById("moves").innerHTML = "You moved " + moves + " steps.";
  toggleVisibility("Message-Container");
}//Updates the DOM element with id "moves" to show how many steps the player took. Calls toggleVisibility("Message-Container") to show/hide the victory message container.

function toggleVisibility(id) {
  const el = document.getElementById(id);
  el.style.visibility = (el.style.visibility === "visible") ? "hidden" : "visible";
}//- Finds the element by its id. Switches its CSS visibility property between "visible" and "hidden".

// Maze class
function Maze(width, height) {//define dimensions
  let mazeMap;//hold the grid structure of the maze(walls&paths)
  let startCoord, endCoord;//entry and exit point
  const dirs = ["n", "s", "e", "w"];//directions
  const modDir = {//how moving would change coordinates
    n: { y: -1, x: 0, o: "s" },
    s: { y: 1, x: 0, o: "n" },
    e: { y: 0, x: 1, o: "w" },
    w: { y: 0, x: -1, o: "e" }
  };
//retrieve maze grids, start & end coordinates
  this.map = () => mazeMap;
  this.startCoord = () => startCoord;
  this.endCoord = () => endCoord;
//create a new grid , each cell starts with no open walls
  function genMap() {
    mazeMap = new Array(height);
    for (let y = 0; y < height; y++) {
      mazeMap[y] = new Array(width);
      for (let x = 0; x < width; x++) {
        mazeMap[y][x] = { n: false, s: false, e: false, w: false, visited: false, priorPos: null };// directions+backtracking if stuck
      }
/
    }
  }

  function defineMaze() {
    let pos = { x: 0, y: 0 };
    let cellsVisited = 1;
    const numCells = width * height;
////- Starts at the top-left corner (pos = {x:0, y:0}).
//Tracks how many cells have been visited.
//Loops until all cells are visited.
//Marks the current cell as visited.
//Randomizes the direction order (shuffle(dirs)), so the maze is unpredictable.
    while (cellsVisited < numCells) {
      mazeMap[pos.y][pos.x].visited = true;
      shuffle(dirs);

      let moved = false;
      for (let dir of dirs) {
        const nx = pos.x + modDir[dir].x;
        const ny = pos.y + modDir[dir].y;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          if (!mazeMap[ny][nx].visited) {
            //open wall in current cell
            mazeMap[pos.y][pos.x][dir] = true;
            //open opposite wall in neighbour
            mazeMap[ny][nx][modDir[dir].o] = true;
            //remember where we came from
            mazeMap[ny][nx].priorPos = pos;
            pos = { x: nx, y: ny };//move into neighbour
            cellsVisited++;
            moved = true;
            break;
          }
        }
      }
      if (!moved) pos = mazeMap[pos.y][pos.x].priorPos;//backtrack if stuck
    }
  }

  function defineStartEnd() {//randomly chooses one of four corner-to-corner start/end configurations, gives variety
    switch (rand(4)) {
      case 0: startCoord = { x: 0, y: 0 }; endCoord = { x: width - 1, y: height - 1 }; break;
      case 1: startCoord = { x: 0, y: height - 1 }; endCoord = { x: width - 1, y: 0 }; break;
      case 2: startCoord = { x: width - 1, y: 0 }; endCoord = { x: 0, y: height - 1 }; break;
      case 3: startCoord = { x: width - 1, y: height - 1 }; endCoord = { x: 0, y: 0 }; break;
    }
  }

  genMap();
  defineMaze();
  defineStartEnd();
}

// Drawing maze
function DrawMaze(maze, ctx, cellSize, endSprite = null) {
  const map = maze.map();
  let drawEndMethod;

  function drawCell(x, y, cell) {//convert cell coordinates into pixel coordinates
    const px = x * cellSize;
    const py = y * cellSize;
    ctx.strokeStyle = "black";
    ctx.lineWidth = cellSize / 40;

    if (!cell.n) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + cellSize, py); ctx.stroke(); }//if false, draw top wall
    if (!cell.s) { ctx.beginPath(); ctx.moveTo(px, py + cellSize); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke(); }//if false, draw bottom wall
    if (!cell.e) { ctx.beginPath(); ctx.moveTo(px + cellSize, py); ctx.lineTo(px + cellSize, py + cellSize); ctx.stroke(); }//if false, draw right wall
    if (!cell.w) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + cellSize); ctx.stroke(); }//if false, draw left wall
  }

  function drawMap() {//loop through every cell in the maze grid
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        drawCell(x, y, map[y][x]);//for walls
      }
    }
  }

  function drawEndFlag() {
    const coord = maze.endCoord();
    ctx.fillStyle = "red";
    ctx.fillRect(coord.x * cellSize + cellSize / 4, coord.y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
  }//simple red square flag inside the cell

  function clear() {//clear the canvas to avoid overlapping
    ctx.clearRect(0, 0, cellSize * map[0].length, cellSize * map.length);
  }

  drawEndMethod = drawEndFlag;

  clear();//clear the canvas
  drawMap();//draws the maze walls
  drawEndMethod();//marks the end cell

  this.redrawMaze = function(size) {//redraw the maze at a different cell size
    cellSize = size;//keeps the maze consistent
    clear();
    drawMap();
    drawEndMethod();
  };
}

// Player class
function Player(maze, canvas, cellSize, onComplete, sprite = null) {
  const ctx = canvas.getContext("2d");
  let moves = 0;//track the number of moves
  let cellCoords = { x: maze.startCoord().x, y: maze.startCoord().y };//start the player at the starting coordinate
  const player = this;

  function drawSprite(coord) {//yellow circle on current cell
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc((coord.x + 0.5) * cellSize, (coord.y + 0.5) * cellSize, cellSize / 3, 0, 2 * Math.PI);
    ctx.fill();

    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();//checks if the player has reached the end coordinates
    }
  }

  function removeSprite(coord) {//clear the area before redrawing player in a new position
    ctx.clearRect(coord.x * cellSize + 2, coord.y * cellSize + 2, cellSize - 4, cellSize - 4);
  }//prevents overlapping circles

  function check(e) {//MOVEMENT!!!
    const cell = maze.map()[cellCoords.y][cellCoords.x];
    moves++;
    switch (e.keyCode) {
      case 37: if (cell.w) { removeSprite(cellCoords); cellCoords.x--; drawSprite(cellCoords); } break; // left
      case 38: if (cell.n) { removeSprite(cellCoords); cellCoords.y--; drawSprite(cellCoords); } break; // up
      case 39: if (cell.e) { removeSprite(cellCoords); cellCoords.x++; drawSprite(cellCoords); } break; // right
      case 40: if (cell.s) { removeSprite(cellCoords); cellCoords.y++; drawSprite(cellCoords); } break; // down
    }
  }
//start/stop listening to keyboard input
  this.bindKeyDown = function() {
    window.addEventListener("keydown", check, false);
  };

  this.unbindKeyDown = function() {
    window.removeEventListener("keydown", check, false);
}}
function initGame(width, height, cellSize, canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  // Resize canvas to fit maze
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;

  // 1. Generate the maze
  const maze = new Maze(width, height);

  // 2. Draw the maze
  const drawer = new DrawMaze(maze, ctx, cellSize);

  // 3. Define what happens on victory
  function onComplete(moves) {
    displayVictoryMess(moves); // your victory message function
  }

  // 4. Create the player
  const player = new Player(maze, canvas, cellSize, onComplete);

  // 5. Draw the player at start
  // (important so the player appears immediately)
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(
    (maze.startCoord().x + 0.5) * cellSize,
    (maze.startCoord().y + 0.5) * cellSize,
    cellSize / 3,
    0,
    2 * Math.PI
  );
  ctx.fill();

  // 6. Enable movement
  player.bindKeyDown();
}

// Example: 20x20 maze, each cell 25px, drawn on canvas with id "mazeCanvas"
initGame(20, 20, 25, "mazeCanvas");