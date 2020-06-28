let height = 10
let width = 10
let board = []
let numBombs = 15

window.onload = function () {
    showNav(1)
    styleBoard()
    createBoard()
    addBombs()
    fillBoard()
}

function createBoard() {
    let boardElement = document.querySelector('#board')
    for (h = 0; h < height; h++) {
        console.log('h')
        let row = []
        let rowElement = document.createElement('div')
        rowElement.className = 'row'
        for (w = 0; w < width; w++) {
            console.log('w')
            let square = document.createElement('div')
            square.className = 'square'
            row.push(square)
            rowElement.appendChild(square)
        }
        boardElement.appendChild(rowElement)

        board.push(row)
    }
    console.log(board)
}

function styleBoard() {
    let boardStyle = document.querySelector('#boardStyle')
    boardStyle.innerHTML = `#board {width:${width * 30}px;}`
}

function addBombs() {
    board[2][3].setAttribute('data-bomb', 'set')
    board[8][9].setAttribute('data-bomb', 'set')
    board[2][5].setAttribute('data-bomb', 'set')
    board[4][2].setAttribute('data-bomb', 'set')
    board[8][8].setAttribute('data-bomb', 'set')
    board[9][5].setAttribute('data-bomb', 'set')
    board[3][3].setAttribute('data-bomb', 'set')
    board[3][5].setAttribute('data-bomb', 'set')
    // checkBomb(board[2][3])
    // checkBomb(board[2][4])
    // checkBomb(board[2][5])
    // checkBomb(board[4][3])
    // checkBomb(board[4][4])
    // checkBomb(board[4][5])
    // checkBomb(board[3][3])
    // checkBomb(board[3][5])
}

function showBomb(square) {
    if (square.getAttribute('data-bomb') == 'set') {
        let image = document.createElement('img')
        image.src = 'bomb.png'
        image.className = 'bombPic'
        square.appendChild(image)
    }
}

function checkBomb(square) {
    if (square.getAttribute('data-bomb') == 'set') {
        showBomb(square)
    } else {
        checkNeighbors(square)
    }
}

function checkNeighbors(square) {
    let numBombNeighbors = 0
    // find location of square
    let location = getLocation(square)
    let row = location[0]
    let col = location[1]

    //top left
    if ( row > 0 && col > 0 && board[row - 1][col - 1].getAttribute('data-bomb') == 'set') {
        numBombNeighbors++
    }

    //top middle
    if ( row > 0 && board[row - 1][col].getAttribute('data-bomb') == 'set') {
        numBombNeighbors++
    }

    //top right
    if ( row > 0 && (col + 1) < height && board[row - 1][col + 1].getAttribute('data-bomb') == 'set') {
        numBombNeighbors++
    }

    //left
    if ( col > 0 && board[row][col - 1].getAttribute('data-bomb') == 'set') {
        numBombNeighbors++
    }

    // right
    if ( (col + 1) < width && board[row][col + 1].getAttribute('data-bomb') == 'set') {
        numBombNeighbors++
    }

    //bottom left
    if ( row + 1 < height && col > 0 && board[row + 1][col - 1].getAttribute('data-bomb') == 'set') {
        numBombNeighbors++
    }

    //bottom middle
    if ( row + 1 < height && board[row + 1][col].getAttribute('data-bomb') == 'set') {
        numBombNeighbors++
    }

    //bottom right
    if ( row + 1 < height && col + 1 < width && board[row + 1][col + 1].getAttribute('data-bomb') == 'set') {
        numBombNeighbors++
    }

    if (numBombNeighbors > 0) {
        square.innerHTML = numBombNeighbors
    }
}

function getLocation(square) {

    for (r = 0; r < height; r++) {
        for (c = 0; c < width; c++) {
            if (board[r][c] == square) {
                return [r, c]
            }
        }
    }
}

function fillBoard() {
    for (r = 0; r < height; r++) {
        for (c = 0; c < width; c++) {
            checkBomb(board[r][c])
        }
    }
}