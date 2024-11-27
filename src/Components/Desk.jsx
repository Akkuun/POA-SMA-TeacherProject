import { GridCoordsToDisplayCoords } from './Classroom';

export class Desk{
    _sprite;
    _coordModele;

    constructor(x, y, width, height) {
        this._width = width;
        this._height = height;
        this._coordModele = {x: x, y: y};

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
        this._sprite.x = GridCoordsToDisplayCoords(this._coordModele.x, this._coordModele.y).x;
        this._sprite.y = GridCoordsToDisplayCoords(this._coordModele.x, this._coordModele.y).y;
    }

}