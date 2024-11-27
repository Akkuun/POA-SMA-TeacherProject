import { Agent } from './Agent';

export class Teacher extends Agent {
    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
    }
    
    performAgentAction(action) {
        this.move(action);
        if(this._sprite) this.display(); // Update the sprite position from the agent's model position
    }

}

export default Teacher;