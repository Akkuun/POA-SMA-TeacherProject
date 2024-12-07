import * as PIXI from 'pixi.js';
import OptionsWindow from './OptionWindow.jsx';
import Classroom, {classroom_ncols, GridCoordsToDisplayCoords} from './Classroom';
import Student from './Student';
import {Teacher} from './Teacher';
import {DEBUG, DownVector, vecDot, vecLength, WindowHeight, WindowWidth} from './Global';
import {Desk} from "./Desk.jsx";

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


const nteacher = 2;

let nCandiesTaken = 0;


function updateCandiesTakenText(candiesTakenText) {
    if (candiesTakenText.style.fontFamily !== 'Chalkboard') {
        try {
            candiesTakenText.style.fontFamily = 'Chalkboard';
        } catch (e) {
            console.log(e);
        }
    }
    candiesTakenText.text = 'Candies taken: ' + nCandiesTaken;
}

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
            classroom.addDeskStudent(new Desk(currentX, currentY));
            classroom.addStudent(new Student(app, classroom));
            currentY += spacingY;
            deskCount++;
        }
    }
}

function fillDeskInClassroom(nteacher, classroom, app) {
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
    for (let teacher of classroom._teachers) {
        PIXI.Assets.load('../../src/assets/teacher.png').then((texture) => {
            const teacherSprite = new PIXI.Sprite(texture);
            teacherSprite.zIndex = 11;
            teacherSprite.width = teacher._width;
            teacherSprite.height = teacher._height;
            teacherSprite.anchor.set(0.5, 1); // Set the anchor point to the center of the sprite to (1, 0.5) for each Agent's sprite to center it on the middle of the cell
            app.stage.addChild(teacherSprite);
            teacher.setSprite(teacherSprite);
            teacher.display();
        });
    }

    // Charger et afficher les bonbons
    let candy = classroom._candy;
    PIXI.Assets.load('../../src/assets/jar_candy_full.png').then((texture) => {
        const candySprite = new PIXI.Sprite(texture);
        candySprite.zIndex = 11;
        candySprite.width = 20;
        candySprite.height = 20;
        candySprite.anchor.set(0.5, 1)
        app.stage.addChild(candySprite);
        candySprite.x = GridCoordsToDisplayCoords(candy.x, candy.y).x;
        candySprite.y = GridCoordsToDisplayCoords(candy.x, candy.y).y;

    });

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
    classroom.setCandy({x: 30, y: 10});
    const nstudent = studentNumber;


    fillGridCell(nstudent, classroom, app);
    fillDeskInClassroom(nteacher, classroom, app);

    displayClassroom(app, classroom);

    PIXI.Assets.addBundle('fonts', [
        {alias: 'Chalkboard', src: '../../src/assets/chalkboard.ttf'}
    ]);
    PIXI.Assets.loadBundle('fonts');

    let candiesTakenText = new PIXI.Text('Candies taken: ' + nCandiesTaken, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xFFFFFF
    });
    candiesTakenText.x = WindowWidth * 0.75;
    candiesTakenText.y = WindowHeight * 0.3;
    candiesTakenText.zIndex = 20;
    candiesTakenText.style.fontSize = 24 * vecLength(DownVector) / 405;
    try {
        candiesTakenText.style.fontFamily = 'Chalkboard';
    } catch (e) {
        console.log(e);
    }
    candiesTakenText.rotation = Math.acos(vecDot({x: 1, y: 0}, DownVector) / (vecLength({
        x: 1,
        y: 0
    }) * vecLength(DownVector)));
    app.stage.addChild(candiesTakenText);

    classroom.displayDesks(app);
    app.ticker.maxFPS = maxFPS;

    console.log("Classroom : ", classroom._grid);
    app.ticker.add(() => {
        nCandiesTaken = 0;
        for (let i = 0; i < nstudent; i++) {
            let student = classroom._students[i];
            student.choseAgentAction();
            nCandiesTaken += student._candies;
        }
        for (let i = 0; i < nteacher; i++) {
            let teacher = classroom._teachers[i];
            teacher.choseAgentAction();
            teacher.displayDebugPatrouille();
        }
        updateCandiesTakenText(candiesTakenText);
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