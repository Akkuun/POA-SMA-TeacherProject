import {Agent} from './Agent';
import {WindowHeight, WindowWidth, SHOWPATH} from './Global';
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

export const StudentPathStrategy = {
    // Chemin le plus court
    ShortestPath: function() {
        if (this._state === StudentState.MovingToCandy) {
            return this._classroom._candy; //destination

        } else if (this._state === StudentState.MovingToDesk || this._state === StudentState.MovingToDeskTouched) {    // Si état = MovingToDesk, destination = son desk
            return this._desk._coordGrid; //destination
        }
    },
}

export const WantCandyStrategies = {
    Probability: function() {
        return Math.random() < 0.002; // 1 agent : p = 0.1, 5 agents : p = 0.01, 20 agents : p = 0.002
    },
    // Quand le teacher est loin derrière
    WhenTeacherIsFarBehind: function() {
        for (let teacher of this._classroom._teachers) {
            if (teacher._gridPos.x > 5) {
                return false;
            }
        }
        return true;
    },
    // Quand un autre student commence à bouger
    WhenAnotherStudentStartsMoving: function() {
        for (let student of this._classroom._students) {
            if (student._state === StudentState.MovingToCandy || student._state === StudentState.MovingToDesk) {
                return true;
            }
        }
        return WantCandyStrategies.Probability();
    },
    // Toutes les 5 secondes
    Every5Seconds: function() {
        return this._app.ticker.lastTime % 5000 <= 100;
    }
}

export class Student extends Agent {
    _state;
    _desk;
    _candies;
    _sprite;
    _positions;
    _wantCandyStrategy;
    _pathStrategy;
    __movingStrategyData;

    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
        this._width = 26 / 545 * WindowWidth * 0.46;
        this._height = 37 / 405 * WindowHeight * 50 / 68;
        this._state = StudentState.StartAnimation;
        this._candies = 0;
        this._positions = [];
        let keys = Object.keys(WantCandyStrategies);
        this.setWantCandyStrategy(WantCandyStrategies[keys[Math.floor(Math.random() * keys.length)]]);
        this.setPathStrategy(StudentPathStrategy.ShortestPath);
    }

    changeState(status) {
        this._state = status;
    }

    performAgentAction(action) {
        this.move(action);
    }

    setWantCandyStrategy(strategy) {
        if (strategy === "Random") {
            let keys = Object.keys(WantCandyStrategies);
            this._wantCandyStrategy = WantCandyStrategies[keys[Math.floor(Math.random() * keys.length)]];
            return;
        }
        if (strategy instanceof Function) {
            this._wantCandyStrategy = strategy;
        } else {
            // if strategy is a string, get the function from the object
            if (WantCandyStrategies[strategy]) this._wantCandyStrategy = WantCandyStrategies[strategy];
        }
    }

    setPathStrategy(strategy) {
        if (strategy instanceof Function) {
            this._pathStrategy = strategy;
        } else {
            // if strategy is a string, get the function from the object
            if (StudentPathStrategy[strategy]) this._pathStrategy = StudentPathStrategy[strategy];
        }
    }

    choseAgentAction() {
        let destination;
        let graph = new Graph(this._classroom._grid, this._gridPos, this._classroom._candy);
        if (this._classroom._state === ClassroomState.StartAnimation) {
            // Si état = StartAnimation, destination = position de départ
            destination = this._desk._coordGrid;
            if (this._gridPos.x === destination.x && this._gridPos.y === destination.y) {
                this._state = StudentState.Idle;
                return;
            }
             // Calcule la route (pathfinding) pour aller à la destination
             try {
                let path = graph.A_star(this._gridPos, destination);
                if(SHOWPATH) graph.drawPath(path, this._app);
                // Fait le prochainpath[1] mouvementpath[1]
                let action = this.getNextDirection(this._gridPos, path[1]);
                this.performAgentAction(action);
            } catch (e) {
                console.log(e); // if the path is not found (no path to the destination, because blocked by another agent)
            }
        } else {
            // Condition qui dit si le student veut un bonbon. Si il veut un bonbon, state devient MovingToCandy
            destination = this._pathStrategy();
            // Si état = idle, return
            if (this._state === StudentState.Idle) {
                if (this._wantCandyStrategy()) {
                    this._state = StudentState.MovingToCandy;
                }
            } else {
                // Sinon
                // Si état = MovingToCandy, destination = bonbon le plus proche
                StudentPathStrategy.ShortestPath();
                // Calcule la route (pathfinding) pour aller à la destination
                try {
                    let path = graph.A_star(this._gridPos, destination);
                    if(SHOWPATH) graph.drawPath(path, this._app);
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