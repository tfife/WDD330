let height = 14
let width = 10
let numBombs = 24
let board = []
let bombs = []
let firstClick = true
let numClicked = 0
let flaggingEnabled = false
let flags = []

window.onload = function () {
    createBoard()
    document.querySelector('#toggle').addEventListener("click", toggleControl)
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

function onSquareClicked(square) {
    if (square.classList.contains('showing')) {
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
    }

    numClicked++
    square.classList.add('showing')
    
    square.style.backgroundColor = 'lightcyan'
    if (bombs.includes(square)) {
        console.log("you lost")
        square.style="background-color: black"
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
    console.log("you win!!")
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