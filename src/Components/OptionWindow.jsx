import React from 'react';
import '../styles/css/OptionWindow.css';

const OptionsWindow = ({ sweetNumber, studentNumber, setSweetNumber, setStudentNumber }) => {
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    return (
        <div className="options-window">
            <p>Options de la partie</p>
            <div className="parameter">
                <p>Nombre de bonbons : {sweetNumber}</p>
                <button className="minus" onClick={() => setSweetNumber(clamp(sweetNumber - 1, 1, Infinity))}>-</button>
                <button className="plus" onClick={() => setSweetNumber(sweetNumber + 1)}>+</button>
            </div>
            <div className="parameter">
                <p>Nombre d'élèves : {studentNumber}</p>
                <button className="minus" onClick={() => setStudentNumber(clamp(studentNumber - 1, 1, Infinity))}>-</button>
                <button className="plus" onClick={() => setStudentNumber(studentNumber + 1)}>+</button>
            </div>
        </div>
    );
};

export default OptionsWindow;