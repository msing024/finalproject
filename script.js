let rightPressed = false, leftPressed = false, upPressed = false, downPressed = false;
let rightJustPressed = false, leftJustPressed = false, upJustPressed = false, downJustPressed = false, spaceJustPressed = false;
let rows = 22, cols = 10, blockSize = 25, fallTimer = 0, samePosCounter = 0, prevX, prevY, stopped = false;
let timerVal = 40, score = 0, linesClearedatOnce = 0, blockPlaceCounter = 0, timeoutValue = 3;
let startPosX = 3, startPosY = -3, gameState = "Start", resetting = false, holder, loginState = "loggedOut";
let users=[], currentUsersName = "", tickTimer=0;
class Board {
    constructor(ctx){
        this.grid = []
        this.ctx = ctx;
    }
    setupGrid(){
        for (var i=0;i<rows;i++){
            this.grid.push([0,0,0,0,0,0,0,0,0,0]);
        }
    }
    resetGrid(){
        for(var i=0;i<rows;i++){
            for(var j=0;j<cols;j++){
                this.grid[i][j] = 0;
            }
        }
    }

    validation(p){
        let height = p.shape.length;
        for (var i=0; i<height; i++){ // rows
            for (var j=0; j<height; j++){ // cols
                let value = p.shape[i][j];
                let x = p.x + j;
                let y = p.y + i;
                let grid = this.grid;
                if (y<0){
                    let fakeRow = [0,0,0,0,0,0,0,0,0,0];
                    let boardVal = fakeRow[x];
                    
                    if (value != 0){
                        if (boardVal == undefined){
                            return false;
                        } else if (boardVal > 0){
                            return false;
                        }
                    }
                } else {
                if (grid[y] == undefined){
                    if (value != 0){
                        return false;
                    }
                } else{
                    let boardVal = grid[y][x];
                    
                    if (value != 0){
                        if (boardVal == undefined){
                            return false;
                        } else if (boardVal > 0){
                            return false;
                        }
                    }
                }
                }
            }
        }
        return true;
    }

    imprint(p){
        let height = p.shape.length;
        for (var i=0; i<height; i++){ // rows
            for (var j=0; j<height; j++){ // cols
                let value = p.shape[i][j];
                let x = p.x + j;
                let y = p.y + i;
                if (y<0){
                    if (y<-1){
                        console.log("lost the game");
                        
                        
                        gameState = "Lost";
                    }
                } else {
                    if (value != 0){
                        this.grid[y][x] = p.number;
                    }   
                    
                }
            }
        }
        blockPlaceCounter = 0;
        this.clearLines();
    }

    draw(){
        for (var i=0; i<rows; i++){
            for (var j=0; j<cols; j++){
                let val = this.grid[i][j];
                this.ctx.fillStyle = colors[val];
                if (val > 0){
                    this.ctx.fillRect(j, i, 1,1);
                }
            }
        }
    }

    clearLines(){
        for (var i=0; i<rows; i++){
            let filledCounter = 0
            for (var j=0; j<cols; j++){
                let val = this.grid[i][j];
                if (val > 0){
                    filledCounter = filledCounter + 1;
                }
                
            }
            if (filledCounter == 10){
                console.log("score is: "+score+" and about to run the clear lines function");
                linesClearedatOnce = linesClearedatOnce + 1;
                for (var x=0;x<this.grid[i].length;x++){
                    this.grid[i][x] = 0;
                }
                for (var x = i-1; x > 0; x--){
                    let currentGrid = this.grid[x];
                    this.grid[x+1] = currentGrid;
                    
                }
                console.table(this.grid);
            }
            filledCounter = 0;
        }
    }
}

// matrix rotation algorithms source: https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
function rotateMatrixClockwise(matrix){
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse());
}
function rotateMatrixCounterClockwise(matrix){
    return matrix[0].map((val, index) => matrix.map(row => row[row.length-1-index]));
}

