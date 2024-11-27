import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import OptionsWindow from './OptionWindow.jsx';
import Classroom, {classroom_ncols, classroom_nrows} from './Classroom';
import Student from './Student';
import { Action } from './Agent';
import {DEBUG, DownRightVector, TopLeft as cellUnit, vecLength} from './Global';
import { CoordInterval } from './Global';
import {Desk} from "./Desk.jsx";

const maxFPS = 10; // Changes the game's speed

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
        let nstudent = 13;
        let nteacher = 1;

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
                classroom.addDesk(new Desk(currentX, currentY));
                classroom._grid[currentY][currentX] = 1;
                classroom._grid[currentY][currentX + 1] = 1; // because desks are 2x1

                currentY += spacingY;
                deskCount++;
                console.log(deskCount);
            }
        }
        console.log("while check finis : "+deskCount+" == "+ nstudent+ " ; "+currentX+" == "+ endCol +" ; "+currentY+" == "+ endRow+ " ; ");


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
        for (let desk of classroom._desks) {
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

        app.ticker.maxFPS = maxFPS;
        /*app.ticker.add(() => {
            for (let i = 0; i < nstudent; i++) {
                let student = classroom._students[i];
                switch(i%4) {
                    case 0:
                        student.performAgentAction(Action.Up);
                        break;
                    case 1:
                        student.performAgentAction(Action.Down);
                        break;
                    case 2:
                        student.performAgentAction(Action.Left);
                        break;
                    case 3:
                        student.performAgentAction(Action.Right);
                        break;
                }
            }
            if (DEBUG) classroom.displayDebugGrid(); // RED = Student, GREEN = Teacher, BLUE = Empty, BLACK = Something else
        });*/


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