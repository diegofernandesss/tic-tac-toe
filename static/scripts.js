const socket = io()

const app = new Vue ({
  el: '#app',
  delimiters: ['{$', '$}'],
  data() {
    return {
      content: ["", "", "", "", "", "", "", "", ""],
      turn: true,
      isOver: false,
      winner: null,
      isTie: false 
    }
  },

  computed: {
    reloadContent() {
      return this.content
    }
  },

  methods: {
    draw(index, drawFromOther) {
      if (this.content[index] !== "") return
      // send event to socket.io
      if(this.turn) {
        // if turn is true then mark as X or mark as O)
        document.querySelector(`#block_${index}`).innerHTML = "X"
        this.content[index] = "X"
      } else {
        document.querySelector(`#block_${index}`).innerHTML = "0"
        this.content[index] = "O"
      }
      if (!drawFromOther) {
        socket.emit("play", index)
      }
      this.turn = !this.turn;
      this.calculateWinner();
      this.calculateTie();

      console.log('novo content', this.content)
    },
    calculateWinner() {
      const WIN_CONDITIONS = [
              // rows
              [0, 1, 2], [3, 4, 5], [6, 7, 8],
              // cols
              [0, 3, 6], [1, 4, 7], [2, 5, 8],
              // diagonals
              [0, 4, 8], [2, 4, 6]
      ];
      for (let i = 0; i < WIN_CONDITIONS.length; i++) {
        let firstIndex = WIN_CONDITIONS[i][0];
        let secondIndex = WIN_CONDITIONS[i][1];
        let thirdIndex = WIN_CONDITIONS[i][2];
        if(this.content[firstIndex] == this.content[secondIndex] &&
          this.content[firstIndex] == this.content[thirdIndex] &&
        this.content[firstIndex] != "") {
          this.isOver = true;
          this.winner = this.content[firstIndex];
        }
      }
    },
    calculateTie(){
      for (let i = 0 ; i<= 8 ; i++) {
        if(this.content[i] == "") {
          return
        }
      }
      this.isTie = true
    },
    resetBoard() {
      document.location.reload(true)
      for (let i=0; i<= 8; i++) {
        this.content[i] = ""
        this.isOver = false;
        this.winner = null
        this.isTie = false
      }
    }
  },
  created() {
    // this.socket = io()
    socket.on("play", (index) => {
      console.log("received index", index)
      this.draw(index, true)
    })
  }
})