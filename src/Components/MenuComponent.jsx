import React from 'react';

const MenuComponent = ({ startGame, sweetNumber, setSweetNumber, studentNumber, setStudentNumber }) => {


    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    return (
        <div>
            <h1>Menu</h1>
            <h2>Nombre de bonbons : {sweetNumber}</h2>

            <button onClick={() => setSweetNumber(clamp(sweetNumber-1,1,sweetNumber))}>Retirer un bonbon</button>
            <button onClick={() => setSweetNumber(sweetNumber + 1)}>Ajouter un bonbon</button>
            <h2>Nombre d'élèves : {studentNumber}</h2>
            <button onClick={() => setStudentNumber(clamp(studentNumber-1,1,studentNumber))}>Retirer un élève</button>
            <button onClick={() => setStudentNumber(studentNumber + 1)}>Ajouter un élève</button>

            <button onClick={startGame}>Lancer la partie</button>
        </div>
    );
};

export default MenuComponent;