Mousetrap.bind('left', function () {

  game.left();
  game.spawn();

});

Mousetrap.bind('right', function () {

  game.right();
  game.spawn();

});

Mousetrap.bind('up', function () {

  game.up();
  game.spawn();

});

Mousetrap.bind('down', function () {

  game.down();
  game.spawn();

});

var directionEnum = {

  CLOCKWISE: 0,

  COUNTERCLOCKWISE: 1

}

var board = {

  array: [
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    0,0,0,0
  ],

  init: function () {

    for (var i = 0 ; i < 16 ; i++) {

      if (Math.random() < 0.4)
        this.array[i] = 2;

      var cell = document.getElementById("cell" + i);
      cell.firstChild.innerHTML = this.array[i] || "";

    }

    game.updateDOM();

  },

  at: function (row, col) {

    return this.array[col + row * 4];

  },

  set: function (row, col, val) {

    if (this.array[col + row * 4] != val)
      game.shouldSpawn = true;

    this.array[col + row * 4] = val;

  },

  reverse: function () {

    this.array.reverse();

  },

  /* rotate the board clockwise once */
  rotate: function () {

    var boardCopy = this.array.slice();

    for (var row = 0 ; row < 4 ; row++)
      for (var col = 0 ; col < 4 ; col++)
        boardCopy[col + row * 4] = this.array[row + 4 * (3 - col)];

    this.array = boardCopy.slice();

  },

  spawn: function () {

    var emptyCells = [];

    for (var i = 0 ; i < 16 ; i++) {

      if (this.array[i] == 0)
        emptyCells.push(i);

    }

    var chosenCell = Math.floor(Math.random() * (emptyCells.length - 1));

    var spawnValue = 2;

    if (Math.random() < 0.2)
      spawnValue = 4;

    var spawnIndex = emptyCells[chosenCell];
    this.array[spawnIndex] = spawnValue;

  }

};

var game = {

  shouldSpawn: false,

  right: function () {

    game.shouldSpawn = false;

    for (var row = 0 ; row < 4 ; row++) {

      var newRow = [];

      var skipNextCell = false;

      /* merge adjacent equal cells */
      for (var col = 3 ; col >= 0 ; col--) {

        currCell = board.at(row, col);

        if (currCell === 0)
          continue;

        if (newRow.length && newRow[newRow.length - 1] === currCell && !skipNextCell) {

          skipNextCell = true;
          newRow[newRow.length - 1] *= 2;

        }

        else {

          skipNextCell = false;
          newRow.push(currCell);

        }

      }

      // console.log(newRow);

      /* Now, newRow is actually the reverse of what the
       * new row should look like.
       * So now we copy newRow (in reverse) into the board row
       * It may be that newRow.length < 4, so we run another for loop
       * to "cleanup" the first one
       */

      var i = 0;
      for ( ; i < newRow.length ; i++)
        board.set(row, 3 - i, newRow[i]);

      for (var j  = i ; j < 4 ; j++)
        board.set(row, 3 - j, 0);

    }

  },

  /* Flip the board about a vertical axis, call right(), flip again */
  left: function () {

    board.reverse();
    this.right();
    board.reverse();

  },

  up: function () {

    board.rotate();
    this.right();
    board.rotate();
    board.rotate();
    board.rotate();

  },

  down: function () {

    board.rotate();
    board.rotate();
    board.rotate();
    this.right();
    board.rotate();

  },

  updateDOM: function () {

    for (var i = 0; i < board.array.length; i++) {

      var currCell = document.getElementById('cell' + i);

      var val = board.array[i];

      if (val) {

        currCell.className = "cell _" + board.array[i];
        currCell.firstChild.innerHTML = val;

      }

      else {

        currCell.className = "cell";
        currCell.firstChild.innerHTML = "";

      }

    }

  },

  /* Spawn a new tile if need be */
  spawn: function () {

    game.updateDOM();

    if (game.shouldSpawn) {

      board.spawn();
      game.updateDOM();
      
    }

  }

};

board.init();