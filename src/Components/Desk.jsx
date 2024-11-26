import {AABB} from "./AABB.jsx";
import {CoordInterval, DownVector, RightVector, TopLeft} from "./Global.jsx";

export class Desk extends AABB {
    _width;
    _height;
    _sprite;
    _coordModele;

    constructor(x, y, width, height, aabboffset, app) {
        super({x: x, y: y}, {x: x + width, y: y + height}, app, false);
        super.move('x', aabboffset?.x || 0);
        super.move('y', aabboffset?.y || 0);
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
        let u = this._coordModele.x / CoordInterval.max.x;
        let v = this._coordModele.y / CoordInterval.max.y;
        let x = TopLeft.x + u * RightVector.x + v * DownVector.x;
        let y = TopLeft.y + u * RightVector.y + v * DownVector.y;
        this._sprite.x = x;
        this._sprite.y = y;
    }

}