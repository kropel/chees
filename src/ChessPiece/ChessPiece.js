import React from "react";
import style from "./style.module.css";

const ChessPiece = ({img, name}) => {
    return (
        <div className={style.Squar}>
            <img src={img} alt={name} title={name}/>
        </div>
    );
}

export default ChessPiece;