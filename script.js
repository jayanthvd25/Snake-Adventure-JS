
let board = document.querySelector(".board");
let blockHeight = 50;
let blockWidth = 50;
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
let game = null;
const modal = document.querySelector(".modal");
const startGameButton = document.querySelector(".start-game");
const endGameButton = document.querySelector(".restart-game");

let highscoreElement  = document.querySelector("#high-score");
let scoreElement = document.querySelector("#score");
let timeElement = document.querySelector("#time");


let highscore = parseInt(localStorage.getItem("highScore")) || 0;
let score = 0;
let seconds = 0;
highscoreElement.textContent = highscore;

let timerId = null;

// CALCULATING COLUMN AND ROW

const column = Math.floor(board.clientWidth/blockWidth);
const row = Math.floor(board.clientHeight/blockHeight);
let food = {x:Math.floor(Math.random()*row),y:Math.floor(Math.random()*column)};

let blocks = [];
let snake = [
    {x:5,y:3},
]


//INCLUDING GRIDS

for(let r = 0;r<row;r++){
    for(let c = 0;c<column;c++){
        let block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${r}-${c}`] = block;
    }
}

//INSERTING SNAKE

function rendor(){

    snake.forEach((segment)=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })

    blocks[`${food.x}-${food.y}`].classList.add("food");

}

//ADDING MOVEMENT OF SNAKE BASED ON RESPONSE OF KEYBOARD

let direction = undefined;

document.addEventListener("keydown", (event) => {
    if ((event.key === "ArrowUp" || event.key === "w" || event.key === "W") && direction !== "down") {
        direction = "up";
    } 
    else if ((event.key === "ArrowDown" || event.key === "s" || event.key === "S") && direction !== "up") {
        direction = "down";
    } 
    else if ((event.key === "ArrowLeft" || event.key === "a" || event.key === "A") && direction !== "right") {
        direction = "left";
    } 
    else if ((event.key === "ArrowRight" || event.key === "d" || event.key === "D") && direction !== "left") {
        direction = "right";
    }
});

function updateTime() {

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    timeElement.textContent =
        String(hrs).padStart(2, "0") + ":" +
        String(mins).padStart(2, "0") + ":" +
        String(secs).padStart(2, "0");

    seconds++;
}

startButton.addEventListener("click", () => {

    modal.style.display = "none";

    if (game !== null) return;

    if (timerId === null) {
        timerId= setInterval(updateTime, 1000);
    }

    game = setInterval(() => {

        if (direction === undefined) return;

        let head = null;

        if (direction === "left") {
            head = { x: snake[0].x, y: snake[0].y - 1 };
        } else if (direction === "right") {
            head = { x: snake[0].x, y: snake[0].y + 1 };
        } else if (direction === "up") {
            head = { x: snake[0].x - 1, y: snake[0].y };
        } else if (direction === "down") {
            head = { x: snake[0].x + 1, y: snake[0].y };
        }

        if (head.x < 0 || head.x >= row || head.y < 0 || head.y >= column){
            clearInterval(game);
            game = null;
            modal.style.display = "flex";
            startGameButton.style.display = "none";
            endGameButton.style.display = "flex";

            clearInterval(timeInvervalId);
            timeInvervalId = null;

            if(score > highscore){
                highscore = score;
                localStorage.setItem("highScore",highscore.toString());
                highscoreElement.textContent = highscore;
            }
            
            return;
        }

        snake.forEach((segment) => {
            blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
        });

        if (head.x === food.x && head.y === food.y) {

            blocks[`${food.x}-${food.y}`].classList.remove("food");

            food = {
                x: Math.floor(Math.random() * row),
                y: Math.floor(Math.random() * column)
            };

            blocks[`${food.x}-${food.y}`].classList.add("food");

            snake.unshift(head);
            score += 10;
            scoreElement.textContent = score;
            
        } else {

            snake.unshift(head);
            snake.pop();

        }

        rendor();

    }, 300);

});

restartButton.addEventListener("click",restartgame);


function restartgame() {

    
    modal.style.display = "none";

    
    startGameButton.style.display = "flex";
    endGameButton.style.display = "none";

   
    snake = [{x:5,y:3}];
    score = 0;
    scoreElement.textContent = score;
    seconds = 0;
    timeElement.textContent = "00:00:00";
    
    direction = "right";

    
    food = {
        x: Math.floor(Math.random() * row),
        y: Math.floor(Math.random() * column)
    };

   
    game = null;

    
    document.querySelectorAll(".fill").forEach(block => {
        block.classList.remove("fill");
    });

    document.querySelectorAll(".food").forEach(block => {
        block.classList.remove("food");
    });

    
    startButton.click();
}


