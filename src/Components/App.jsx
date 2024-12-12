import React, {useState} from 'react';
import '../styles/css/App.css';
import MainPage from './MainPage.jsx';
import MenuComponent from './MenuComponent.jsx';

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [studentNumber, setStudentNumber] = useState(20);
    const [teacherNumber, setTeacherNumber] = useState(1);
    const [studentSpeed, setStudentSpeed] = useState(1);
    const [teacherSpeed, setTeacherSpeed] = useState(1);
    const [studentCandyStrategy, setStudentCandyStrategy] = useState("Probability");
    const [teacherFocusStrategy, setTeacherFocusStrategy] = useState("ClosestStudent");
    const [studentPathStrategy, setStudentPathStrategy] = useState("ShortestPath");

    const startGame = () => {
        setGameStarted(true);
    };

    return (
        <div>
            {gameStarted ? (
                <MainPage
                    studentNumber={studentNumber}
                    setStudentNumber={setStudentNumber}
                    teacherNumber={teacherNumber}
                    setTeacherNumber={setTeacherNumber}

                    studentSpeed={studentSpeed}
                    setStudentSpeed={setStudentSpeed}
                    teacherSpeed={teacherSpeed}
                    setTeacherSpeed={setTeacherSpeed}

                    studentCandyStrategy={studentCandyStrategy}
                    setStudentCandyStrategy={setStudentCandyStrategy}
                    teacherFocusStrategy={teacherFocusStrategy}
                    setTeacherFocusStrategy={setTeacherFocusStrategy}
                    studentPathStrategy={studentPathStrategy}
                    setStudentPathStrategy={setStudentPathStrategy}
                />
            ) : (
                <MenuComponent
                    startGame={startGame}
                    studentNumber={studentNumber}
                    setStudentNumber={setStudentNumber}
                    teacherNumber={teacherNumber}
                    setTeacherNumber={setTeacherNumber}
                    
                    studentSpeed={studentSpeed}
                    setStudentSpeed={setStudentSpeed}
                    teacherSpeed={teacherSpeed}
                    setTeacherSpeed={setTeacherSpeed}

                    studentCandyStrategy={studentCandyStrategy}
                    setStudentCandyStrategy={setStudentCandyStrategy}
                    teacherFocusStrategy={teacherFocusStrategy}
                    setTeacherFocusStrategy={setTeacherFocusStrategy}
                    studentPathStrategy={studentPathStrategy}
                    setStudentPathStrategy={setStudentPathStrategy}
                />
            )}
        </div>
    );
}

export default App;