import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import OptionsWindow from './OptionWindow.jsx';
import Classroom from './Classroom';
import Student from './Student';
import { Action } from './Agent';
import { DEBUG } from './Global';

const nstudent = 20;
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
        app.ticker.add(() => {
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