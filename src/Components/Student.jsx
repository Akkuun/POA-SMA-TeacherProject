import {Agent} from './Agent';
import {WindowHeight, WindowWidth, SHOWPATH, DEBUG_INTRO} from './Global';
import Graph from "./Graph.js";
import * as PIXI from "pixi.js";
import {ClassroomState, classroom_nrows} from "./Classroom.jsx";

export const StudentState = {
    StartAnimation: "StartAnimation",
    Idle: "Idle",
    MovingToCandy: "MovingToCandy",
    MovingToDesk: "MovingToDesk",
    MovingToDeskTouched: "MovingToDeskTouched"
}

// Path strategies, should return the destination as a {x, y} object
export const StudentPathStrategy = {
    // Chemin le plus court
    ShortestPath: function() {
        if (this._state === StudentState.MovingToCandy) {
            return this._classroom._candy; //destination

        } else if (this._state === StudentState.MovingToDesk || this._state === StudentState.MovingToDeskTouched) {    // Si état = MovingToDesk, destination = son desk
            return this._desk._coordGrid; //destination
        }
    },
    // Chemin le plus long (tour de la classe)
    LongestPath: function() {
        if (this._state === StudentState.MovingToCandy) {
            switch (this.__movingStrategyData["longestPath"]["subState"]) {
                case 0: // before desk point
                    if (this._gridPos.x === this.__movingStrategyData["longestPath"]["studentPoint"].x && this._gridPos.y === this.__movingStrategyData["longestPath"]["studentPoint"].y) {
                        this.__movingStrategyData["longestPath"]["subState"] = 1;
                        return this.__movingStrategyData["longestPath"]["candyPoint"];
                    }
                    return this.__movingStrategyData["longestPath"]["studentPoint"];
                case 1: // after desk point
                    if (this._gridPos.x === this.__movingStrategyData["longestPath"]["candyPoint"].x && this._gridPos.y === this.__movingStrategyData["longestPath"]["candyPoint"].y) {
                        this.__movingStrategyData["longestPath"]["subState"] = 2;
                        return this._classroom._candy;
                    }
                    return this.__movingStrategyData["longestPath"]["candyPoint"];
                case 2: // after candy point
                    return this._classroom._candy;
            }

        } else if (this._state === StudentState.MovingToDesk || this._state === StudentState.MovingToDeskTouched) {    // Si état = MovingToDesk, destination = son desk
            this.__movingStrategyData["longestPath"]["subState"] = 0;
            return this._desk._coordGrid; //destination
        }
    },
}

