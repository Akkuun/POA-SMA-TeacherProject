
import * as PIXI from 'pixi.js';
import OptionsWindow from './OptionWindow.jsx';
import Classroom, {classroom_ncols} from './Classroom';
import Student from './Student';
import {Action, Agent} from './Agent';
import {DEBUG} from './Global';
import {Desk} from "./Desk.jsx";
import {useEffect} from "react";
import Graph from "./Graph.js";

const maxFPS = 10; // Changes the game's speed

// eslint-disable-next-line react/prop-types
const MainPage = ({ sweetNumber, studentNumber, setSweetNumber, setStudentNumber }) => {
    useEffect(() => {
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
        let nstudent = studentNumber;
        let nteacher = 2;

        const startRow = 4;
        const endRow = 25;
        const startCol = 4;
        const endCol = 32;

        const spacingX = 5;
        const spacingY = 5;

        let deskCount = 0;
        let currentX = startCol;
        let currentY = startRow;

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
                classroom._grid[currentY][currentX] = 1;
                classroom._grid[currentY][currentX + 1] = 1; // because desks are 2x1

                currentY += spacingY;
                deskCount++;
            }
        }
        //console.log("while check finis : "+deskCount+" == "+ nstudent+ " ; "+currentX+" == "+ endCol +" ; "+currentY+" == "+ endRow+ " ; ");

        //Teacher
        const startRowTeacher = 4;
        const endRowTeacher = 25;
        const startColTeacher = 33;
        const endColTeacher = classroom_ncols - 1;
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
                classroom._grid[currentYTeacher][currentXTeacher] = 2;
                classroom._grid[currentYTeacher + 1][currentXTeacher] = 2;
                classroom._grid[currentYTeacher + 2][currentXTeacher] = 2; // because desks are 1x3

                currentYTeacher += spacingY;
                deskCountTeacher++;
            }
        }



        for (let i = 0; i < nstudent; i++) {
            classroom.addStudent(new Student(app, classroom));
        }

        // Charger et afficher le terrain
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
                deskSprite.anchor.set(0 , 1);
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
                deskSprite.anchor.set(0 , 1);
                app.stage.addChild(deskSprite);
                desk.setSprite(deskSprite);
                desk.display();
            });
        }

        // Charger et afficher les students
        for (let student of classroom._students) {
            PIXI.Assets.load('../../src/assets/student.png').then((texture) => {
                const studentSprite = new PIXI.Sprite(texture);
                studentSprite.zIndex = 10;
                studentSprite.anchor.set(0.5, 1); // Set the anchor point to the center of the sprite to (1, 0.5) for each Agent's sprite to center it on the middle of the cell
                app.stage.addChild(studentSprite);
                student.setSprite(studentSprite);
                student.display();
            });
        }


        // let grid2 = [
        //     [0, 0, 0],
        //     [0, 0, 0],
        //     [0, 0, 0]
        // ];
        //
        // let start = { x: 0, y: 0 };
        // let destination = { x: 2, y: 2 };
        //
        // let graph = new Graph(grid2);
        // graph.displayGraph();
        //
        // let path = graph.A_star(start, destination);
        // console.log("Path:", path);
        let graph = new Graph(classroom._grid);

        let start = { x: classroom._students[0]._gridPos.x, y: classroom._students[0]._gridPos.y};
       //let start = { x: 0, y: 0};
        //destination bureau de la prof
       let teacher_x =  classroom._desksTeacher[0]._coordGrid.x;
       let teacher_y =  classroom._desksTeacher[0]._coordGrid.y;

        let destination = { x: 10,
            y: 30};

        let path = graph.A_star(start, destination);
        console.log("Path:", path);
        graph.drawPath(path,app);

        app.ticker.maxFPS = maxFPS;
        app.ticker.add(() => {
            for (let i = 0; i < nstudent; i++) {
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
            app.destroy(true, { children: true });
        };
    }, []);

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