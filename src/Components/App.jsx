import React, { useState } from 'react';
import '../styles/css/App.css';
import MainPage from './MainPage.jsx';
import MenuComponent from './MenuComponent.jsx';

function App() {
    const [gameStarted, setGameStarted] = useState(false);

    const startGame = () => {
        setGameStarted(true);
    };

    return (
        <div>
            {gameStarted ? <MainPage /> : <MenuComponent startGame={startGame} />}
        </div>
    );
}

export default App;