import * as PIXI from 'pixi.js';

import Classroom, {cellUnit, classroom_ncols, GridCoordsToDisplayCoords, GridCellCenterForDisplay} from './Classroom';
import Student from './Student';
import {Teacher} from './Teacher';
import {DEBUG, DownVector, RightVector, vecDot, vecLength, WindowHeight, WindowWidth} from './Global';
import {Desk} from "./Desk.jsx";
import BadApple from '/assets/frames.json?url';
import Lyrics from '/assets/lyrics.json?url';
import badappleaudio from '/assets/bad-apple.mp3';

import '../styles/css/MainPage.css';

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


let nCandiesTaken = 0;

function displayFrame(frame, pixels) {
    //console.log(frame);
    for (let i = 0; i < 27; i++) {
        for (let j = 0; j < 41; j++) {
            try {
                if (frame[i][j] === 1) {
                    let coords = GridCellCenterForDisplay(j, i);
                    pixels[i*41+j].x = coords.x;
                    pixels[i*41+j].y = coords.y;
                } else {
                    pixels[i*41+j].x = -1;
                    pixels[i*41+j].y = -1;
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}
function displayLyrics(lyrics, frame, lyricsText) {
    // lyrics is an array of objects with the following structure:
    // {
    //     "start-frame": "Lyric text",
    //     ...
    // }
    // The start-frame is the frame number at which the lyric should be displayed
    // The lyric text is the text to be displayed
    // The lyrics at start-frame should be displayed if frame is greater than or equal to start-frame and less than the next start-frame


    // Find the lyric to display
    let lyric = null;
    for (let i = 0; i < lyrics.length; i++) {
        //console.log("compare", frame, lyrics[i]["frame"]);
        if (frame >= lyrics[i]["frame"]) {
            lyric = lyrics[i]["lyric"];
        }
    }
    if (lyricsText.style.fontFamily !== 'Chalkboard') {
        try {
            lyricsText.style.fontFamily = 'Chalkboard';
        } catch (e) {
            console.log(e);
        }
    }
    if (lyric) {
        lyricsText.text = lyric;
    } else {
        lyricsText.text = '';
    }

}
let badAppleAudioPlayed = false;
function playBadApple(oldapp) {
    let lyricsText = new PIXI.Text('Candies taken: ' + nCandiesTaken, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xFFFFFF
    });
    lyricsText.x = WindowWidth * 0.63;
    lyricsText.y = WindowHeight * 0.18;
    lyricsText.zIndex = 20;
    lyricsText.style.fontSize = 20 * vecLength(DownVector) / 405;
    try {
        lyricsText.style.fontFamily = 'Chalkboard';
    } catch (e) {
        console.log(e);
    }
    lyricsText.rotation = Math.acos(vecDot({x: 1, y: 0}, DownVector) / (vecLength({
        x: 1,
        y: 0
    }) * vecLength(DownVector)));
    document.getElementById("heatmap").style.display = "none";
    document.getElementById("heatmapBlack").style.display = "none";
    let pixels = [];
    // clear the oldapp
    oldapp.ticker.stop();
    oldapp.destroy(true, {children: true});
    const app = new PIXI.Application({
        width: window.innerWidth,  // Largeur de la fenêtre
        height: window.innerHeight, // Hauteur de la fenêtre
        backgroundColor: 0x1099bb,
        sortableChildren: true,
    });
    app.stage.sortableChildren = true;
    app.stage.addChild(lyricsText);
    let root = document.getElementById("root");
    root.appendChild(app.view);

    app.ticker = new PIXI.Ticker();
    PIXI.Assets.load('assets/map.png').then((texture) => {
        const terrainSprite = new PIXI.Sprite(texture);
        terrainSprite.width = window.innerWidth;  // Redimensionner pour prendre toute la largeur
        terrainSprite.height = window.innerHeight; // Redimensionner pour prendre toute la hauteur
        terrainSprite.x = (window.innerWidth - terrainSprite.width); // Centrer horizontalement
        terrainSprite.y = (window.innerHeight - terrainSprite.height); // Centrer verticalement
        terrainSprite.zIndex = -1;
        app.stage.addChild(terrainSprite);
    });
    for (let i = 0; i < 27*41; i++) {
        PIXI.Assets.load('assets/student_2.png').then((texture) => {
            const studentSprite = new PIXI.Sprite(texture);
            studentSprite.zIndex = 11;
            studentSprite.width = 26 / 545 * WindowWidth * 0.46;
            studentSprite.height = 37 / 405 * WindowHeight * 50 / 68;
            studentSprite.anchor.set(0.5, 1); // Set the anchor point to the center of the sprite to (1, 0.5) for each Agent's sprite to center it on the middle of the cell
            app.stage.addChild(studentSprite);
            studentSprite.x = -1;
            studentSprite.y = -1;
            pixels.push(studentSprite);
        });
    }
    Promise.all([
        fetch(BadApple).then(response => response.json()),
        fetch(Lyrics).then(response => response.json())
    ])
        .then(([frames, lyrics]) => {
            app.ticker.maxFPS = 30;
            let frame = 0;
            let audio = new Audio(badappleaudio);
            if (!badAppleAudioPlayed) {
                audio.play();
                badAppleAudioPlayed = true;
            }
    
            app.ticker.add(() => {
                if (frame < frames.length) {
                    displayFrame(frames[frame], pixels);
                    // Use lyrics data here if needed
                    // For example, display lyrics based on the current frame
                    displayLyrics(lyrics, frame, lyricsText);
                    frame++;
                } else {
                    frame = 0;
                }
                if (frame >= 6574) {
                    // reload the window
                    window.location.href = window.location.href;
                }
            });
    
            app.ticker.start();
        })
        .catch(error => {
            console.error('Error loading frames or lyrics:', error);
        });
}
let heatmap = [];

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

function fillGridCell(nstudent, classroom, app, studentSpeed, studentCandyStrategy, studentPathStrategy) {
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
            // --------- Initialize the student's state from menu here
            classroom._students[classroom._students.length - 1]._speed = studentSpeed;
            classroom._students[classroom._students.length - 1].setWantCandyStrategy(studentCandyStrategy);
            classroom._students[classroom._students.length - 1].setPathStrategy(studentPathStrategy);
            // ---------
            currentY += spacingY;
            deskCount++;
        }
    }
}

function fillDeskInClassroom(nteacher, classroom, app, teacherSpeed, teacherFocusStrategy) {
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
            // --------- Initialize the teacher's state from menu here
            classroom._teachers[classroom._teachers.length - 1]._speed = teacherSpeed;
            classroom._teachers[classroom._teachers.length - 1].setChoseStudentStrategy(teacherFocusStrategy);
            // ---------
            currentYTeacher += spacingY;
            deskCountTeacher++;
        }
    }
}

