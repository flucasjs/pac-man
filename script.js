import Pacman from "./modules/Pacman.js"
import Ghost from "./modules/Ghost.js"
import Portal from "./modules/Portal.js"
import PowerPellet from "./modules/PowerPellet.js"
import layout from "./modules/layout.js"

const width = 28;
const grid = document.querySelector(".grid");
const scoreText = document.querySelector("#score");
const scoreValue = document.querySelector("#score span");
const squares = [];
const powerPellets = [];
let score = 0;

const portal = new Portal(364, 391);

createBoard();

const pacmanStartingIndex = 490;
const pacman = new Pacman(pacmanStartingIndex, 250)
squares[pacmanStartingIndex].classList.add("pacman");
movePacman(pacman, pacman.speed);

document.addEventListener("keyup", control)

const ghosts = [
    new Ghost("blinky", 348, 250),
    new Ghost("pinky", 376, 400),
    new Ghost("inky", 351, 300),
    new Ghost("clyde", 379, 500)
];

ghosts.forEach(ghost => {
    squares[ghost.startIndex].classList.add(ghost.className, "ghost");
})

ghosts.forEach(ghost => moveGhost(ghost));

powerPellets.forEach(blinkPellet);

function createBoard() {
    let divSquares = new DocumentFragment();
    for (let i = 0; i < layout.length; i++) {
        let square = document.createElement("div")
        if (layout[i] === 0) {
            square.classList.add("pac-dot");
        } else if (layout[i] === 1) {
            // Check for adjacent walls on all four sides.
            // If adjacent wall doesn't exist, add border to that side.
            square.classList.add("wall");
        } else if (layout[i] === 2) {
            square.classList.add("ghost-lair");
        } else if (layout[i] === 3) {
            square.classList.add("power-pellet");
            powerPellets.push(new PowerPellet(i))
        } else if (layout[i] === 5) {
            square.classList.add("bottom-left-corner", "wall");
        } else if (layout[i] === 6) {
            square.classList.add("bottom-right-corner", "wall");
        } else if (layout[i] === 8) {
            square.classList.add("top-left-corner", "wall");
        } else if (layout[i] === 9) {
            square.classList.add("top-right-corner", "wall");
        } else if (layout[i] === "a" || layout[i] === "b") {
            square.classList.add('portal')
        }

        divSquares.appendChild(square);
        squares.push(square);
    }
    grid.appendChild(divSquares);
}

function movePacman(pacman, speed) {
    pacman.timerId = setInterval(function() {
        // If the current direction and the desired direction are opposite each
        // other, pacman will get stuck in a redirection loop.
        if (pacman.direction[0] !== -pacman.direction[1]) {
            redirect(pacman.currentIndex, pacman.direction[1]);
        }

        const boundaryCollision = (
            squares[pacman.currentIndex + pacman.direction[0]].classList.contains("ghost-lair") ||
            squares[pacman.currentIndex + pacman.direction[0]].classList.contains("wall")
        )
        
        squares[pacman.currentIndex].classList.remove("pacman");

        if (
            pacman.direction[0] === width &&
            !boundaryCollision &&
            pacman.currentIndex + width < (width ** 2) - width
        ) {
            pacman.currentIndex += pacman.direction[0];
        } else if (
            pacman.direction[0] === -width &&
            !boundaryCollision &&
            pacman.currentIndex >= width * 2
        ) {
            pacman.currentIndex += pacman.direction[0];
        } else if (
            pacman.direction[0] === -1 &&
            !boundaryCollision &&
            pacman.currentIndex % width !== 1
        ) {
            pacman.currentIndex += pacman.direction[0];

            if (pacman.currentIndex - 1 === portal.portals[0]) {
                pacman.currentIndex = portal.portals[1];
            }
        } else if (
            pacman.direction[0] === 1 &&
            !boundaryCollision &&
            pacman.currentIndex % width < width - 2
        ) {
            pacman.currentIndex += pacman.direction[0];


            if (pacman.currentIndex + 1 === portal.portals[1]) {
                pacman.currentIndex = portal.portals[0];
            }
        } 

        powerPellets.forEach(p => {
            if (p.index === pacman.currentIndex) {
                clearInterval(p.timerId);
                squares[p.index].style.visibility = "initial";
            }
        })

        squares[pacman.currentIndex].classList.add("pacman");
        checkForGameOver();
        pacDotEaten();
        powerPelletEaten();
        checkForWin();
    }, speed)
}

