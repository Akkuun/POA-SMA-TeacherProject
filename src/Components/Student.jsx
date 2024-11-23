import { Agent } from './Agent';
import { TopLeft, DownVector, RightVector, CoordInterval } from './Global';

export class Student extends Agent {
    constructor(p_coordModele, p_app, p_classroom) {
        super(p_coordModele, p_app, p_classroom);
    }

    setSprite(sprite) {
        this._sprite = sprite;
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
        this.move(action);
        if(this._sprite) this.display(); // Update the sprite position from the agent's model position
    }

}

export default Student;