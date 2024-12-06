import { Agent } from './Agent';
import { WindowWidth, WindowHeight } from './Global';
import Graph from "./Graph.js";

export const StudentState = {
    Idle : "Idle",
    MovingToCandy : "MovingToCandy",
    MovingToDesk : "MovingToDesk",
}

export class Student extends Agent {
    _state;
    _desk;
    _candies;
    _status;

    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
        this._width = 26 / 545 * WindowWidth * 0.46;
        this._height = 37 / 405 * WindowHeight * 50/68;
        this._state = StudentState.Idle;
        this._candies = 0;
        this._status = StudentState.Idle;
    }

    changeState(status){
        this._state = status;
    }
    
    performAgentAction(action) {
        this.move(action);
    }

    doIWannaCandy(){
        /*
        loi binomiale de param p=0,002 n=30  1 etu toutes les 3 secondes
         */
        return Math.random() < 0.002;
    }

    choseAgentAction() {
        let destination;
        let graph = new Graph(this._classroom);

        // Condition qui dit si le student veut un bonbon. Si il veut un bonbon, state devient MovingToCandy

        // Si état = idle, return
        if(this._state === this._state.Idle){
            if(this.doIWannaCandy()){
                this._status = StudentState.MovingToCandy;
            }
        }else{
            // Sinon
            // Si état = MovingToCandy, destination = bonbon le plus proche
            if(this._state === this._state.MovingToCandy){
                destination = this._classroom._candy; //destination

            }else if(this._state === this._state.MovingToDesk){    // Si état = MovingToDesk, destination = son desk
                destination = this._desk._coordGrid; //destination
            }
            // Calcule la route (pathfinding) pour aller à la destination
            console.log(this._gridPos);
            console.log(destination);

            let path = graph.A_star(this._gridPos, destination);
            // Fait le prochain mouvement
            this.performAgentAction(this.getNextDirection(this._gridPos, path[1]));

            // Si état = MovingToCandy, et si le student est sur une case adjacente au bonbon, state devient MovingToDesk et il a réussi à prendre le bonbon
            if((this._state === this._state.MovingToCandy)&&(this._gridPos.x === destination.x && this._gridPos.y === destination.y)) {
                this._status = StudentState.MovingToDesk;
                this._candies++;
            }
            if((this._state === this._state.MovingToDesk)&&(this._gridPos.x === destination.x && this._gridPos.y === destination.y)) { // Si état = MovingToDesk, et si le student est sur son desk, state devient idle
                this._status = StudentState.Idle;
            }
        }

    }

    setDesk(desk) {
        this._desk = desk;
    }

}

export default Student;