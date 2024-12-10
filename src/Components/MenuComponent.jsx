import React from 'react';

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
                            setTeacherSpeed 
                       }) => {


    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    return (
        <div>
            <h1>Menu</h1>
            <h2>Number of candy : {sweetNumber}</h2>

            <button onClick={() => setSweetNumber(clamp(sweetNumber - 1, 1, sweetNumber))}>Remove sweet jar</button>
            <button onClick={() => setSweetNumber(sweetNumber + 1)}>Add sweet jar</button>
            <h2>Number of students : {studentNumber}</h2>
            <button onClick={() => setStudentNumber(clamp(studentNumber - 1, 1, studentNumber))}>Remove student
            </button>
            <button onClick={() => setStudentNumber(studentNumber + 1)}>Add student</button>
            <h2>Number of teachers : {teacherNumber}</h2>
            <button onClick={() => setTeacherNumber(clamp(teacherNumber - 1, 1, teacherNumber))}>Remove teacher
            </button>
            <button onClick={() => setTeacherNumber(teacherNumber + 1)}>Add teacher</button>
            <h2>Student speed : {studentSpeed}</h2>
            <button onClick={() => setStudentSpeed(clamp(studentSpeed - 1, 1, studentSpeed))}>Decrease speed</button>
            <button onClick={() => setStudentSpeed(studentSpeed + 1)}>Increase speed</button>
            <h2>Teacher speed : {teacherSpeed}</h2>
            <button onClick={() => setTeacherSpeed(clamp(teacherSpeed - 1, 1, teacherSpeed))}>Decrease speed</button>
            <button onClick={() => setTeacherSpeed(teacherSpeed + 1)}>Increase speed</button>

            <button onClick={startGame}>Launch game</button>
        </div>
    );
};

export default MenuComponent;