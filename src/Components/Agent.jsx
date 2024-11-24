import { CoordInterval, vecLength, DownRightVector } from './Global';

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

    display() {
        throw new Error("Method 'display()' must be implemented.");
    }

    performAgentAction(action) {
        throw new Error("Method 'performAction()' must be implemented.");
    }

    choseAgentAction() {
        throw new Error("Method 'choseAction()' must be implemented.");
    }

    move(action) {
        switch(action) {
            case Action.Up:
                this._coordModele.y = Math.max(CoordInterval.min.y, this._coordModele.y - this._speed * SpeedUnit);
                break;
            case Action.Down:
                this._coordModele.y = Math.min(CoordInterval.max.y, this._coordModele.y + this._speed * SpeedUnit);
                break;
            case Action.Left:
                this._coordModele.x = Math.max(CoordInterval.min.x, this._coordModele.x - this._speed * SpeedUnit);
                break;
            case Action.Right:
                this._coordModele.x = Math.min(CoordInterval.max.x, this._coordModele.x + this._speed * SpeedUnit);
                break;
            case Action.UpLeft:
                this._coordModele.x = Math.max(CoordInterval.min.x, this._coordModele.x - this._speed * SpeedUnit);
                this._coordModele.y = Math.max(CoordInterval.min.y, this._coordModele.y - this._speed * SpeedUnit);
                break;
            case Action.UpRight:
                this._coordModele.x = Math.min(CoordInterval.max.x, this._coordModele.x + this._speed * SpeedUnit);
                this._coordModele.y = Math.max(CoordInterval.min.y, this._coordModele.y - this._speed * SpeedUnit);
                break;
            case Action.DownLeft:
                this._coordModele.x = Math.max(CoordInterval.min.x, this._coordModele.x - this._speed * SpeedUnit);
                this._coordModele.y = Math.min(CoordInterval.max.y, this._coordModele.y + this._speed * SpeedUnit);
                break;
            case Action.DownRight:
                this._coordModele.x = Math.min(CoordInterval.max.x, this._coordModele.x + this._speed * SpeedUnit);
                this._coordModele.y = Math.min(CoordInterval.max.y, this._coordModele.y + this._speed * SpeedUnit);
                break;
            default:
                break;
        }
    }
}

export default Agent;