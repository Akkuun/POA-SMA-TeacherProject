import { Agent } from './Agent';
import * as PIXI from 'pixi.js';
import { TopLeft, DownVector, RightVector } from './Global';

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

export class Student extends Agent {
    constructor(p_coordModele, p_app, p_classroom) {
        super(p_coordModele, p_app, p_classroom);
        this._classroom.addStudent(this);
    }

    setSprite(sprite) {
        this._sprite = sprite;
    }

    display() {
        let u = this._coordModele.x / 100;
        let v = this._coordModele.y / 100;
        let x = TopLeft.x + u * RightVector.x + v * DownVector.x;
        let y = TopLeft.y + u * RightVector.y + v * DownVector.y;
        this._sprite.x = x;
        this._sprite.y = y;
    }

    performAgentAction() {
        this._coordModele.x += this._speed * 1;
        if(this._sprite) this.display();
    }

}

export default Student;