const chessmanFactory = (()=>{

let counter = 1;

class Chessman {
    constructor(position, name){
        this.position = position; // [x, y]
        this.name = name; // "string"
        this.range = 0;
        this.moveVectors = [[0, 0]];
        this.moveRange = [];
        this.counter = counter++;
        this.img = "";
    }
    setPosition(position){ 
        this.position = position;
        this.setMoveRange();
    }

    setMoveRange(){
        let [positionX, positionY] = this.position;
        this.moveRange = this.moveVectors.reduce((accumulator, current) => {
          let tempMoveRange = [];
          for (let i = 1; i <= this.range; i++) {
            let [xCurrent, yCurrent] = current;
            let rangeX = xCurrent * i + positionX;
            let rangeY = yCurrent * i + positionY;
            if(
              rangeX >= 0 &&
              rangeX <= 7 &&
              rangeY >= 0 &&
              rangeY <= 7
            ){
              tempMoveRange.push([rangeX, rangeY]);
            }            
          }
          return accumulator.concat(tempMoveRange);
        }, []);
    }

    getMoveRange(){ return this.moveRange; }

    getPosition(){ return this.position; }

    getName(){ return this.name; }

    getFullName(){ return `(${this.counter})${this.name} on position ${this.position[0]}/${this.position[1]}`; }

    getImg(){
      return this.img;
    }
    
}

class King extends Chessman{
    constructor(position){
        super(position, "King")
        this.range = 1;
        this.img = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/50px-Chess_kdt45.svg.png";
        this.moveVectors = [
            [-1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, -1]
          ];
        this.setMoveRange();
    }
}

class Queen extends Chessman {
    constructor(position) {
      super(position, "Queen");
      this.range = 7;
      this.img = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/50px-Chess_qdt45.svg.png";
      this.moveVectors = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1]
      ];
      this.setMoveRange();
    }
  }

  class Rock extends Chessman {
    constructor(position) {
      super(position, "Rock");
      this.range = 7;
      this.img = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/50px-Chess_rdt45.svg.png";
      this.moveVectors = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1]
      ];
      this.setMoveRange();
    }
  }

  class Bishop extends Chessman {
    constructor(position) {
      super(position, "Bishop");
      this.range = 7;
      this.img = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/50px-Chess_bdt45.svg.png";
      this.moveVectors = [
        [-1, 1],
        [1, 1],
        [1, -1],
        [-1, -1]
      ];
      this.setMoveRange();
    }
  }

  class Knight extends Chessman {
    constructor(position) {
      super(position, "Knight");
      this.range = 1;
      this.img = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/50px-Chess_ndt45.svg.png";
      this.moveVectors = [
        [-1, 2],
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1]
      ];
      this.setMoveRange();
    }
  }

return {
    chessPieces: ["king", "queen", "rock", "bishop", "knight"],
    createChessman: ( position, name ) => {
        const [x, y] = position;
        const chessman = {
          king: King,
          queen: Queen,
          rock: Rock,
          bishop: Bishop,
          knight: Knight,
        };
        let errorMessage = "";
        if (
          x < 0 ||
          x > 7 ||
          y < 0 ||
          y > 7
        ) {
          errorMessage += "Position is out of board.\n";
        }
        if (!Object.keys(chessman).includes(name)) {
          errorMessage += `Name "${name}" is incorrect.\n`;
        }
        if (!!errorMessage) {
          throw new Error(errorMessage);
        }
        return new chessman[name](position);
      },
      resetCounter: () => { counter = 1; }
};

})();



module.exports = chessmanFactory;