// Want candy strategies, should return a boolean
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
            if (student._state === StudentState.MovingToCandy && student.__framesSinceLastStartMovingToCandy === student._speed) {
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
    _initSprite;
    _candySprite;

    // Data for strategies
    __movingStrategyData; 
    __framesSinceLastStartMovingToCandy = 0; 

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

    setInitSprite(sprite) {
        this._initSprite = sprite;
    }

    setCandySprite(sprite) {
        this._candySprite = sprite;
    }

    initializeStrategyData() {
        // LongestPath data
        this.__movingStrategyData = {};
        this.__movingStrategyData["longestPath"] = {};
        let longestPathY = (classroom_nrows - this._gridPos.y > this._gridPos.y) ? 1 : classroom_nrows - 2;
        this.__movingStrategyData["longestPath"]["studentPoint"] = {x: this._gridPos.x, y: longestPathY};
        this.__movingStrategyData["longestPath"]["candyPoint"] = {x: this._classroom._candy.x, y: longestPathY};
        this.__movingStrategyData["longestPath"]["subState"] = 0;
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
        if (strategy === "Random") {
            let keys = Object.keys(StudentPathStrategy);
            this._pathStrategy = StudentPathStrategy[keys[Math.floor(Math.random() * keys.length)]];
            return;
        }
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
                this.initializeStrategyData();
                this._state = StudentState.Idle;
                return;
            }
             // Calcule la route (pathfinding) pour aller à la destination
             try {
                let path = graph.A_star(this._gridPos, destination);
                if(SHOWPATH && DEBUG_INTRO) graph.drawPath(path, this._app);
                // Fait le prochainpath[1] mouvementpath[1]
                let action = this.getNextDirection(this._gridPos, path[1]);
                this.performAgentAction(action);
            } catch (e) {
                //console.log(e); // if the path is not found (no path to the destination, because blocked by another agent)
            }
        } else {
            // Condition qui dit si le student veut un bonbon. Si il veut un bonbon, state devient MovingToCandy
            // Si état = idle, return
            if (this._state === StudentState.Idle) {
                if (this._wantCandyStrategy()) {
                    this.__framesSinceLastStartMovingToCandy = 0;
                    this._state = StudentState.MovingToCandy;
                }
            } else {
                this.__framesSinceLastStartMovingToCandy++;
                // Sinon
                // Si état = MovingToCandy, destination = bonbon le plus proche si shortestPath, ou destination incluse dans le chemin différent du plus court (retournée par la stratégie)
                destination = this._pathStrategy();
                // Calcule la route (pathfinding) pour aller à la destination
                try {
                    let path = graph.A_star(this._gridPos, destination);
                    if(SHOWPATH) graph.drawPath(path, this._app);
                    // Fait le prochainpath[1] mouvementpath[1]
                    let action = this.getNextDirection(this._gridPos, path[1]);
                    this.performAgentAction(action);
                } catch (e) {
                    //console.log(e); // if the path is not found (no path to the destination, because blocked by another agent)
                }
    
                // Si état = MovingToCandy, et si le student est sur une case adjacente au bonbon, state devient MovingToDesk et il a réussi à prendre le bonbon
                if ((this._state === StudentState.MovingToCandy) && this.oneOf(this._gridPos, this._classroom._candy)) {
                    this._state = StudentState.MovingToDesk;
                    this._candies++;
                    this.changeSprite(this._candySprite); //changer le sprite
                }
                if ((this._state === StudentState.MovingToDesk || this._state === StudentState.MovingToDeskTouched) && (this._gridPos.x === destination.x && this._gridPos.y === destination.y)) { // Si état = MovingToDesk, et si le student est sur son desk, state devient idle
                    this._state = StudentState.Idle;
                    this.changeSprite(this._initSprite); //changer le sprite
                }
            }
        }

    }


    setDesk(desk) {
        this._desk = desk;
    }

    changeSprite(newTexture) {
        PIXI.Assets.load(newTexture).then((texture) => {
            if (texture) {
                if (this._sprite) {
                    this._sprite.texture = texture;
                } else {
                    const studentSprite = new PIXI.Sprite(texture);
                    studentSprite.zIndex = 11;
                    studentSprite.width = this._width;
                    studentSprite.height = this._height;
                    studentSprite.anchor.set(0.5, 1);
                    this._app.stage.addChild(studentSprite);
                    this.setSprite(studentSprite);
                }
                this.display();
            } else {
                console.error('Texture is undefined.');
            }
        }).catch(error => {
            console.error('Failed to load texture:', error);
        });
    }

    updateSpritesBasedOnStrategy() {
        if (this._wantCandyStrategy.name === "WhenTeacherIsFarBehind") {
            //console.log("WhenTeacherIsFarBehind");
            this.setInitSprite('/POA-SMA-TeacherProject/src/assets/student_2.png');
            this.setCandySprite('/POA-SMA-TeacherProject/src/assets/student_2_candy.png');
        } else if (this._wantCandyStrategy.name === "WhenAnotherStudentStartsMoving") {
            //console.log("WhenAnotherStudentStartsMoving");
            this.setInitSprite('/POA-SMA-TeacherProject/src/assets/student_3.png');
            this.setCandySprite('/POA-SMA-TeacherProject/src/assets/student_3_candy.png');
        } else if (this._wantCandyStrategy.name === "Every5Seconds") {
            //console.log("Every5Seconds");
            this.setInitSprite('/POA-SMA-TeacherProject/src/assets/student_6.png');
            this.setCandySprite('/POA-SMA-TeacherProject/src/assets/student_6_candy.png');
        } else {
            //console.log("Default");
            this.setInitSprite('/POA-SMA-TeacherProject/src/assets/student_1.png');
            this.setCandySprite('/POA-SMA-TeacherProject/src/assets/student_1_candy.png');
        }
    }

    getPosition() {
        return this._positions;
    }

}

export default Student;