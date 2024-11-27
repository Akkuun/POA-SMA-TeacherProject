import { CoordInterval, vecLength, TopLeft, DownRightVector, RightVector, DownVector } from './Global';
import { GridCoordsToDisplayCoords, classroom_nrows, classroom_ncols } from './Classroom';

export const Action = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right',
};

export const SpeedUnit = vecLength(DownRightVector) / 1000; // Movement speed unit, using the diagonal of the screen as a reference to make it independent of the screen size

export class Agent {
    _sprite;
    __spriteLength = {x:0, y:0}; // Used to store the sprite's width and height to limit the agent's movement within the screen (max borders sprite clipping) Do not set this value. Probably useless with the new grid system
    _aabb;
    _app;
    _classroom;
    _gridPos = { x: -1, y: -1 };

    constructor(p_app, p_classroom) {
        this._app = p_app;
        this._classroom = p_classroom;
    }

    // Computes the display position of the student's sprite from its model position
    display() {
        if (this._sprite) {
            console.log(this);
            let coords = GridCoordsToDisplayCoords(this._gridPos.x, this._gridPos.y);
            this._sprite.x = coords.x;
            this._sprite.y = coords.y;
        }
    }

    setGridPos(pos) {
        this._gridPos = { x: pos.x, y: pos.y };
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
        let oldPos = this._gridPos;
        switch(action) {
            case Action.Up:
                if (this._gridPos.y > 0) {
                    let newPos = { x: this._gridPos.x, y: this._gridPos.y - 1 };
                    if(this._classroom.moveAgent(this, oldPos, newPos)) this._gridPos = newPos; // If the move is successful, update the grid position of the agent   
                }
                break;
            case Action.Down:
                if (this._gridPos.y < classroom_nrows - 1) {
                    let newPos = { x: this._gridPos.x, y: this._gridPos.y + 1 };
                    if(this._classroom.moveAgent(this, oldPos, newPos)) this._gridPos = newPos; // If the move is successful, update the grid position of the agent
                }
                break;
            case Action.Left:
                if (this._gridPos.x > 0) {
                    let newPos = { x: this._gridPos.x - 1, y: this._gridPos.y };
                    if(this._classroom.moveAgent(this, oldPos, newPos)) this._gridPos = newPos; // If the move is successful, update the grid position of the agent
                }
                break;
            case Action.Right:
                if (this._gridPos.x < classroom_ncols - 1) {
                    let newPos = { x: this._gridPos.x + 1, y: this._gridPos.y };
                    if(this._classroom.moveAgent(this, oldPos, newPos)) this._gridPos = newPos; // If the move is successful, update the grid position of the agent
                }
                break;
            default:
                break;
        }
    }
}

export default Agent;