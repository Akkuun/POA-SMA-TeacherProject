import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Classroom } from './Classroom';
import { Student } from './Student';

const MainPage = () => {
    useEffect(() => {
        const app = new PIXI.Application({
            width: window.innerWidth,  // Largeur de la fenêtre
            height: window.innerHeight, // Hauteur de la fenêtre
            backgroundColor: 0x1099bb,
        });

        let container = ;

        let root = document.getElementById("root");
        root.appendChild(app.view);

        // Charger et afficher le terrain
        const classroom = new Classroom(app);
        container.appendChild(classroom)
        
        let studentTest = new Student({x:50, y:50}, app, classroom);

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