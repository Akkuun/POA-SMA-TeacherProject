import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import Classroom from './Classroom';
import Student from './Student';

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

        for (let i = 0; i < 5; i++) {
            const student = new Student({x: Math.random() * 100, y: Math.random() * 100}, app, classroom);
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

        // Charger et afficher les students
        for (let i = 0; i < 5; i++) {
            PIXI.Assets.load('../../src/assets/student.png').then((texture) => {
                const studentSprite = new PIXI.Sprite(texture);
                studentSprite.zIndex = 10;
                app.stage.addChild(studentSprite);
                classroom._students[i].setSprite(studentSprite);
                classroom._students[i].display();
            });
        }

        app.ticker.add(() => {
            for (let i = 0; i < 5; i++) {
                classroom._students[i].performAgentAction();
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