<template>
  <div id="app">
    <div id="board">
      <div class="row" v-for="(row, index) in board" :key="index">
        <div class="cell" v-for="(cell, innerIndex) in row" :key="innerIndex">
          <img v-if="cell === SpaceState.Water" src="./assets/Water.png">
          <img v-else-if="cell === SpaceState.Submarine" src="./assets/Submarine.png">
          <img v-else-if="cell === SpaceState.Center" src="./assets/Center.png">
          <img v-else-if="cell === SpaceState.EndLeft" src="./assets/End.png">
          <img v-else-if="cell === SpaceState.EndRight" src="./assets/End.png" class="right">
          <img v-else-if="cell === SpaceState.EndTop" src="./assets/End.png" class="top">
          <img v-else-if="cell === SpaceState.EndBottom" src="./assets/End.png" class="bottom">
          <img v-else-if="cell === SpaceState.UnknownShip" src="./assets/Center.png" class="center">
        </div>
        <div class="cell">{{ answer[index].filter(r => r !== SpaceState.Water).length }}</div>
      </div>
      <div class="row">
        <div class="cell" v-for="(row, index) in answer" :key="index">{{ answer.filter(r => r[index] !== SpaceState.Water).length }}</div>
        <div class="cell">
          <img src="./assets/Center.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BoardService, SpaceState } from '@/services/BoardService'

@Component
export default class App extends Vue {
  private size = 10;
  private shipSizes: number[] = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  public board: SpaceState[][] = [];
  public answer: SpaceState[][] = [];
  public SpaceState = SpaceState;

  created () {
    this.answer = BoardService.createBoard(this.size, this.shipSizes)
    this.board = BoardService.generatePuzzle(this.answer, this.shipSizes)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#board {
  border: 3px solid black;
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: auto;
}

.row {
  display: flex;
}

.cell {
  border: 3px solid black;
  width: 3rem;
  height: 3rem;
  font-size: 3rem;
}

.cell img {
  width: 3rem;
  height: 3rem;
}

.cell img.center {
  width: 2.5rem;
  height: 2.5rem;
  margin-top: .25rem;
}

.cell img.top {
  rotate: 90deg;
}

.cell img.right {
  rotate: 180deg;
}

.cell img.bottom {
  rotate: 270deg;
}
</style>
