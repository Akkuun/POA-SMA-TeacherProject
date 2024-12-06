import { GridCoordsToDisplayCoords } from './Classroom';
import {WindowHeight, WindowWidth} from "./Global.jsx";

/**
 * @class Desk : not only for student but also for teacher
 */
export class Desk{
    _sprite;
    _coordGrid;
    _owner;

    constructor(x, y) {
        this._width = 30 / 545 * WindowWidth * 0.66;
        this._height = 30 / 405 * WindowHeight * 50/68;
        this._coordGrid = {x: x, y: y};
        this._owner = null;
    }

    assignOwner(owner) {
        this._owner = owner;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }


    setSprite(sprite) {
        this._sprite = sprite;
    }

    display() {
        this._sprite.x = GridCoordsToDisplayCoords(this._coordGrid.x, this._coordGrid.y).x;
        this._sprite.y = GridCoordsToDisplayCoords(this._coordGrid.x, this._coordGrid.y).y;
    }

}