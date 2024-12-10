import {Agent} from './Agent';
import {WindowHeight, WindowWidth, SHOWPATH} from "./Global.jsx";
import Graph from "./Graph.js";
import {StudentState} from "./Student.jsx";
import {ClassroomState} from "./Classroom.jsx";

export const TeacherState = {
    StartAnimation : "StartAnimation",
    Patrolling: "Patrolling",
    MovingToStudent: "MovingToStudent",
}

// Each TeacherPathStrategy must return a {destination: {int x,int y}, targetStudent: Student s} object
export const TeacherPathStrategy = {
    // Chemin le plus court
    ShortestPath: function() {
        let destination = null;
        let targetStudent = this._choseStudentStrategy();
        if (targetStudent === null) this._state = TeacherState.Patrolling; // Si il n'y a pas de student en mouvement, state devient Patrolling
        // Si état = Patrolling, destination = prochain point de patrouille
        if (this._state === TeacherState.Patrolling) {
            destination = this.getPatrolPoint();
        // console.log("Point de patrouille : ", destination);
        }
        if (this._state === TeacherState.MovingToStudent) {
            destination = targetStudent._gridPos;
            //console.log("Closest student position", destination);
        }
        return {destination: destination, targetStudent: targetStudent};
    },
}


export const ChoseStudentStrategy = {
    // Le Student le plus proche à l'instant t
    ClosestStudent: function() {
        let targetStudent = null;
        for (let student of this._classroom._students) {
            if (student._state === StudentState.MovingToCandy || student._state === StudentState.MovingToDesk) {
                this._state = TeacherState.MovingToStudent;
                if (targetStudent === null) targetStudent = student;
                else {
                    if (Math.abs(this._gridPos.x - student._gridPos.x) + Math.abs(this._gridPos.y - student._gridPos.y) < Math.abs(this._gridPos.x - targetStudent._gridPos.x) + Math.abs(this._gridPos.y - targetStudent._gridPos.y)) {
                        targetStudent = student;
                    }

                }
            }
        }
        return targetStudent;
    },
    // Le student le plus proche à l'instant t puis focus sur le même jusqu'à ce qu'il soit touché ou retourné à sa place
    ClosestStudentFocused: function() {
        if (this._currentTarget !== null && (this._currentTarget._state === StudentState.MovingToCandy || this._currentTarget._state === StudentState.MovingToDesk)) {
            return this._currentTarget;
        } else {
            this._currentTarget = null;
        }
        this._currentTarget = ChoseStudentStrategy.ClosestStudent.bind(this)();
        return this._currentTarget;
    },
}

export class Teacher extends Agent {
    _state;
    _desk;
    _patrolPoints = [{x: 1, y: 1}, {x: 30, y: 25}];
    _patrolStatus = 0;
    _choseStudentStrategy;
    _currentTarget = null;
    _pathStrategy;

    constructor(p_app, p_classroom) {
        super(p_app, p_classroom);
        this._state = TeacherState.StartAnimation;
        this._width = 25 / 545 * WindowWidth * 0.6;
        this._height = 24 / 405 * WindowHeight * 50 / 40;
        this.setChoseStudentStrategy(ChoseStudentStrategy.ClosestStudentFocused);
        this.setPathStrategy(TeacherPathStrategy.ShortestPath);
    }

    performAgentAction(action) {
        this.move(action);
    }

    setChoseStudentStrategy(strategy) {
        if (strategy instanceof Function) {
            this._choseStudentStrategy = strategy;
        } else {
            // if strategy is a string, get the function from the object
            if (ChoseStudentStrategy[strategy]) this._choseStudentStrategy = ChoseStudentStrategy[strategy];
        }
    }

    setPathStrategy(strategy) {
        if (strategy instanceof Function) {
            this._pathStrategy = strategy;
        } else {
            // if strategy is a string, get the function from the object
            if (TeacherPathStrategy[strategy]) this._pathStrategy = TeacherPathStrategy[strategy];
        }
    }

    choseAgentAction() {
        let start = this._gridPos;
        let destination = null;
        let targetStudent = null;
        if (this._classroom._state === ClassroomState.StartAnimation) {
            // Si état = StartAnimation, destination = position de départ
            destination = {x:this._desk._coordGrid.x+1, y:this._desk._coordGrid.y};
            if (start.x === destination.x && start.y === destination.y) {
                this._state = TeacherState.Patrolling;
                return;
            }
        } else {
            // Si il existe un student qui est à l'était moving to candy ou moving to desk, state devient MovingToStudent et on récupère le student le plus proche
            let strategyResult = this._pathStrategy();
            destination = strategyResult.destination;
            targetStudent = strategyResult.targetStudent;            
        }
        // Calcule la route (pathfinding) pour aller à la destination
        let graph = new Graph(this._classroom._grid, this._gridPos, destination);
        //console.log(graph);

        let path = graph.A_star(start, destination);
        if (path.length > 0) {
            // Fait le prochain mouvement
            let direction = this.getNextDirection(start, path[1]);
            //console.log("Direction : ", direction);
            this.performAgentAction(direction);
        }

        if (this._state === TeacherState.MovingToStudent && this.oneOf(this._gridPos, destination)) {
            if (targetStudent._state === StudentState.MovingToDesk){
                targetStudent._candies--;
                targetStudent.changeSprite('../../src/assets/student.png');
            }// Teacher récupère le bonbon que le student a pris
            targetStudent.changeState(StudentState.MovingToDeskTouched);
            this._state = TeacherState.Patrolling;


        }


        // Si état = MovingToStudent, et si le teacher est sur une case adjacente au student, state devient Patrolling
        // Si état = Patrolling, et si le teacher est sur un point de patrouille, il passe au prochain point de patrouille

    }

    // Retourne le prochain point de patrouille (a_star vers point de patrouille)
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

    displayDebugPatrouille() {
        if (SHOWPATH) {
            for (let point of this._patrolPoints) {
                this._classroom.displayDebugGridCell(point);
            }
        }
    }
}

export default Teacher;