import { Agent } from './Agent';
import { WindowWidth, WindowHeight } from './Global';


export const StudentState = {
    Idle : "Idle",
    MovingToCandy : "MovingToCandy",
    MovingToDesk : "MovingToDesk",
}

export class Student extends Agent {
    _state;
    _desk;
    _candies;

    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
        this._width = 26 / 545 * WindowWidth * 0.46;
        this._height = 37 / 405 * WindowHeight * 50/68;
        this._state = StudentState.Idle;
        this._candies = 0;
    }
    
    performAgentAction(action) {
        this.move(action);
    }

    choseAgentAction() {
        this._classroom;

        // Condition qui dit si le student veut un bonbon. Si il veut un bonbon, state devient MovingToCandy

        // Si état = idle, return

        // Sinon
        // Si état = MovingToCandy, destination = bonbon le plus proche
        // Si état = MovingToDesk, destination = son desk
        // Calcule la route (pathfinding) pour aller à la destination
        // Fait le prochain mouvement
        // Si état = MovingToCandy, et si le student est sur une case adjacente au bonbon, state devient MovingToDesk et il a réussi à prendre le bonbon
        // Si état = MovingToDesk, et si le student est sur son desk, state devient idle

    }

    setDesk(desk) {
        this._desk = desk;
    }

}

export default Student;