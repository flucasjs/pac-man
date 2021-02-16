const width = 28;
const grid = document.querySelector(".grid");
const scoreDisplay = document.getElementById("score");
let squares = [];
let score = 0;

const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
    1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
    1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
    1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 
]

function createBoard() {
    let divSquares = new DocumentFragment();
    for (let i = 0; i < layout.length; i++) {
        let square = document.createElement("div");
        

        if (layout[i] === 0) {
            square.classList.add("pac-dot");
        } else if (layout[i] === 1) {
            square.classList.add("wall");
        } else if (layout[i] === 2) {
            square.classList.add("ghost-lair");
        } else if (layout[i] === 3) {
            square.classList.add("power-pellet");
        }

        divSquares.appendChild(square);
        squares.push(square);
    }
    grid.appendChild(divSquares);
}

createBoard();

let pacmanStartingIndex = 490;
let pacmanCurrentIndex = pacmanStartingIndex;
squares[pacmanStartingIndex].classList.add("pacman");

function control(e) {
    squares[pacmanCurrentIndex].classList.remove("pacman");
    switch(e.keyCode) {
        case 40:
            if (
                !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair") &&
                !squares[pacmanCurrentIndex + width].classList.contains("wall") &&
                pacmanCurrentIndex + width < width * width
            ) {
                pacmanCurrentIndex += width;
            }
        break

        case 38:
            if (
                !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair") &&
                !squares[pacmanCurrentIndex - width].classList.contains("wall") &&
                pacmanCurrentIndex - width >= 0
            ) {
                pacmanCurrentIndex -= width;
            }
        break

        case 37:
            if ( 
                !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair") &&
                !squares[pacmanCurrentIndex - 1].classList.contains("wall") &&
                pacmanCurrentIndex % width !== 0
            ) {
                pacmanCurrentIndex -=1;
            }

            if (pacmanCurrentIndex === 364) {
                pacmanCurrentIndex = 391;
            }
        break
        
        case 39:
            if(
                !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair") &&
                !squares[pacmanCurrentIndex + 1].classList.contains("wall") &&
                pacmanCurrentIndex % width < width -1
            ) {
                pacmanCurrentIndex +=1;
            }

            if (pacmanCurrentIndex === 391) {
                pacmanCurrentIndex = 364;
            }
        break

    }
    squares[pacmanCurrentIndex].classList.add("pacman");
    checkForGameOver();
    pacDotEaten();
    powerPelletEaten();
    checkForWin();
}

document.addEventListener("keyup", control)

function pacDotEaten() {
    if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
        squares[pacmanCurrentIndex].classList.remove("pac-dot");
        scoreDisplay.textContent = ++score;
    }
}

function powerPelletEaten() {
    if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
        squares[pacmanCurrentIndex].classList.remove("power-pellet");

        ghosts.forEach(ghost => ghost.isScared = true);
        setTimeout(unScareGhosts, 10000);

        scoreDisplay.textContent = score += 10;
    }
}

function unScareGhosts() {
    ghosts.forEach(ghost => ghost.isScared = false);
}

class Ghost {
    constructor(className, startIndex, speed) {
        this.className = className;
        this.startIndex = startIndex;
        this.speed = speed;
        this.currentIndex = startIndex;
        this.isScared = false;
        this.timerId = undefined;
    }
}

const ghosts = [
    new Ghost("blinky", 348, 250),
    new Ghost("pinky", 376, 400),
    new Ghost("inky", 351, 300),
    new Ghost("clyde", 379, 500)
];

ghosts.forEach(ghost => {
    squares[ghost.startIndex].classList.add(ghost.className);
    squares[ghost.startIndex].classList.add("ghost");
})

ghosts.forEach(ghost => moveGhost(ghost));

function moveGhost(ghost) {
    const directions = [-1, +1, -width, +width];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    ghost.timerId = setInterval(function() {
        if (
            !squares[ghost.currentIndex + direction].classList.contains("wall") &&
            !squares[ghost.currentIndex + direction].classList.contains("ghost")
        ) {
            squares[ghost.currentIndex].classList.remove(ghost.className);
            squares[ghost.currentIndex].classList.remove("ghost", "scared-ghost");
        
            ghost.currentIndex += direction;
        
            squares[ghost.currentIndex].classList.add(ghost.className);
            squares[ghost.currentIndex].classList.add("ghost");
        } else {
            direction = directions[Math.floor(Math.random() * directions.length)];
        }

        if (ghost.isScared) {
            squares[ghost.currentIndex].classList.add("scared-ghost");
        }

        if (ghost.isScared && ghosts[ghost.currentIndex].classList.contains("pacman")) {
            squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");

            ghost.currentIndex = ghost.startIndex;

            scoreDisplay.textContent = score += 100;

            squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
        }

        checkForGameOver();
    }, ghost.speed);
}

function checkForGameOver() {
    if (
        squares[pacmanCurrentIndex].classList.contains("ghost") && 
        !squares[pacmanCurrentIndex].classList.contains("scared-ghost")
    ) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener("keyup", control);
        scoreDisplay.textContent = " Game Over";
    }
}

function checkForWin() {
    if (score === 274) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener("keyup", control);
        scoreDisplay.textContent = "You Won!";
    }
}