const pieceShapes = [
    [[0,0,0],
     [0,0,0],
     [0,0,0]], // Empty box.
    [[1,0,0],
     [1,1,1],
     [0,0,0]], // J piece
    [[0,2,0,0],
     [0,2,0,0],
     [0,2,0,0],
     [0,2,0,0]], // Line piece
    [[0,3,0],
     [3,3,3],
     [0,0,0]], // T piece
    [[0,0,0],
     [0,4,4],
     [4,4,0]], // S piece
    [[0,0,0],
     [5,5,0],
     [0,5,5]], // Z piece
    [[0,0,6],
     [6,6,6],
     [0,0,0]], // L piece
    [[7,7],
     [7,7]], // Square piece
];

const colors = [
    "blank",
    "blue",
    "lightblue",
    "purple",
    "green",
    "red",
    "orange",
    "yellow",
];
const pieceNames = [
    "not a piece",
    "J piece",
    "Line piece",
    "T piece",
    "S piece",
    "Z piece",
    "L piece",
    "Square piece"
];

const pieceSources = [
    "N/a",
    "JPiece.png",
    "LinePiece.png",
    "TPiece.png",
    "SPiece.png",
    "ZPiece.png",
    "LPiece.png",
    "SquarePiece.png",
];

class Piece {
    constructor(ctx){
        this.ctx = ctx;
        this.number = OnetoSevenRand();
        this.nextNumber = OnetoSevenRand();
        this.shape = pieceShapes[this.number];
        this.x = startPosX;
        this.y = startPosY;
        this.prevX = this.x;
        this.prevY = this.y;
    }

    draw(){
        this.shape.forEach((row,ry) => {
            row.forEach((val, rx) => {
                this.ctx.fillStyle = colors[this.number];
                if (val > 0) {
                    this.ctx.fillRect(this.x + rx, this.y + ry, 1,1);
                }
            });
        });
    }

    move(ax,ay){
        this.x = this.x + ax;
        this.y = this.y + ay;
    }

    copy(p){
        this.x = p.x;
        this.y = p.y
    }

    updatePrevVal(){
        this.prevX = this.x;
        this.prevY = this.y;
    }

    reset(){
        this.number = this.nextNumber;
        this.nextNumber = OnetoSevenRand();
        this.shape = pieceShapes[this.number];
        this.x = startPosX;
        this.y = startPosY;
    }
 }
 
