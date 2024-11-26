import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import Classroom from './Classroom';
import Student from './Student';
import { Action } from './Agent';
import { CoordInterval } from './Global';
import {Desk} from "./Desk.jsx";

const MainPage = () => {
    useEffect(() => {
        const app = new PIXI.Application({
            width: window.innerWidth,  // Largeur de la fenêtre
            height: window.innerHeight, // Hauteur de la fenêtre
            backgroundColor: 0x1099bb,
        });

        let root = document.getElementById("root");
        root.appendChild(app.view);

        const classroom = new Classroom(app);
        let nstudent = 1;

        for (let i = 0; i < nstudent; i++) {
            classroom.addStudent(new Student({x: Math.random() * CoordInterval.max.x, y: Math.random() * CoordInterval.max.y}, app, classroom));
            classroom.addDesk(new Desk(15, 15, 10, 10, {x: 0, y: 0}, app));
        }

        // Charger et afficher le terrain
        PIXI.Assets.load('../../src/assets/map.png').then((texture) => {
            const terrainSprite = new PIXI.Sprite(texture);
            terrainSprite.width = window.innerWidth;  // Redimensionner pour prendre toute la largeur
            terrainSprite.height = window.innerHeight; // Redimensionner pour prendre toute la hauteur
            terrainSprite.x = (window.innerWidth - terrainSprite.width); // Centrer horizontalement
            terrainSprite.y = (window.innerHeight - terrainSprite.height); // Centrer verticalement
            terrainSprite.zIndex = 0;
            app.stage.addChild(terrainSprite);
        });

        // Charger et afficher les bureaux
        for (let desk of classroom._desks) {
            PIXI.Assets.load('../../src/assets/student_desk.png').then((texture) => {
                const deskSprite = new PIXI.Sprite(texture);
                deskSprite.zIndex = 5;
                deskSprite.width = desk.width * 100; // Redimensionner pour prendre toute la largeur
                deskSprite.height = desk.height * 100; // Redimensionner pour prendre toute la hauteur
                deskSprite.x = (window.innerWidth - deskSprite.width); // Centrer horizontalement
                deskSprite.y = (window.innerHeight - deskSprite.height); // Centrer verticalement
                app.stage.addChild(deskSprite);
            });
        }

        // Charger et afficher les students
        for (let student of classroom._students) {
            PIXI.Assets.load('../../src/assets/student.png').then((texture) => {
                const studentSprite = new PIXI.Sprite(texture);
                studentSprite.zIndex = 10;
                app.stage.addChild(studentSprite);
                student.setSprite(studentSprite);
                student.display();
            });
        }

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
        });


        // Nettoyer l'application PIXI lors du démontage du composant
        return () => {
            app.destroy(true, { children: true });
        };
    }, []);

    return (
        <div id="pixi-container"></div>
    );
}

export default MainPage;