import {Agent} from './Agent';
import {WindowHeight, WindowWidth} from "./Global.jsx";

export const TeacherState = {
    Patrolling: "Patrolling",
    MovingToStudent: "MovingToStudent",
}

export class Teacher extends Agent {
    _state;
    _desk;
    _patrolPoints = [];
    _patrolStatus = 0;

    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
        this._state = TeacherState.Patrolling;
        this._width = 25 / 545 * WindowWidth * 0.6;
        this._height = 24 / 405 * WindowHeight * 50 / 40;
    }

    performAgentAction(action) {
        this.move(action);
    }

    choseAgentAction() {

        // Si il existe un student qui n'est pas à son bureau, state devient MovingToStudent

        // Si état = Patrolling, destination = prochain point de patrouille
        // Si état = MovingToStudent, destination = student le plus proche qui n'est pas à son bureau
        // Calcule la route (pathfinding) pour aller à la destination
        // Fait le prochain mouvement
        // Si état = MovingToStudent, et si le teacher est sur une case adjacente au student, state devient Patrolling
        // Si état = Patrolling, et si le teacher est sur un point de patrouille, il passe au prochain point de patrouille
    }

    // Retourne le prochain point de patrouille
    // Si le teacher est sur le point i, retourne le point i+1
    // Sinon le teacher va vert le point i
    getPatrolPoint() {
        if (this._patrolPoints.length === 0) return null;
        if (this._gridPos.x === this._patrolPoints[this._patrolStatus].x && this._gridPos.y === this._patrolPoints[this._patrolStatus].y) {
            this._patrolStatus = (this._patrolStatus + 1) % this._patrolPoints.length;
        }
        return this._patrolPoints[this._patrolStatus];
    }

    setDesk(desk) {
        this._desk = desk;
    }
}

export default Teacher;