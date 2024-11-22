import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';

const MainPage = () => {
    useEffect(() => {
        const app = new PIXI.Application({
            width: window.innerWidth,  // Largeur de la fenêtre
            height: window.innerHeight, // Hauteur de la fenêtre
            backgroundColor: 0x1099bb,
        });

        document.body.appendChild(app.view);

        // Charger et afficher le terrain
        PIXI.Assets.load('../map.png').then((texture) => {
            const terrainSprite = new PIXI.Sprite(texture);
            terrainSprite.width = app.screen.width;  // Redimensionner pour prendre toute la largeur
            terrainSprite.height = app.screen.height; // Redimensionner pour prendre toute la hauteur
            terrainSprite.x = (app.screen.width - terrainSprite.width) / 2; // Centrer horizontalement
            terrainSprite.y = (app.screen.height - terrainSprite.height) / 2; // Centrer verticalement
            app.stage.addChild(terrainSprite);
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