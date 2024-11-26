import { CoordInterval, vecLength, TopLeft, DownRightVector, RightVector, DownVector } from './Global';

export const Action = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right',
    UpLeft: 'UpLeft',
    UpRight: 'UpRight',
    DownLeft: 'DownLeft',
    DownRight: 'DownRight',
};

export const SpeedUnit = vecLength(DownRightVector) / 1000; // Movement speed unit, using the diagonal of the screen as a reference to make it independent of the screen size

export class Agent {
    _sprite;
    __spriteLength = {x:0, y:0}; // Used to store the sprite's width and height to limit the agent's movement within the screen (max borders sprite clipping) Do not set this value
    _aabb;
    _app;
    _classroom;
    _coordModele = {};

    // Gameplay variables
    _speed = 2.5; 

    constructor(p_coordModele, p_app, p_classroom) {
        this._coordModele = p_coordModele;
        this._app = p_app;
        this._classroom = p_classroom;
    }

    // Computes the display position of the student's sprite from its model position
    display() {
        let u = this._coordModele.x / CoordInterval.max.x;
        let v = this._coordModele.y / CoordInterval.max.y;
        let x = TopLeft.x + u * RightVector.x + v * DownVector.x;
        let y = TopLeft.y + u * RightVector.y + v * DownVector.y;
        this._sprite.x = x;
        this._sprite.y = y;
    }

    performAgentAction(action) {
        throw new Error("Method 'performAction()' must be implemented.");
    }

    choseAgentAction() {
        throw new Error("Method 'choseAction()' must be implemented.");
    }

    setSprite(sprite) {
        this._sprite = sprite;
        if (this._sprite && this.__spriteLength.x == 0) {
            this.__spriteLength.x = Math.cos(this._sprite.width) * this._sprite.width;
            this.__spriteLength.y = Math.sin(this._sprite.width) * this._sprite.width;
        }
    }

    move(action) {
        if (this._sprite && this.__spriteLength.x == 0) {
            this.__spriteLength.x = Math.cos(this._sprite.width) * this._sprite.width;
            this.__spriteLength.y = Math.sin(this._sprite.width) * this._sprite.width;
        }
        switch(action) {
            case Action.Up:
                this._coordModele.y = Math.max(CoordInterval.min.y, this._coordModele.y - this._speed * SpeedUnit);
                break;
            case Action.Down:
                this._coordModele.y = Math.min(CoordInterval.max.y - this.__spriteLength.y, this._coordModele.y + this._speed * SpeedUnit);
                break;
            case Action.Left:
                this._coordModele.x = Math.max(CoordInterval.min.x, this._coordModele.x - this._speed * SpeedUnit);
                break;
            case Action.Right:
                this._coordModele.x = Math.min(CoordInterval.max.x - this.__spriteLength.x, this._coordModele.x + this._speed * SpeedUnit);
                break;
            case Action.UpLeft:
                this._coordModele.x = Math.max(CoordInterval.min.x, this._coordModele.x - this._speed * SpeedUnit);
                this._coordModele.y = Math.max(CoordInterval.min.y, this._coordModele.y - this._speed * SpeedUnit);
                break;
            case Action.UpRight:
                this._coordModele.x = Math.min(CoordInterval.max.x - this.__spriteLength.x, this._coordModele.x + this._speed * SpeedUnit);
                this._coordModele.y = Math.max(CoordInterval.min.y, this._coordModele.y - this._speed * SpeedUnit);
                break;
            case Action.DownLeft:
                this._coordModele.x = Math.max(CoordInterval.min.x, this._coordModele.x - this._speed * SpeedUnit);
                this._coordModele.y = Math.min(CoordInterval.max.y - this.__spriteLength.y, this._coordModele.y + this._speed * SpeedUnit);
                break;
            case Action.DownRight:
                this._coordModele.x = Math.min(CoordInterval.max.x - this.__spriteLength.x, this._coordModele.x + this._speed * SpeedUnit);
                this._coordModele.y = Math.min(CoordInterval.max.y - this.__spriteLength.y, this._coordModele.y + this._speed * SpeedUnit);
                break;
            default:
                break;
        }
    }
}

export default Agent;