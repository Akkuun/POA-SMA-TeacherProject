import React, { useState } from 'react';
import '../styles/css/App.css';
import MainPage from './MainPage.jsx';
import MenuComponent from './MenuComponent.jsx';

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [sweetNumber, setSweetNumber] = useState(1);
    const [studentNumber, setStudentNumber] = useState(1);

    const startGame = () => {
        setGameStarted(true);
    };

    return (
        <div>
            {gameStarted ? (
                <MainPage
                    sweetNumber={sweetNumber}
                    studentNumber={studentNumber}
                    setSweetNumber={setSweetNumber}
                    setStudentNumber={setStudentNumber}
                />
            ) : (
                <MenuComponent
                    startGame={startGame}
                    sweetNumber={sweetNumber}
                    setSweetNumber={setSweetNumber}
                    studentNumber={studentNumber}
                    setStudentNumber={setStudentNumber}
                />
            )}
        </div>
    );
}

export default App;