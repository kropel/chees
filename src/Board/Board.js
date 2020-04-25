import React, {useState, useEffect} from "react";
import ChessPiece from "../ChessPiece/ChessPiece"
import style from "./style.module.css";
import Game from "../services/services"


const Board = () => {
    let [board, mutationBoard] = useState([...new Array(8)].map(() => new Array(8).fill(null)));
    let [gamepaly, mutationGameplay] = useState([]);
    let [range, mutationRange] = useState([]);
    let [selfPoint, mutationSelfPoint] = useState([]);
    let [selectedPiec, mutationSelectedPiec] = useState(null);
    let [history, mutationHistory] = useState([]);

    useEffect(() =>{
        reloadGame();
    },[]);

    function reloadGame(historyBoard = []){
        console.log(historyBoard)
        clearRangeOnClick();
        let {gameBoard, possibleBeats, history} = Game.getGame(historyBoard);
        mutationGameplay(possibleBeats);
        mutationBoard(gameBoard);
        mutationHistory(history);
    }

    function areDimensionsSame([x, y], [xX, yY]){
        return ((x === xX) && (y === yY));
    }

    function showRange(piece){
        mutationRange(piece.getMoveRange());
        mutationSelfPoint(piece.getPosition());
    }
    function clearRangeOnMouseLeave(){
        mutationRange([]);
        mutationSelfPoint([]);
        if(selectedPiec){ showRange(selectedPiec) };
    }

    function clearRangeOnClick(){
        mutationSelectedPiec(null)
        mutationRange([]);
        mutationSelfPoint([]);
    }
    function selesctPiecOrBeat(piece){
        if(!!selectedPiec){
            console.log(selectedPiec,"\n",piece);
            let isInRange = selectedPiec.getMoveRange().some(coordinates => areDimensionsSame(coordinates, piece.getPosition()));
            if(isInRange){
                let pieceIndex = history.findIndex( tempPiece => areDimensionsSame(tempPiece.getPosition(), piece.getPosition()));
                selectedPiec.setPosition(piece.getPosition());
                history.splice(pieceIndex, 1);                
                reloadGame(history);
            } else{
                mutationSelectedPiec(piece);
                showRange(piece);
            }         
        }else{
        mutationSelectedPiec(piece);
        showRange(piece);
        }
    }
    function emptyClick(coordinates){
        console.log(coordinates);
        let inRange = range.some(position => areDimensionsSame(position, coordinates));
        if(inRange && selectedPiec){
            selectedPiec.setPosition(coordinates);
            reloadGame(history);
        }else {
            mutationSelectedPiec(null);
            clearRangeOnClick();
        }
    }
    function addHoverStyle(event){
        event.target.className += ` ${style.Hover}`;
    }
    function removeHoverStyle(event){
        event.target.className = event.target.className.replace(` ${style.Hover}`, "");
    }

    

    let message = gamepaly.map(({piecChess, piecesToBeat}, indexGame) => {
        let beatMessage = `${piecChess.getFullName()} can beat `;
        piecesToBeat.forEach( (piece, index) => {
            if(index === 0){
                beatMessage += ` ${piece.getFullName()}`;
            }else {
                beatMessage += ` or ${piece.getFullName()}`;
            }
        });
        return(
            <li key={indexGame}
                onMouseEnter={(event) => {
                                showRange(piecChess);
                                addHoverStyle(event); }}
                onMouseLeave={(event) => { 
                                clearRangeOnMouseLeave();
                                removeHoverStyle(event)}}
                className={style.BeatList}
                onClick={()=>{
                    mutationSelectedPiec(piecChess);
                    showRange(piecChess);
                }}>
                {beatMessage}.
            </li>
        );
    });
    
    let chessBoard = board.map( (row, rowIndex) => 
        <div className={style.Row} key={rowIndex}>
            { row.map( (chessPiece, columnIndex) => {
                        let squerStyle = style.Squar;
                        let inRange = range.some( coordinates => areDimensionsSame(coordinates, [rowIndex, columnIndex]));
                        let beat = chessPiece ? range.some( coordinates => areDimensionsSame(coordinates, chessPiece.getPosition())) : false;
                        let self = chessPiece ? areDimensionsSame([rowIndex, columnIndex], selfPoint) : false;
                        let isPiece = chessPiece ? true : false;
                        if(beat){
                            squerStyle += ` ${style.Beat}`;
                        }else if(inRange){
                            squerStyle += ` ${style.InRange}`;
                        }else if(self) {
                            squerStyle += ` ${style.Self}`;
                        }
                        if(isPiece){
                            squerStyle += ` ${style.IsPiece}`;
                        }
                        
                        return (<div className={squerStyle}
                                    key={`${rowIndex}${columnIndex}`}
                                    onMouseEnter={() => {if(chessPiece){showRange(chessPiece)}}}
                                    onMouseLeave={clearRangeOnMouseLeave}
                                    onClick={() => { 
                                            if(chessPiece){
                                                selesctPiecOrBeat(chessPiece);
                                            }else{
                                                emptyClick([rowIndex, columnIndex]);                                               
                                            }
                                            }}> 
                                        {chessPiece ? <ChessPiece 
                                                        img={chessPiece.getImg()} 
                                                        name={chessPiece.getFullName()} /> 
                                                    : null} 
                        </div>); 
                    }               
                ) 
            }
        </div> );

    return (       
        <div className={style.Game}>
            <button onClick={() => reloadGame()}>Reload Game</button>
            <article className={style.Game}>
                {chessBoard}
                <ul className={style.Message}>
                    {message}
                </ul>                
            </article>
        </div>
    );
};

export default Board;
