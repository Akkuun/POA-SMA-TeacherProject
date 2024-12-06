import * as PIXI from 'pixi.js';
import OptionsWindow from './OptionWindow.jsx';
import Classroom, {classroom_ncols} from './Classroom';
import Student from './Student';
import {Action, Agent} from './Agent';
import {Teacher} from './Teacher';
import {DEBUG} from './Global';
import {Desk} from "./Desk.jsx";
import {useEffect} from "react";
import Graph from "./Graph.js";

const maxFPS = 10; // Changes the game's speed
const startRow = 4;
const endRow = 25;
const startCol = 4;
const endCol = 32;

const spacingX = 5;
const spacingY = 5;


let deskCount = 0;
let currentX = startCol;
let currentY = startRow;


const startRowTeacher = 4;
const endRowTeacher = 25;
const startColTeacher = 33;
const endColTeacher = classroom_ncols - 1;


function fillGridCell(nstudent, classroom, app) {
    while (deskCount < nstudent && (currentX <= endCol || currentY <= endRow)) { // while there are still desks to place and we haven't reached the end of the classroom
        if (currentY > endRow) {
            currentY = startRow;
            currentX += spacingX;
        }
        if (currentX > endCol) {
            break;
        }
        if (classroom._grid[currentY][currentX] === 0) {
            //log("Desk student added at", currentX, currentY);
            classroom.addDeskStudent(new Desk(currentX, currentY));
            classroom.addStudent(new Student(app, classroom));
            currentY += spacingY;
            deskCount++;
        }
    }
}

function fillGridCellDeskTeacher(nteacher, classroom, app) {
    let deskCountTeacher = 0;
    let currentXTeacher = startColTeacher;
    let currentYTeacher = startRowTeacher;

    const totalRowsTeacher = endRowTeacher - startRowTeacher + 1;

    const desksHeight = 3; // Height of each desk in grid units
    const totalDeskHeight = desksHeight * nteacher;
    const offsetY = Math.floor((totalRowsTeacher - totalDeskHeight) / 2);
    currentYTeacher = startRowTeacher + offsetY;

    while (deskCountTeacher < nteacher && (currentXTeacher <= endColTeacher || currentYTeacher <= endRowTeacher)) {
        if (currentYTeacher > endRowTeacher) {
            currentYTeacher = startRowTeacher + offsetY;
            currentXTeacher += spacingX;
        }
        if (currentXTeacher > endColTeacher) {
            break;
        }
        if (classroom._grid[currentYTeacher][currentXTeacher] === 0) {
            classroom.addDeskTeacher(new Desk(currentXTeacher, currentYTeacher));
            classroom.addTeacher(new Teacher(app, classroom));
            currentYTeacher += spacingY;
            deskCountTeacher++;
            //console.log("Desk teacher added at", currentXTeacher, currentYTeacher);
        }
    }
}

function displayClassroom(app, classroom) {
    PIXI.Assets.load('../../src/assets/map.png').then((texture) => {
        const terrainSprite = new PIXI.Sprite(texture);
        terrainSprite.width = window.innerWidth;  // Redimensionner pour prendre toute la largeur
        terrainSprite.height = window.innerHeight; // Redimensionner pour prendre toute la hauteur
        terrainSprite.x = (window.innerWidth - terrainSprite.width); // Centrer horizontalement
        terrainSprite.y = (window.innerHeight - terrainSprite.height); // Centrer verticalement
        terrainSprite.zIndex = -1;
        app.stage.addChild(terrainSprite);
    });
    //console.log("Classroom : ", classroom._grid);
    // Charger et afficher les bureaux
    for (let desk of classroom._desksStudent) {
        PIXI.Assets.load('../../src/assets/student_desk.png').then((texture) => {
            const deskSprite = new PIXI.Sprite(texture);
            deskSprite.zIndex = 10;
            deskSprite.width = desk.width;
            deskSprite.height = desk.height;
            deskSprite.anchor.set(0, 1);
            app.stage.addChild(deskSprite);
            desk.setSprite(deskSprite);
            desk.display();
        });
    }

    for (let desk of classroom._desksTeacher) {
        PIXI.Assets.load('../../src/assets/teacher_desk.png').then((texture) => {
            const deskSprite = new PIXI.Sprite(texture);
            deskSprite.zIndex = 10;
            deskSprite.width = desk.width;
            deskSprite.height = desk.height;
            deskSprite.anchor.set(0, 0.5);
            app.stage.addChild(deskSprite);
            desk.setSprite(deskSprite);
            desk.display();
            //console.log("Desk teacher displayed at", desk._coordGrid.x, desk._coordGrid.y);
        });
    }

    // Charger et afficher les students
    for (let student of classroom._students) {
        PIXI.Assets.load('../../src/assets/student.png').then((texture) => {
            const studentSprite = new PIXI.Sprite(texture);
            studentSprite.zIndex = 11;
            studentSprite.width = student._width;
            studentSprite.height = student._height;
            studentSprite.anchor.set(0.5, 1); // Set the anchor point to the center of the sprite to (1, 0.5) for each Agent's sprite to center it on the middle of the cell
            app.stage.addChild(studentSprite);
            student.setSprite(studentSprite);
            student.display();
        });
    }
}