function control(e) {
    if (e.code === "ArrowDown" || e.code === "KeyS") {
        if (
            !squares[pacman.currentIndex + width].classList.contains("ghost-lair") &&
            !squares[pacman.currentIndex + width].classList.contains("wall") &&
            pacman.currentIndex + width < width ** 2
        ) {
            pacman.direction[0] = width;
        }
        pacman.direction[1] = width;
    }  else if (e.code === "ArrowUp" || e.code === "KeyW") {
        if (
            !squares[pacman.currentIndex - width].classList.contains("ghost-lair") &&
            !squares[pacman.currentIndex - width].classList.contains("wall") &&
            pacman.currentIndex - width >= 0
        ) {
            pacman.direction[0] = -width;
        }
        pacman.direction[1] = -width;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        if (
            !squares[pacman.currentIndex - 1].classList.contains("ghost-lair") &&
            !squares[pacman.currentIndex - 1].classList.contains("wall") &&
            pacman.currentIndex % width !== 0
        ) {
            pacman.direction[0] = -1;
        } 
        pacman.direction[1] = -1;
    } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        if (
            !squares[pacman.currentIndex + 1].classList.contains("ghost-lair") &&
            !squares[pacman.currentIndex + 1].classList.contains("wall") &&
            pacman.currentIndex % width < width - 1
        ) {
            pacman.direction[0] = 1;
        }
        pacman.direction[1] = 1;
    }  
}

function redirect(index, direction) {
    if (pacman.direction[0] !== pacman.direction[1] &&
        squares[index + direction].classList.contains("pac-dot") ||
        squares[index + direction].classList.contains("power-pellet")
    ) {
        pacman.direction[0] = direction;
    }
}

function pacDotEaten() {
    if (squares[pacman.currentIndex].classList.contains("pac-dot")) {
        squares[pacman.currentIndex].classList.remove("pac-dot");
        scoreValue.textContent = ++score;
    }
}

function powerPelletEaten() {
    if (squares[pacman.currentIndex].classList.contains("power-pellet")) {
        squares[pacman.currentIndex].classList.remove("power-pellet");

        powerPellets.forEach(p => {
            if (p.index === pacman.currentIndex) {
                p.eaten = true;
            }
        })
        
        ghosts.forEach(ghost => ghost.isScared = true);

        setTimeout(unScareGhosts, 10000);

        scoreValue.textContent = score += 10;
    }
}

function blinkPellet(pellet) {
    pellet.timerId = setInterval(() => {
        const visibility = ["hidden", "initial"];
        pellet.visible = !pellet.visible;
        squares[pellet.index].style.visibility = visibility[Number(pellet.visible)];
    }, 250)
}

function unScareGhosts() {
    ghosts.forEach(ghost => ghost.isScared = false);
}

function moveGhost(ghost) {
    const directions = [-1, 1, -width, width];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    ghost.timerId = setInterval(() => {
        if (
            !squares[ghost.currentIndex + direction].classList.contains("wall") &&
            !squares[ghost.currentIndex + direction].classList.contains("ghost")
        ) {
            squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
            ghost.currentIndex += direction;
            squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
        } else {
            direction = directions[Math.floor(Math.random() * directions.length)];
        }

        if (ghost.isScared) {
            squares[ghost.currentIndex].classList.add("scared-ghost");
        }

        if (ghost.isScared && squares[ghost.currentIndex].classList.contains("pacman")) {
            
            squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");

            ghost.currentIndex = ghost.startIndex;

            scoreValue.textContent = score += 100;

            squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
        }
        checkForGameOver();
    }, ghost.speed);
}

function checkForGameOver() {
    if (
        squares[pacman.currentIndex].classList.contains("ghost") && 
        !squares[pacman.currentIndex].classList.contains("scared-ghost")
    ) {
        clearInterval(pacman);
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener("keyup", control);
        scoreValue.textContent = " Game Over";
    }
}

function checkForWin() {
    if (score >= 274) {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener("keyup", control);
        scoreValue.textContent = "You Won!";
    }
}
