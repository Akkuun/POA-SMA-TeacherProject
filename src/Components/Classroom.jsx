import * as PIXI from 'pixi.js';
import MapSprite from '../assets/map.png';

const WindowWidth = window.innerWidth;
const WindowHeight = window.innerHeight;

export class Classroom {
    _sprite;
    _width;
    _height;
    _texture;
// Static values calculated from the classroom sprite positions
    _topLeft = {
        x:0.009191176 * WindowWidth,
        y:0.727047146 * WindowHeight
    };
    _downVector = {
        x:0.404411765 * WindowWidth - this._topLeft.x,
        y:0.990123457 * WindowHeight - this._topLeft.y
    };
    _rightVector = {
        x:0.59375 * WindowWidth - this._topLeft.x,
        y:1/3 * WindowHeight - this._topLeft.y
    };

    constructor(app) {
        this._app = app;
        console.log(this._app);
        this._width = WindowWidth;
        this._height = WindowHeight;
    }

    display() {
        PIXI.Assets.load('../../src/assets/map.png').then((texture) => {
            console.log("aaaaaaa",this._app);
            this._sprite = new PIXI.Sprite(texture);
            this._sprite.width = WindowWidth;  // Redimensionner pour prendre toute la largeur
            this._sprite.height = WindowHeight; // Redimensionner pour prendre toute la hauteur
            this._sprite.x = (WindowWidth - this._sprite.width); // Centrer horizontalement
            this._sprite.y = (WindowHeight - this._sprite.height); // Centrer verticalement
            this._app.stage.addChild(this._sprite);

        });
        return (
            <Classroom
                width={this._width}
                height={this._height}
                texture={MapSprite}
            >
            </Classroom>
        );
    }
}

export default Classroom;