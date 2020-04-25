const { createChessman, chessPieces, resetCounter } = require("./chessmanFactory");



function getRandomNumber(max){
    return Math.floor( Math.random() * max );
}

function getRandomArray(length, maxNumber){
    return ([...new Array(length)].map(() => getRandomNumber(maxNumber)));
}

function areDimensionsSame([x, y], [xX, yY]){
    return ((x === xX) && (y === yY));
}

function areDimensionsExistOnBoard(board, coordinates){
    return board.some((chessPiece) => areDimensionsSame(chessPiece.getPosition(), coordinates));
}

function getPosition(board){
    let coordinates = getRandomArray(2, 7);
    if(!(board.length === 0)){
        while(areDimensionsExistOnBoard(board, coordinates)){
            coordinates = getRandomArray(2, 7);
        }
    }
    return coordinates;
}

function addNewChessPiec(board){    
        const newChessmanName = chessPieces[getRandomNumber(chessPieces.length)];
        const position = getPosition(board);
        let newChessPiec = createChessman(position, newChessmanName);
        board.push(newChessPiec);
        return board;
}

export default class Game{
    
    static getGame(board = []){
        let possibleBeats = [];        
        resetCounter();
        
        while(true && board.length <= 64){
            board = addNewChessPiec(board);
            if(board.length < 2){
                continue;
            }else{
                possibleBeats = board.reduce((previuse, current) => {
                    let piecesToBeat = [];
                    board.forEach((piec) => {
                        let piecCoordinats = piec.getPosition();
                        let possibilityOfBeat = current.moveRange.some(move => areDimensionsSame(move, piecCoordinats));
                        if(possibilityOfBeat){ 
                            piecesToBeat.push(piec);
                        }
                    });
                    if(piecesToBeat.length > 0 ){
                        previuse.push({
                            piecChess: current,
                            piecesToBeat
                        })
                    }
                    return previuse;
                }, []);
            }
            if(possibleBeats.length > 0){
                break;
            }
        }
        let gameBoard = [...new Array(8)].map(() => new Array(8).fill(null));
            board.forEach( piece => {
                let [x, y] = piece.getPosition();
                gameBoard[x][y] = piece;
            });

        return {gameBoard, possibleBeats, history: board};
    }
}