window.onload = function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    let scoreText = document.getElementById("scoreText");
    let levelText = document.getElementById("levelText");
    let nextPieceText = document.getElementById("nextPieceText");
    let nextPieceImg = document.getElementById("nextPieceImg");
    let difficultyInput = document.getElementById("difficultyInput");
    let specialMessage = document.getElementById("specialMessage");
    let scoreboard = document.getElementById("scoreboard");
    let userPass = document.getElementById("userPass");
    let userAge = document.getElementById("userAge");

    scoreText.innerHTML = "N/A";
    levelText.innerHTML = "N/A";
    ctx.scale(blockSize,blockSize);
    let board = new Board(ctx);
    board.setupGrid();
    console.table(board.grid);

    let piece = new Piece(ctx);
    prevShape = piece.shape;

    timer = timerVal;
    window.requestAnimationFrame(draw1);

    function draw1() {

        if (gameState == "Running"){
            tickTimer = tickTimer + 1;
            ctx.clearRect(0,0,250,550);
            // Player input Area
            if (rightJustPressed){
                let p = {...piece};
                p.x = p.x + 1;
                if (board.validation(p)){
                    piece.move(1,0);
                }
    
            } else if (leftJustPressed){
                let p = {...piece};
                p.x = p.x - 1;
                if (board.validation(p)){
                    piece.move(-1,0);
                }
                
            }
    
            if (downJustPressed){
                let p = {...piece};
                p.y = p.y + 1;
                if (board.validation(p)){
                    piece.move(0,1);
                    blockPlaceCounter = 0;
                } else {
                    blockPlaceCounter = blockPlaceCounter + 0.2;
                    if (blockPlaceCounter >= timeoutValue){
                        board.imprint(piece);
                        blockPlaceCounter = 0;
                        piece.reset();
                    }
                }
            }
    
            if (upJustPressed){
              let p = {...piece};
              p.shape = rotateMatrixCounterClockwise(p.shape);
              if (board.validation(p)) {
                piece.shape = rotateMatrixClockwise(piece.shape);
              } else {
                p.y = p.y - 1;
                if (board.validation(p)){
                    piece.y = piece.y - 1;
                    piece.shape = rotateMatrixClockwise(piece.shape);
                    samePosCounter = 0;
                }
              }
            }
            
            if (spaceJustPressed){
                let p = {...piece};
                while(board.validation(p)){
                    p.y = p.y + 1
                }
                console.log(p.y);
                p.y = p.y - 1;
                piece.y = p.y;
                setTimeout(function(){
                    samePosCounter = 0;

                board.imprint(piece);
                console.log("PLACING VIA SPACE...PLACING AT: " + piece.y);
                piece.reset();
                
                },20)
                
            } 
            //End of Player Input Area
            nextPieceText.innerHTML = pieceNames[piece.nextNumber]; 
            nextPieceImg.src = "images/" + pieceSources[piece.nextNumber];
            //Timer based area
    
            if (timer > 0){
                timer = timer - 1;
            } else {
                let p = {...piece};
                p.y = p.y + 1;
                if (board.validation(p)){
                    piece.move(0,1);
                    blockPlaceCounter = 0;
                } else {
                    blockPlaceCounter = blockPlaceCounter + 1;
                    if (blockPlaceCounter >= timeoutValue){
                        console.log("PLACING AT: " + piece.y);
                        board.imprint(piece);
                        blockPlaceCounter = 0;
                        piece.reset();
                        timer = timerVal;   
                    }
                    
                }
                timer = timerVal;
            } 
    
            //End of Timer Based area
    
    
            board.draw();
            piece.draw();
    
            //Score area
            if (linesClearedatOnce > 0){
                score = score + (linesClearedatOnce ** 2) * 100;
            }
            scoreText.innerHTML = score;
            linesClearedatOnce = 0; 
            //Score area end
    
            justPressedReset();
            piece.updatePrevVal();
        } else if (gameState == "Resetting"){
            board.resetGrid();
            score = 0;
            piece.reset();
            gameState = "Running";
        }   
        
        window.requestAnimationFrame(draw1);
    } 
}

function input(){

}

function keyDownHandler(event) {

    if (event.code == "ArrowRight" || event.code == "KeyD") {
        rightPressed = true;
        rightJustPressed = true;
    } else if (event.code == "ArrowLeft" || event.code == "KeyA") {
        leftPressed = true;
        leftJustPressed = true;
    }

    if (event.code == "ArrowUp" || event.code == "KeyW") {
        upPressed = true;
        upJustPressed = true;
    } else if (event.code == "ArrowDown" || event.code == "KeyS") {
        downPressed = true;
        downJustPressed = true;
    }

    if (event.code == "Space"){
        spaceJustPressed = true;
    }
}

function keyUpHandler(event) {

    if (event.code == "ArrowRight" || event.code == "KeyD") {
        rightPressed = false;
    } else if (event.code == "ArrowLeft" || event.code == "KeyA") {
        leftPressed = false;
    }

    if (event.code == "ArrowUp" || event.code == "KeyW") {
        upPressed = false;
    } else if (event.code == "ArrowDown" || event.code == "KeyS") {
        downPressed = false;
    }

}

function OnetoSevenRand(){  
    let rand = Math.round(Math.random()*10 + 1);
    while (rand>7){
        rand = Math.round(Math.random()*10 + 1);
    }
    return rand;
}

