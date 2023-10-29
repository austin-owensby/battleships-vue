export enum SpaceState {
  Empty,
  Water,
  Submarine,
  Center,
  EndLeft,
  EndRight,
  EndTop,
  EndBottom,
  UnknownShip
}

class Position {
  x = 0
  y = 0
  isHorizontal = true
}

class Point {
  x = 0
  y = 0
}

export class BoardService {
  public static createBoard (size: number, shipSizes: number[]) {
    let board = this.initializeBoard(size)
    board = this.generateBoard(board, shipSizes)
    return board
  }

  public static generatePuzzle (board: SpaceState[][], shipSizes: number[]): SpaceState[][] {
    const puzzle = this.initializeBoard(board.length)
    // Generate a puzzle by removing a square at random and then checking if the puzzle is still solvable
    let points: Point[] = []
    for (let y = 0; y < puzzle.length; y++) {
      for (let x = 0; x < puzzle.length; x++) {
        puzzle[y][x] = board[y][x]
        points.push({
          x,
          y
        })
      }
    }

    points = this.shuffle(points)

    for (const point of points) {
      const originalState = puzzle[point.y][point.x]
      puzzle[point.y][point.x] = SpaceState.Empty

      if (!this.isSolvable(puzzle, shipSizes)) {
        // Add the point back since it's required to solve the puzzle
        puzzle[point.y][point.x] = originalState
      }
    }

    return puzzle
  }

  // Create an empty grid
  static initializeBoard (size: number): SpaceState[][] {
    const board: SpaceState[][] = []
    for (let y = 0; y < size; y++) {
      const row: number[] = []
      for (let x = 0; x < size; x++) {
        row.push(SpaceState.Empty)
      }
      board.push(row)
    }

    return board
  }

  static generateBoard (board: SpaceState[][], shipSizes: number[]): SpaceState[][] {
    let errorInGeneration = false

    let attempts = 0

    do {
      attempts++
      if (attempts > 1) {
        break
      }
      errorInGeneration = false

      for (const shipSize of shipSizes) {
        const positions = this.getPositionsForShip(board, shipSize)

        if (positions.length === 0) {
          // There were no available spaces for the ship, regenerate the whole board
          errorInGeneration = true
          board = this.initializeBoard(board.length)
          break
        } else {
          // Select a random position
          const position = positions[Math.floor(Math.random() * positions.length)]

          // Place the ship at the position and surround with water
          if (position.isHorizontal) {
            // Loop 1 row above and below
            for (let y = Math.max(0, position.y - 1); y <= Math.min(board.length - 1, position.y + 1); y++) {
              // Loop 1 column before and after
              for (let x = Math.max(0, position.x - 1); x <= Math.min(board.length - 1, position.x + shipSize); x++) {
                if (y !== position.y || x === position.x - 1 || x === position.x + shipSize) {
                  board[y][x] = SpaceState.Water
                } else if (x > position.x && x < position.x + shipSize - 1) {
                  board[y][x] = SpaceState.Center
                } else if (shipSize === 1) {
                  board[y][x] = SpaceState.Submarine
                } else if (x === position.x) {
                  board[y][x] = SpaceState.EndLeft // <
                } else {
                  board[y][x] = SpaceState.EndRight // >
                }
              }
            }
          } else {
            // Loop 1 column before and after
            for (let y = Math.max(0, position.y - 1); y <= Math.min(board.length - 1, position.y + shipSize); y++) {
              // Loop 1 row above and below
              for (let x = Math.max(0, position.x - 1); x <= Math.min(board.length - 1, position.x + 1); x++) {
                if (x !== position.x || y === position.y - 1 || y === position.y + shipSize) {
                  board[y][x] = SpaceState.Water
                } else if (y > position.y && y < position.y + shipSize - 1) {
                  board[y][x] = SpaceState.Center
                } else if (shipSize === 1) {
                  board[y][x] = SpaceState.Submarine
                } else if (y === position.y) {
                  board[y][x] = SpaceState.EndTop // ^
                } else {
                  board[y][x] = SpaceState.EndBottom // v
                }
              }
            }
          }
        }
      }
    }
    while (errorInGeneration)

    // Fill in remaining empty spaces with water
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board.length; x++) {
        if (board[y][x] === SpaceState.Empty) {
          board[y][x] = SpaceState.Water
        }
      }
    }

    return board
  }

  static getPositionsForShip (board: SpaceState[][], shipSize: number): Position[] {
    const positions: Position[] = []

    // puzzle each cell and each direction for a valid space
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board.length; x++) {
        let horizontalValid = true
        let verticalValid = true

        for (let offset = 0; offset < shipSize; offset++) {
          if (horizontalValid && ((x + offset >= board.length) || board[y][x + offset] !== SpaceState.Empty)) {
            horizontalValid = false
          }

          if (verticalValid && ((y + offset >= board.length) || board[y + offset][x] !== SpaceState.Empty)) {
            verticalValid = false
          }
        }

        // Add the valid positions to the list
        if (horizontalValid) {
          positions.push({
            x,
            y,
            isHorizontal: true
          })
        }
        if (verticalValid) {
          positions.push({
            x,
            y,
            isHorizontal: false
          })
        }
      }
    }

    return positions
  }

  static isSolvable (board: SpaceState[][], shipSizes: number[]) : boolean {
    // TODO add rules to attempt to solve the puzzle
    return true
  }

  static shuffle (array: Point[]): Point[] {
    let currentIndex = array.length
    let randomIndex

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }

    return array
  }
}
