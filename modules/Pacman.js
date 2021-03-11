class Pacman {
    constructor(startIndex, speed) {
        this.startIndex = startIndex;
        this.speed = speed;
        this.currentIndex = startIndex;
        this.timerId = undefined;
        this.direction = [1, 1];
    }
}

export default Pacman;