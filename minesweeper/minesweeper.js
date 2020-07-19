let height = 14
let width = 10
let numBombs = 20
let board = []
let bombs = []
let firstClick = true
let numClicked = 0
let flaggingEnabled = false
let flags = []
let settingsOpen = false
let playEnabled = true
let newGame = true
let time = 0
let timer = setInterval(countUp, 1000)
let stopTime = true

window.onload = function () {
    createBoard()
    document.querySelector('#toggle').addEventListener('click', toggleControl)
    document.querySelector('#settings').addEventListener('click', onSettingsClicked)
    document.querySelector('#resetButton').addEventListener('click', resetGame)
    document.querySelector('#newGameButton').addEventListener('click', resetGame)
    document.querySelector('#clearHighScores').addEventListener('click', clearHighScores)
    document.querySelector('#numBombs').textContent=`${numBombs} Bombs`

    displayHighScores()
}

function createBoard() {
    //add a style for perfect centering
    let boardStyle = document.querySelector('#boardStyle')
    boardStyle.innerHTML = `#board {width:${width * 30}px;}`

    //create the board
    let boardElement = document.querySelector('#board')
    for (h = 0; h < height; h++) {
        // console.log('h')
        let row = []
        let rowElement = document.createElement('div')
        rowElement.className = 'row'
        for (w = 0; w < width; w++) {
            // console.log('w')
            let square = document.createElement('div')
            square.className = 'square'
            square.addEventListener('click', () => {
                onSquareClicked(square)
            })
            row.push(square)
            rowElement.appendChild(square)
        }
        boardElement.appendChild(rowElement)

        board.push(row)
    }
    console.log(board)
}

function toggleControl() {
    slider = document.querySelector('#toggle')
    if (flaggingEnabled) {
        //slide right
        let position = -70;
        let id = setInterval(frame, 5)
        function frame() {
            if (position == 0) {
                clearInterval(id)
            } else {
                position++
                slider.style.left = position + 'px'
            }
        }
    } else {
        //slide left
        let position = 0;
        let id = setInterval(frame, 5)
        function frame() {
            if (position == -70) {
                clearInterval(id)
            } else {
                position--
                slider.style.left = position + 'px'
            }
        }
    }
    flaggingEnabled = !flaggingEnabled
}

function onSettingsClicked() {
    if(settingsOpen) {
        settingsModal.style.display = 'none'
        document.querySelector('#settings').src = 'settings.png'
    } else {
        settingsModal.style.display = 'block'
        document.querySelector('#settings').src = 'exit.png'
    }
    settingsOpen = !settingsOpen
}

function onSquareClicked(square) {
    if (!playEnabled || square.classList.contains('showing')) {
        return
    }

    if (flaggingEnabled) {
        toggleFlagged(square)
        return
    }

    if(square.classList.contains('flagged')) {
        return
    }

    if (firstClick) {
        firstClick = false
        addBombs(square)
        newGame = false
        stopTime = false
    }

    numClicked++
    square.classList.add('showing')
    
    square.style.backgroundColor = 'lightcyan'
    if (bombs.includes(square)) {
        displayLoss(square)
        return
    }
    let count = getNeighborBombsCount(square)
    if (count > 0) {
        square.innerHTML = count
    } else {
        clearNeighbors(square)
    }

    checkForWin()
}

function toggleFlagged(square) {
    console.log("flag")
    if (square.classList.contains('flagged')) {
        console.log('remove flag')
        square.classList.remove('flagged')
        square.style.backgroundColor = 'cyan'
        square.innerHTML = ''
        flags.splice(flags.indexOf(square), 1)
    } else {
        square.classList.add('flagged')
        square.innerHTML = '<img src="flag.png">'
        flags.push(square)
    }
    document.querySelector('#numFlags').textContent = `${flags.length} Flags`
    if (flags.length == numBombs) {
        checkForWin()
    }
}

function checkForWin() {
    if (numClicked + numBombs == width * height) {
        displayWin()
        return
    }
    if (flags.length == bombs.length) {
        for (f in flags) {
            if (!bombs.includes(flags[f])) {
                return false
            }
        }
        displayWin()
        return
    }
}

function displayWin() {
    let index = 0
    let id = setInterval(showBomb, 300)
    function showBomb() {
        if (newGame || index == bombs.length) {
            clearInterval(id)
            return
        }
        bombs[index].style.backgroundColor = "lightgreen"
        bombs[index].innerHTML = "<img src='bomb.png' width='25px'>"
        index++
    }
    playEnabled = false
    console.log("you win!!")
    document.querySelector("#heading").textContent = "You Win!!"
    endGame()
    setHighScores()
}

function displayLoss(square) {
    square.innerHTML = "<img src='explosion.png' width='25px'>"
    square.style.border = "2px solid red"
    let index = 0
    let id = setInterval(showBomb, 300)
    function showBomb() {
        if (newGame || index == bombs.length) {
            clearInterval(id)
           return
        }
        bombs[index].style.backgroundColor = "lightcyan"
        bombs[index].innerHTML = "<img src='explosion.png' width='25px'>"
        index++
    }
    playEnabled = false
    console.log("you lose!")
    document.querySelector("#heading").textContent = "You Lose!!"
    endGame()
}

function endGame() {
    document.querySelector('#newGameButton').style.display = 'block'
    stopTime = true
}

function addBombs(square) {
    let forbidden = getAllNeighbors(square)
    forbidden.push(square)
    if (width * height + 9 <= numBombs) {
        return
    }
    let setBombs = 0
    while (setBombs < numBombs) {
        let row = Math.floor((Math.random() * height))
        let col = Math.floor((Math.random() * width))
        let potBomb = getSquare(row, col)
        if (!forbidden.includes(potBomb) && !bombs.includes(potBomb)) {
            bombs.push(potBomb)
            setBombs = setBombs + 1
        }
    }
}

