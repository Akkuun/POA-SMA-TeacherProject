import React from 'react';
import MapDark from '../../src/assets/map_dark.png';
import '../../src/styles/css/MenuComponent.css';

const MenuComponent = ({
                           startGame,
                           sweetNumber,
                           setSweetNumber,
                           studentNumber,
                           setStudentNumber,
                           setTeacherNumber,
                           teacherNumber,
                           studentSpeed,
                           setStudentSpeed,
                           teacherSpeed,
                           setTeacherSpeed,
                           studentCandyStrategy,
                           setStudentCandyStrategy,
                           teacherFocusStrategy,
                           setTeacherFocusStrategy,
                       }) => {

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    return (
        <div id="menu" style={{ backgroundImage: `url(${MapDark})` }}>
            <h1>Menu</h1>
            <div id="menu-columns">
                <div id="menu-column">
                    <h2>Teacher Parameters</h2>
                    <h2>Number of teachers: {teacherNumber}</h2>
                    <button onClick={() => setTeacherNumber(clamp(teacherNumber - 1, 1, teacherNumber))}>Remove teacher</button>
                    <button onClick={() => setTeacherNumber(teacherNumber + 1)}>Add teacher</button>
                    <h2>Teacher speed: {teacherSpeed}</h2>
                    <button onClick={() => setTeacherSpeed(clamp(teacherSpeed - 1, 1, teacherSpeed))}>Decrease speed</button>
                    <button onClick={() => setTeacherSpeed(teacherSpeed + 1)}>Increase speed</button>
                    <h2>Teacher focus strategy</h2>
                    <select value={teacherFocusStrategy} onChange={(e) => setTeacherFocusStrategy(e.target.value)}>
                        <option value="ClosestStudent">Closest Student</option>
                        <option value="ClosestStudentFocused">Closest Student Focused</option>
                    </select>
                </div>
                <div id="menu-column">
                    <h2>Student Parameters</h2>
                    <h2>Number of students: {studentNumber}</h2>
                    <button onClick={() => setStudentNumber(clamp(studentNumber - 1, 1, studentNumber))}>Remove student</button>
                    <button onClick={() => setStudentNumber(studentNumber + 1)}>Add student</button>
                    <h2>Student speed: {studentSpeed}</h2>
                    <button onClick={() => setStudentSpeed(clamp(studentSpeed - 1, 1, studentSpeed))}>Decrease speed</button>
                    <button onClick={() => setStudentSpeed(studentSpeed + 1)}>Increase speed</button>
                    <h2>Student candy strategy</h2>
                    <select value={studentCandyStrategy} onChange={(e) => setStudentCandyStrategy(e.target.value)}>
                        <option value="Probability">Probability</option>
                        <option value="WhenTeacherIsFarBehind">When teacher is far behind</option>
                        <option value="WhenAnotherStudentStartsMoving">When another student starts moving</option>
                        <option value="Every5Seconds">Every 5 seconds</option>
                        <option value="Random">Random</option>
                    </select>
                </div>
                <div id="menu-column">
                    <h2>Game Parameters</h2>
                    <h2>Number of candy: {sweetNumber}</h2>
                    <button onClick={() => setSweetNumber(clamp(sweetNumber - 1, 1, sweetNumber))}>Remove sweet jar</button>
                    <button onClick={() => setSweetNumber(sweetNumber + 1)}>Add sweet jar</button>
                    <button onClick={startGame} id="start-game">Start Game</button>
                </div>
            </div>
        </div>
    );
};

export default MenuComponent;