import {Agent} from './Agent';
import {WindowHeight, WindowWidth} from './Global';
import Graph from "./Graph.js";

export const StudentState = {
    Idle: "Idle",
    MovingToCandy: "MovingToCandy",
    MovingToDesk: "MovingToDesk",
}

export class Student extends Agent {
    _state;
    _desk;
    _candies;

    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
        this._width = 26 / 545 * WindowWidth * 0.46;
        this._height = 37 / 405 * WindowHeight * 50 / 68;
        this._state = StudentState.Idle;
        this._candies = 0;
    }

    changeState(status) {
        this._state = status;
    }

    performAgentAction(action) {
        this.move(action);
    }

    doIWannaCandy() {
        /*
        loi binomiale de param p=0,002 n=30  1 etu toutes les 3 secondes
         */
        return Math.random() < 0.002; // 1 agent : p = 0.1, 5 agents : p = 0.01, 20 agents : p = 0.002
    }

    oneOf(gridPosA, gridPosB) {
        return (Math.abs(gridPosA.x - gridPosB.x) + Math.abs(gridPosA.y - gridPosB.y) === 1);
    }

    choseAgentAction() {
        let destination;
        let graph = new Graph(this._classroom._grid, this._gridPos, this._classroom._candy);

        // Condition qui dit si le student veut un bonbon. Si il veut un bonbon, state devient MovingToCandy

        // Si état = idle, return
        if (this._state === StudentState.Idle) {
            if (this.doIWannaCandy()) {
                this._state = StudentState.MovingToCandy;
            }
        } else {
            // Sinon
            // Si état = MovingToCandy, destination = bonbon le plus proche
            if (this._state === StudentState.MovingToCandy) {
                destination = this._classroom._candy; //destination

            } else if (this._state === StudentState.MovingToDesk) {    // Si état = MovingToDesk, destination = son desk
                destination = this._desk._coordGrid; //destination
            }
            // Calcule la route (pathfinding) pour aller à la destination
            try {
                let path = graph.A_star(this._gridPos, destination);
                graph.drawPath(path, this._app);
                // Fait le prochainpath[1] mouvementpath[1]
                let action = this.getNextDirection(this._gridPos, path[1]);
                this.performAgentAction(action);
            } catch (e) {
                console.log(e); // if the path is not found (no path to the destination, because blocked by another agent)
            }

            // Si état = MovingToCandy, et si le student est sur une case adjacente au bonbon, state devient MovingToDesk et il a réussi à prendre le bonbon
            if ((this._state === StudentState.MovingToCandy) && this.oneOf(this._gridPos, destination)) {
                if (this._gridPos)
                    this._state = StudentState.MovingToDesk;
                this._candies++;
            }
            if ((this._state === StudentState.MovingToDesk) && (this._gridPos.x === destination.x && this._gridPos.y === destination.y)) { // Si état = MovingToDesk, et si le student est sur son desk, state devient idle
                this._state = StudentState.Idle;
            }
        }

    }

    setDesk(desk) {
        this._desk = desk;
    }

}

export default Student;