// eslint-disable-next-line react/prop-types
const MainPage = ({sweetNumber, studentNumber, setSweetNumber, setStudentNumber}) => {
    const app = new PIXI.Application({
        width: window.innerWidth,  // Largeur de la fenêtre
        height: window.innerHeight, // Hauteur de la fenêtre
        backgroundColor: 0x1099bb,
        sortableChildren: true,
    });
    app.stage.sortableChildren = true;

    let root = document.getElementById("root");
    root.appendChild(app.view);

    const classroom = new Classroom(app);
    classroom.setCandy({x:30,y:10});

    const nstudent = 20;
    const nteacher = 1;
    
    fillGridCell(nstudent, classroom, app);
    fillGridCellDeskTeacher(nteacher, classroom, app);

    displayClassroom(app, classroom);


    //let graph = new Graph(classroom._grid);

    //let start = {x: classroom._students[0]._gridPos.x, y: classroom._students[0]._gridPos.y}; // for debugging first student coordinates
    //let start = { x: 1, y: 0};
//        let start = { x: 10, y: 32};
    //let destination = {x: 1, y: 23};


    // let destination = {x: classroom._desksTeacher[0]._coordGrid.x, y: classroom._desksTeacher[0]._coordGrid.y};
    // console.log(destination);
    // classroom.displayDebugGridCell(destination);
    // classroom.displayDebugGridCell(start);
    // classroom.displayDebugGridCell(start);
    // classroom.displayDebugGridCell(destination);
    classroom.displayDesks(app);

    //let path = graph.A_star(start, destination);
    // console.log("Path:", path);
    //graph.drawPath(path, app);
    //graph.displayCells(app);
    app.ticker.maxFPS = maxFPS;
    app.ticker.add(() => {
        for (let i = 0; i < nstudent; i++) {
            let student = classroom._students[i];
             console.log("Student", i, "is ", student);
            student.choseAgentAction();

            //  let destination = classroom._desksTeacher[0]._coordGrid;

            //  let student = classroom._students[i];
            // student.findPath(destination);


            // switch(i%4) {
            //     case 0:
            //         student.performAgentAction(Action.Up);
            //         break;
            //     case 1:
            //         student.performAgentAction(Action.Down);
            //         break;
            //     case 2:
            //         student.performAgentAction(Action.Left);
            //         break;
            //     case 3:
            //         student.performAgentAction(Action.Right);
            //         break;
            // }
        }
        if (DEBUG) classroom.displayDebugGrid(); // RED = Student, GREEN = Teacher, BLUE = Empty, BLACK = Something else
    });


    // Nettoyer l'application PIXI lors du démontage du composant
    return () => {
        app.destroy(true, {children: true});
    };

    return (
        <div id="pixi-container">
            <OptionsWindow
                sweetNumber={sweetNumber}
                studentNumber={studentNumber}
                setSweetNumber={setSweetNumber}
                setStudentNumber={setStudentNumber}
            />
        </div>
    );
}

export default MainPage;