function justPressedReset(){
    rightJustPressed = false;
    leftJustPressed = false;
    upJustPressed = false;
    downJustPressed = false;
    spaceJustPressed = false;
}

function startButtonPressed(){
    difficultyInput = document.getElementById("difficultyInput");
    if(difficultyInput.value.length == 0 || difficultyInput.value > 3 || difficultyInput.value < 1){
        specialMessage.innerHTML = "Please choose a valid difficulty in settings before starting.";
    } else {
        if (difficultyInput.value == 1){
           timerVal = 40;
           timeoutValue = 3;
           document.getElementById("levelText").innerHTML = "Easy";
        } else if (difficultyInput.value == 2){
            timerVal = 20;
           timeoutValue = 3;
           document.getElementById("levelText").innerHTML = "Medium";
        } else {
            timerVal = 10;
            timeoutValue = 2;
            document.getElementById("levelText").innerHTML = "Hard";
        }
        
        justPressedReset();
        gameState = "Running";
        specialMessage.innerHTML = "";
        scoreboard.innerHTML = "";
    }
}

function resetButtonPressed(){
    if (gameState != "Start"){
        scoreboard.innerHTML = currentUsersName + ": " + score + "<br>" + scoreboard.innerHTML;
        gameState = "Resetting";

    }
}

function stopButtonPressed(){
    gameState = "Stopped";
}

function signUpButtonPressed(){
    if (document.getElementById("playerName").value.length == 0 || document.getElementById("userPass").value.length == 0 || document.getElementById("userAge").value.length == 0){
        console.log("Invalid");
        document.getElementById("signUpError").innerHTML = "Please fill out the form before submitting.";
    } else{
        console.log("valid!");
        document.getElementById("signUpError").innerHTML = "";
        users.push([document.getElementById("playerName").value,document.getElementById("userPass").value,document.getElementById("userAge").value]);
        console.log(users);
        currentUsersName = document.getElementById("playerName").value;
        changeToMain();
    }
   
}

function signInButtonPressed(){
    let pName = document.getElementById("playerName2").value;
    let pPass = document.getElementById("userPass2").value;
    console.log(pName);
    console.log(pPass);
    if (users.length > 0){
        for (i=0; i<users.length; i++){
            if (users[i][0] == pName && users[i][1] == pPass){
                console.log(users[i][0]);
                console.log(users[i][1]);
                changeToMain();
                document.getElementById("nameOutput").innerHTML = pName;
                document.getElementById("ageOutput").innerHTML = users[i][2];
                currentUsersName = users[i][0];
                break;
            } else {
                document.getElementById("signInError").innerHTML = "Password or Username is incorrect";
            }
        }
    } else {
        document.getElementById("signInError").innerHTML = "No users are registered.";
    }
   
}

function changeToMain(){
    document.getElementById("myCanvas").style.visibility = "visible";
    document.getElementById("item1").style.visibility = "visible";
    document.getElementById("item2").style.visibility = "visible";
    document.getElementById("introBox").style.visibility = "hidden";
    document.getElementById("introBox").style.width = "1px"; 
    
    document.getElementById("item1").style.flex = "50%";
    document.getElementById("item2").style.flex = "50%";
    document.getElementById("nameOutput").innerHTML = document.getElementById("playerName").value;
    document.getElementById("ageOutput").innerHTML = document.getElementById("userAge").value;
}

function changeToLogin(){
    document.getElementById("myCanvas").style.visibility = "hidden";
    document.getElementById("item1").style.visibility = "hidden";
    document.getElementById("item2").style.visibility = "hidden";
    document.getElementById("introBox").style.visibility = "visible";
    document.getElementById("introBox").style.width = "600px";
    document.getElementById("introBox").style.border = "0px solid black";
    document.getElementById("item1").style.flex = "0%";
    document.getElementById("item2").style.flex = "0%";
    document.getElementById("introBox").style.fontSize = "15px"; 

}

function logoutButtonPressed(){
    changeToLogin();
    gameState = "Start";
}