let opened_door_sprite;

function displayClassroom(app, classroom) {
    PIXI.Assets.load('assets/map.png').then((texture) => {
        const terrainSprite = new PIXI.Sprite(texture);
        terrainSprite.width = window.innerWidth;  // Redimensionner pour prendre toute la largeur
        terrainSprite.height = window.innerHeight; // Redimensionner pour prendre toute la hauteur
        terrainSprite.x = (window.innerWidth - terrainSprite.width); // Centrer horizontalement
        terrainSprite.y = (window.innerHeight - terrainSprite.height); // Centrer verticalement
        terrainSprite.zIndex = -2;
        app.stage.addChild(terrainSprite);
    });
    PIXI.Assets.load('assets/opened_door.png').then((texture) => {
        opened_door_sprite = new PIXI.Sprite(texture);
        opened_door_sprite.width = window.innerWidth;  // Redimensionner pour prendre toute la largeur
        opened_door_sprite.height = window.innerHeight; // Redimensionner pour prendre toute la hauteur
        opened_door_sprite.x = (window.innerWidth - opened_door_sprite.width); // Centrer horizontalement
        opened_door_sprite.y = (window.innerHeight - opened_door_sprite.height); // Centrer verticalement
        opened_door_sprite.zIndex = -1;
        app.stage.addChild(opened_door_sprite);
    });
    // Charger et afficher les bureaux
    for (let desk of classroom._desksStudent) {
        PIXI.Assets.load('assets/student_desk.png').then((texture) => {
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
        PIXI.Assets.load('assets/teacher_desk.png').then((texture) => {
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
        student.updateSpritesBasedOnStrategy();
        student.changeSprite(student._initSprite);
    }

    for (let teacher of classroom._teachers) {
        PIXI.Assets.load('assets/teacher.png').then((texture) => {
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
    PIXI.Assets.load('assets/jar_candy_full.png').then((texture) => {
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
const MainPage = ({studentNumber, setStudentNumber, setTeacherNumber, teacherNumber, studentSpeed, setStudentSpeed, teacherSpeed, setTeacherSpeed,
    studentCandyStrategy, setStudentCandyStrategy, teacherFocusStrategy, setTeacherFocusStrategy, studentPathStrategy, setStudentPathStrategy
}) => {
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
    classroom.setCandy({x: 29, y: 14});
    const nstudent = studentNumber;
    const nteacher = teacherNumber;
    classroom._nstudents = nstudent;
    classroom._nteachers = nteacher;

    fillGridCell(nstudent, classroom, app, studentSpeed, studentCandyStrategy, studentPathStrategy);
    fillDeskInClassroom(nteacher, classroom, app, teacherSpeed, teacherFocusStrategy);

    displayClassroom(app, classroom);

    PIXI.Assets.addBundle('fonts', [
        {alias: 'Chalkboard', src: 'assets/chalkboard.ttf'}
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
    app.ticker.add(() => {
       
        if (classroom._state === "StartAnimation") {
            classroom.agentEnter();
            if (classroom._agentsWaitingToEnter.length === 0 && opened_door_sprite) {
                opened_door_sprite.destroy(true);
                opened_door_sprite = null;
            }
        }
        nCandiesTaken = 0;
        heatmap = classroom.getHeatMapObject();
        //console.log(heatmap);
        for (let i = 0; i < nstudent; i++) {
            let student = classroom._students[i];
            for (let actions = 0; actions < student._speed; actions++) {
                student.choseAgentAction();
            }
            nCandiesTaken += student._candies;
        }
        for (let i = 0; i < nteacher; i++) {
            let teacher = classroom._teachers[i];
            for (let actions = 0; actions < teacher._speed; actions++) {
                teacher.choseAgentAction();
            }
            teacher.displayDebugPatrouille();
        }
        updateCandiesTakenText(candiesTakenText);
        if (DEBUG) classroom.displayDebugGrid(); // RED = Student, GREEN = Teacher, BLUE = Empty, BLACK = Something else
    });

    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.altKey && event.key === 'b') {
            console.log('Playing Bad Apple');
            playBadApple(app);
        }
    };

    window.addEventListener('keydown', handleKeyDown);



    return (
        <div>
            <button id="heatmap" onClick={
                () => {
                    let maxValue = 0;
                    // Create a new window
                    const newWindow = window.open("", "_blank");
                    newWindow.document.write("<html><head><title>Heatmap</title></head><body></body></html>");

                    // Create a canvas element
                    const canvas = newWindow.document.createElement("canvas");
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    newWindow.document.body.appendChild(canvas);

                    const ctx = canvas.getContext("2d");
                    for (let i = 0; i < heatmap.length; i++) {
                        for (let j = 0; j < heatmap[i].length; j++) {
                            maxValue = Math.max(maxValue, heatmap[i][j]);
                            let intensity = maxValue === 0 ? 0 : heatmap[i][j] / maxValue;
                            // HHL value
                            const h = Math.floor((1 - intensity) * 220);
                            const l = 50
                            const s = 100;


                            let coords = GridCoordsToDisplayCoords(j, i);
                            ctx.fillStyle = `hsl(${h},${s}%,${l}%)`;

                            let points = [
                                new PIXI.Point(coords.x, coords.y),
                                new PIXI.Point(coords.x + cellUnit.x * RightVector.x, coords.y + cellUnit.x * RightVector.y),
                                new PIXI.Point(coords.x + cellUnit.x * RightVector.x + cellUnit.y * DownVector.x, coords.y + cellUnit.x * RightVector.y + cellUnit.y * DownVector.y),
                                new PIXI.Point(coords.x + cellUnit.y * DownVector.x, coords.y + cellUnit.y * DownVector.y)
                            ];
                            ctx.beginPath();
                            ctx.moveTo(points[0].x, points[0].y);
                            for (let k = 1; k < points.length; k++) {
                                ctx.lineTo(points[k].x, points[k].y);
                            }
                            ctx.closePath();
                            ctx.fill();

                        }
                    }

                }
            }>
                See heatmap HLS
            </button>


            <button id="heatmapBlack" onClick={
                () => {
                    let maxValue = 0;
                    // Create a new window
                    const newWindow = window.open("", "_blank");
                    newWindow.document.write("<html><head><title>Heatmap</title></head><body></body></html>");

                    // Create a canvas element
                    const canvas = newWindow.document.createElement("canvas");
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    newWindow.document.body.appendChild(canvas);

                    const ctx = canvas.getContext("2d");
                    for (let i = 0; i < heatmap.length; i++) {
                        for (let j = 0; j < heatmap[i].length; j++) {
                            maxValue = Math.max(maxValue, heatmap[i][j]);
                            let intensity = maxValue === 0 ? 0 : heatmap[i][j] / maxValue;
                             const r = 1 - Math.floor(intensity * 255);
                             const g = 0;
                             const b = Math.floor((1 - intensity) * 255);



                            let coords = GridCoordsToDisplayCoords(j, i);
                            ctx.fillStyle = `rgb(${r},${g},${b})`;

                            let points = [
                                new PIXI.Point(coords.x, coords.y),
                                new PIXI.Point(coords.x + cellUnit.x * RightVector.x, coords.y + cellUnit.x * RightVector.y),
                                new PIXI.Point(coords.x + cellUnit.x * RightVector.x + cellUnit.y * DownVector.x, coords.y + cellUnit.x * RightVector.y + cellUnit.y * DownVector.y),
                                new PIXI.Point(coords.x + cellUnit.y * DownVector.x, coords.y + cellUnit.y * DownVector.y)
                            ];
                            ctx.beginPath();
                            ctx.moveTo(points[0].x, points[0].y);
                            for (let k = 1; k < points.length; k++) {
                                ctx.lineTo(points[k].x, points[k].y);
                            }
                            ctx.closePath();
                            ctx.fill();

                        }
                    }

                }
            }>
                See heatmap Black and White
            </button>
        </div>

    );
};

export default MainPage;
