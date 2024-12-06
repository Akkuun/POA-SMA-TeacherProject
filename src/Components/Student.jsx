import { Agent } from './Agent';

export class Student extends Agent {
    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
    }
    
    performAgentAction(action) {
        this.move(action);
    }

}

export default Student;