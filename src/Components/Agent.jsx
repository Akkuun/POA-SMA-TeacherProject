import {classroom_ncols, classroom_nrows, GridCellCenterForDisplay} from './Classroom';

export const Action = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right',
};

export class Agent {
    _sprite;
    _app;
    _classroom;
    _gridPos = {x: -1, y: -1};

    constructor(p_app, p_classroom) {
        this._app = p_app;
        this._classroom = p_classroom;
    }

    // Computes the display position of the student's sprite from its model  position
    display() {
        if (this._sprite) {
            let coords = GridCellCenterForDisplay(this._gridPos.x, this._gridPos.y);
            this._sprite.x = coords.x;
            this._sprite.y = coords.y;
        }
    }

    setGridPos(pos) {
        this._gridPos = {x: pos.x, y: pos.y};
    }

    performAgentAction(action) {
        throw new Error("Method 'performAction()' must be implemented.");
    }

    choseAgentAction() {
        throw new Error("Method 'choseAction()' must be implemented.");
    }

    setSprite(sprite) {
        this._sprite = sprite;
    }

    getNextDirection(current, next) {
        next = {x: next.y, y: next.x};
        if (next.x > current.x) {
            return Action.Right;
        } else if (next.x < current.x) {
            return Action.Left;
        } else if (next.y > current.y) {
            return Action.Down;
        } else if (next.y < current.y) {
            return Action.Up;
        }
    }


    // function that return true if the agent is on a cell adjacent to the destination
    oneOf(gridPosA, gridPosB) {
        return (Math.abs(gridPosA.x - gridPosB.x) + Math.abs(gridPosA.y - gridPosB.y) === 1);
    }

    move(action) {
        let oldPos = this._gridPos;
        switch (action) {
            case Action.Up:
                if (this._gridPos.y > 0) {
                    let newPos = {x: this._gridPos.x, y: this._gridPos.y - 1};
                    if (this._classroom.moveAgent(this, oldPos, newPos)) this._gridPos = newPos; // If the move is successful, update the grid position of the agent
                }
                break;
            case Action.Down:
                if (this._gridPos.y < classroom_nrows - 1) {
                    let newPos = {x: this._gridPos.x, y: this._gridPos.y + 1};
                    if (this._classroom.moveAgent(this, oldPos, newPos)) this._gridPos = newPos; // If the move is successful, update the grid position of the agent
                }
                break;
            case Action.Left:
                if (this._gridPos.x > 0) {
                    let newPos = {x: this._gridPos.x - 1, y: this._gridPos.y};
                    if (this._classroom.moveAgent(this, oldPos, newPos)) this._gridPos = newPos; // If the move is successful, update the grid position of the agent
                }
                break;
            case Action.Right:
                if (this._gridPos.x < classroom_ncols - 1) {
                    let newPos = {x: this._gridPos.x + 1, y: this._gridPos.y};
                    if (this._classroom.moveAgent(this, oldPos, newPos)) this._gridPos = newPos; // If the move is successful, update the grid position of the agent
                }
                break;
            default:
                break;
        }
        if (this._sprite) this.display(); // Update the sprite position from the agent's model position
    }


}

export default Agent;