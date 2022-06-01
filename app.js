document.addEventListener("DOMContentLoaded", () =>{

const grid = document.querySelector(".grid")
let squares = Array.from(document.querySelectorAll(".grid div"))
const ScoreDisplay = document.querySelector("#score")
const StartBtn = document.querySelector("#start-button")
const width= 10
let nextRandom = 0
let timerId
let score = 0
const colors = [
  "orange",
  "red",
  "purple",
  "green",
  "blue",
]

// Los Bloquecitos

const lTetromino = [
  [1, width+1, width*2+1, 2],
  [width, width+1, width+2, width*2+1],
  [1, width+1, width*2+1, width*2],
  [width, width*2, width*2+1, width*2+2]
]
const zTetromino = [
  [0, width, width+1, width*2+1],
  [width+1, width+2, width*2, width*2+1],
  [0, width, width+1, width*2+1],
  [width+1, width+2, width*2, width*2+1]
]
const tTetromino = [
  [1, width, width+1,width+2],
  [1, width+1,width+2, width*2+1],
  [width, width+1, width+2, width*2+1],
  [1, width, width+1, width*2+1]
]

const oTetromino = [
  [0,1,width,width+1],
  [0,1,width, width+1],
  [0,1, width, width +1],
  [0,1, width, width +1]
]
const iTetromino = [
[1, width+1, width*2+1,width*3+1 ],
[width, width+1, width+2, width+3],
[1, width+1,width*2+1, width*3+1],
[width, width+1, width+2, width+3 ]

]

const theTetrominoes = [ lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

// Definimos la posicion incial

let currentPosition = 4
let currentRotation =0
// Vamos a seleccionar uno de los Tetrominos de manera aleatoria

let random= Math.floor(Math.random()*theTetrominoes.length)

let current = theTetrominoes[random][currentRotation]


// Dibujamos la primera figura

function draw () {
  current.forEach(index => {
    squares[currentPosition + index].classList.add("tetromino")
    // añadimos los colores del tetromino cuando lo dibujamos
    squares [currentPosition + index].style.backgroundColor = colors [random]
  })
}

// Desdibujar el Tetronomio

function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove("tetromino")
    // añadimos los colores del tetromino cuando lo desdibujamos
    squares[currentPosition + index].style.backgroundColor = ""
  });
}


// Hacer que el tetromino se mueva para abajo cada segundo

// timerId= setInterval(moveDown, 1000)

// Asignar funciones a los codigos

function control(e) {
if (e.keyCode === 37){
  moveLeft()
} else if (e.keyCode === 38) {
  rotate()
} else if (e.keyCode === 39) {
  moveRight()
} else if ( e.keyCode === 40 ) {
  moveDown()
}

}
document.addEventListener("keyup", control)

// Funcion para que se mueva para abajo.

function moveDown() {
  undraw()
  currentPosition += width
  draw()
  freeze()
}

// Freeze function

function freeze(){
  if(current.some(index=> squares [currentPosition + index + width].classList.contains("taken"))) {
    current.forEach(index=> squares[currentPosition + index].classList.add("taken"))

    // Empezar otra figura que se desplaza para abajo
    random = nextRandom
    nextRandom = Math.floor(Math.random()* theTetrominoes.length)
    current = theTetrominoes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    //Añadimos la parte del gameover a la funcion de Freeze
    gameOver()

  }
}



// Mover el tetromino a la izquierda a menos que este al limite del panel

function moveLeft() {
  undraw()
  const isALeftEdge = current.some(index=> ( currentPosition + index) % width ===0)

  if(!isALeftEdge) currentPosition -=1

  if(current.some (index => squares[currentPosition + index].classList.contains("taken"))) {
    currentPosition +=1
  }
  draw()
}


// Mover el tetromino para la derecha a menos que este al limite del bloque


function moveRight (){

  undraw()

  const isARightEdge = current.some (index => ( currentPosition + index) % width === width -1)

  if ( !isARightEdge) currentPosition +=1

  if( current.some (index => squares [ currentPosition + index].classList.contains("taken"))){
    currentPosition -=1
  }
  draw()
}


// Rotar el tetromino

function rotate (){
  undraw()
  currentRotation ++

   if(currentRotation=== current.length) {//si la rotacion en momento esta en 4, hacerla volver a 0
    currentRotation = 0
  }
  current = theTetrominoes [random][currentRotation]
  draw()
}

// Enseñar el sigueinte tetromino en la pantalla

const displaySquares = document.querySelectorAll(".mini-grid div")
const displayWidth = 4
let displayIndex = 0

// Los tetrominos sin rotacion

const upNextTetrominoes = [
[1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
[0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
[1, displayWidth, displayWidth+1, displayWidth+2], // theTetromino
[0, 1, displayWidth, displayWidth+1], //oTetromino
[1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

// Poner el Tetromino en el mini pantalla

function displayShape() {
  //Quita cualquier rastro del tetromono cuando entra al juego
  displaySquares.forEach (square => {
    square.classList.remove ("tetromino")
    square.style.backgroundColor = ""
  })
  upNextTetrominoes [nextRandom].forEach ( index => {
    displaySquares[displayIndex + index].classList.add("tetromino")
    displaySquares[displayIndex + index].style.backgroundColor = colors [nextRandom]
  })
}


// Añadir funcionalidad al boton

StartBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval (timerId)
    timerId= null
  } else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
  }
})

// Añadir marcador

function addScore() {

  for (let i = 0; i< 199; i +=width){

    const row = [i, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if (row.every(index => squares[index].classList.contains("taken"))){
      score +=10
      ScoreDisplay.innerHTML = score
      row.forEach(index => {
        squares[index].classList.remove("taken")
        squares[index].classList.remove("tetromino") //Esto es lo que hace que desapàrezcan los bloques
        squares[index].style.backgroundColor = ""
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}

//Game over

function gameOver() {

  if(current.some( index=> squares [currentPosition + index].classList.contains("taken"))){
    ScoreDisplay.innerHTML = "end"
    clearInterval (timerId)
  }
}





});
