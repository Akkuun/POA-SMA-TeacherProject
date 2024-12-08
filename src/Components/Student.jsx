import {Agent} from './Agent';
import {WindowHeight, WindowWidth} from './Global';
import Graph from "./Graph.js";
import * as PIXI from "pixi.js";
import {ClassroomState} from "./Classroom.jsx";

export const StudentState = {
    StartAnimation: "StartAnimation",
    Idle: "Idle",
    MovingToCandy: "MovingToCandy",
    MovingToDesk: "MovingToDesk",
    MovingToDeskTouched: "MovingToDeskTouched"
}

export class Student extends Agent {
    _state;
    _desk;
    _candies;
    _sprite;
    _positions;

    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
        this._width = 26 / 545 * WindowWidth * 0.46;
        this._height = 37 / 405 * WindowHeight * 50 / 68;
        this._state = StudentState.StartAnimation;
        this._candies = 0;
        this._positions = [];
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


    choseAgentAction() {
        let destination;
        let graph = new Graph(this._classroom._grid, this._gridPos, this._classroom._candy);
        if (this._classroom._state === "StartAnimation") {
            // Si état = StartAnimation, destination = position de départ
            destination = this._desk._coordGrid;
            if (this._gridPos.x === destination.x && this._gridPos.y === destination.y) {
                this._state = StudentState.Idle;
                return;
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
        } else {
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
    
                } else if (this._state === StudentState.MovingToDesk || this._state === StudentState.MovingToDeskTouched) {    // Si état = MovingToDesk, destination = son desk
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
                    this._state = StudentState.MovingToDesk;
                    this._candies++;
                    this.changeSprite('../../src/assets/student_candy.png'); //changer le sprite
                }
                if ((this._state === StudentState.MovingToDesk || this._state === StudentState.MovingToDeskTouched) && (this._gridPos.x === destination.x && this._gridPos.y === destination.y)) { // Si état = MovingToDesk, et si le student est sur son desk, state devient idle
                    this._state = StudentState.Idle;
                    this.changeSprite('../../src/assets/student.png'); //changer le sprite
                }
        }
        }

    }

    setDesk(desk) {
        this._desk = desk;
    }

    changeSprite(newTexture) {
        PIXI.Assets.load(newTexture).then((texture) => {
            this._sprite.texture = texture;
        });
    }

    getPosition() {
        return this._positions;
    }

}

export default Student;