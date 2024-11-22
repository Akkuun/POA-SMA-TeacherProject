import React from 'react';
import '../styles/css/OptionWindow.css';

const OptionsWindow = ({ sweetNumber, studentNumber }) => {
    return (
        <div className="options-window">
            <p>Options de la partie</p>
            <p>Nombre de bonbons : {sweetNumber}</p>
            <p>Nombre d'élèves : {studentNumber}</p>
        </div>
    );
};

export default OptionsWindow;