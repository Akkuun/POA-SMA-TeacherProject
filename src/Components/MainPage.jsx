import React, { useEffect } from 'react';
import * as PIXI from 'pixi.js';
import OptionsWindow from './OptionWindow.jsx';

const MainPage = ({ sweetNumber, studentNumber, setSweetNumber, setStudentNumber }) => {
    useEffect(() => {
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
        });

        let root = document.getElementById("root");
        root.appendChild(app.view);

        PIXI.Assets.load('../map.png').then((texture) => {
            const terrainSprite = new PIXI.Sprite(texture);
            terrainSprite.width = app.screen.width;
            terrainSprite.height = app.screen.height;
            terrainSprite.x = (app.screen.width - terrainSprite.width);
            terrainSprite.y = (app.screen.height - terrainSprite.height);
            app.stage.addChild(terrainSprite);
        });

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