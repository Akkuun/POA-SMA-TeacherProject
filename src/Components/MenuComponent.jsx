import React, { useState } from 'react';

const MenuComponent = ({ startGame }) => {
    const [sweetNumber, setSweetNumber] = useState(0);
    const [studentNumber, setStudentNumber] = useState(0);

    return (
        <div>
            <h1>Menu</h1>
            <h2>Nombre de bonbons : {sweetNumber}</h2>
            <button onClick={() => setSweetNumber(sweetNumber + 1)}>Ajouter un bonbon</button>
            <button onClick={() => setSweetNumber(sweetNumber - 1)}>Retirer un bonbon</button>
            <h2>Nombre d'élèves : {studentNumber}</h2>
            <button onClick={() => setStudentNumber(studentNumber + 1)}>Ajouter un élève</button>
            <button onClick={() => setStudentNumber(studentNumber - 1)}>Retirer un élève</button>
            <button onClick={startGame}>Lancer la partie</button>
        </div>
    );
};

export default MenuComponent;