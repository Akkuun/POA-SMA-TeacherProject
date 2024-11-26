import { Agent } from './Agent';
import { TopLeft, DownVector, RightVector, CoordInterval } from './Global';

export class Student extends Agent {
    constructor(p_coordModele, p_app, p_classroom) {
        super(p_coordModele, p_app, p_classroom);
    }
    
    performAgentAction(action) {
        this.move(action);
        if(this._sprite) this.display(); // Update the sprite position from the agent's model position
    }

}

export default Student;