function clearNeighbors(square) {
    let neighbors = getAllNeighbors(square)
    for (n in neighbors) {
        if (!neighbors[n].classList.contains('showing')) {
            onSquareClicked(neighbors[n])  
        }
    }
}

function getNeighborBombsCount(square) {
    if (bombs.includes(square)) {
        return
    }
    let neighbors = getAllNeighbors(square)
    let count = 0
    for (n in neighbors) {
        if (bombs.includes(neighbors[n])) {
            count++
        }
    }
    return count
}

function getAllNeighbors(square) {
    let neighbors = []
    let coordinates = getLocation(square)
    let row = coordinates[0]
    let col = coordinates[1]

    //top left
    ifNotNull(getSquare(row - 1, col - 1), () => {
        neighbors.push(getSquare(row - 1, col - 1))
    })

    //top middle
    ifNotNull(getSquare(row - 1, col), () => {
        neighbors.push(getSquare(row - 1, col))
    })
    
    //top right
    ifNotNull(getSquare(row - 1, col + 1), () => {
        neighbors.push(getSquare(row - 1, col + 1))
    })

    
    //middle left
    ifNotNull(getSquare(row, col - 1), () => {
        neighbors.push(getSquare(row, col - 1))
    })

    
    //middle right
    ifNotNull(getSquare(row, col + 1), () => {
        neighbors.push(getSquare(row, col + 1))
    })

    
    //bottom left
    ifNotNull(getSquare(row + 1, col - 1), () => {
        neighbors.push(getSquare(row + 1, col - 1))
    })

    //bottom middle
    ifNotNull(getSquare(row + 1, col), () => {
        neighbors.push(getSquare(row + 1, col))
    })

    //bottom right
    ifNotNull(getSquare(row + 1, col + 1), () => {
        neighbors.push(getSquare(row + 1, col + 1))
    })

    return neighbors
}

//returns the coordinates of a square as an array [row, column]
function getLocation(square) {

    for (r = 0; r < height; r++) {
        for (c = 0; c < width; c++) {
            if (board[r][c] == square) {
                return [r, c]
            }
        }
    }
}

//returns the square when provided a row and column
function getSquare(row, col) {
    if (row >= 0 && row < height && col >= 0 && col < width) {
        return board[row][col]
    } else {
        return null
    }
}

//if value is not null, perform function
function ifNotNull(value, fun) {
    if (value != null) {
        fun()
    }
}

//for each square, will perform the provided function
// with the square as a parameter
function forAllSquares(fun) {
    for (h in height) {
        for (w in width) {
            let square = getSquare(h, w)
            ifNotNull(square, () => {
                fun(square)
            })
        }
    }
}

function resetGame() {
    console.log('reset')
    board = []
    bombs = []
    firstClick = true
    numClicked = 0
    flaggingEnabled = false
    flags = []
    settingsOpen = false
    playEnabled = true
    newGame = true
    time = 0
    stopTime = true

    document.querySelector('#heading').textContent = 'Minesweeper'
    document.querySelector('#board').innerHTML = ''
    document.querySelector('#numBombs').textContent=`${numBombs} Bombs`
    document.querySelector('#newGameButton').style.display = 'none'
    document.querySelector('#timer').textContent = '00:00'
    
    createBoard()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == settingsModal) {
      onSettingsClicked()
    }
  }

function countUp() {
    if (stopTime) {
        return
    }
    time++
    document.querySelector('#timer').textContent = formatTime()
}

function getHighScores() {
    if ("highScores" in localStorage) {
        return JSON.parse(localStorage.getItem("highScores"))
    } else {
        return []
    }
}

function setHighScores() {
    let scores = getHighScores()
    let index = 0
    for (s in scores) {
        if (time > parseInt(scores[s])) {
            index++
        } else if (time == parseInt(scores[s])) {
            displayHighScores()
            return
        }
    }
    console.log("high score index: " + index)
    scores.splice(index, 0, time)
    console.log(scores)

    while (scores.length > 10) {
        scores.pop()
    }
    
    localStorage.setItem("highScores", JSON.stringify(scores))
    displayHighScores()
}

function displayHighScores() {
    let scores = getHighScores()

    let content = '<h3>Your High Scores</h3>'
    for (s in scores) {
        content += '<div class="highScoresRow"'
        if (scores[s] == time && (s == scores.length || scores[s + 1] != time)) {
            console.log(scores[s] == time)
            console.log(s == scores.length)
            console.log(scores[s+1] != time)
            console.log(s)
            content += ' style="border: 1px solid red"'
        }
        content += '><span>'
        if (s < 10) {
            content += '0'
        }
        content += (parseInt(s) + 1)
        content += '</span><span>- - - - - - - - - - - - - - - - - - - - -</span><span>'
        content += formatTime(scores[s])
        content += '</span></div>'
    }
    if (scores.length == 0) {
        content += 'Win a game to add a high score!'
    }
    document.querySelector('#highScores').innerHTML = content
}

function formatTime(seconds = time) {
    let minuteZero = ''
    if (parseInt(seconds / 60) < 10) {
        minuteZero = 0
    }
    let secondZero = ''
    if (seconds % 60 < 10) {
        secondZero = 0
    }
    return `${minuteZero}${parseInt(seconds / 60)}:${secondZero}${seconds % 60}`
}

function clearHighScores() {
    localStorage.setItem("highScores", JSON.stringify([]))
    displayHighScores()
}