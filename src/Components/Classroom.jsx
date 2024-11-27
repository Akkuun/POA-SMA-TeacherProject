import globals from "globals";
import {vecLength} from "./Global.jsx";
import {TopLeft, DownVector, RightVector, CoordInterval} from "./Global.jsx";

import * as PIXI from 'pixi.js';


export const classroom_nrows = 27;
export const classroom_ncols = 41;

const cellUnit = {
    x: 1 / (classroom_ncols - 1),
    y: 1 / (classroom_nrows - 1)
}

const cellSize = {
    x: vecLength(RightVector) * cellUnit.x,
    y: vecLength(DownVector) * cellUnit.y
}


export function GridCoordsToDisplayCoords(x, y) {
    let ret = {};
    let u = (x / classroom_ncols);
    let v = (y / classroom_nrows);
    ret.x = TopLeft.x + u * RightVector.x + v * DownVector.x;
    ret.y = TopLeft.y + u * RightVector.y + v * DownVector.y;
    return ret;
}

export class Classroom {
    _app;

    // Environment
    _agentsWaitingToEnter = [];
    _students = [];
    _teachers = [];
    _grid = []; // array that contains the grid of the classroom

    constructor(app) {
        this._app = app;
        this.initializeGrid();
        this.displayGrid();
    }

    addStudent(student) {
        this._students.push(student);
        this.addAgent(student);
        this.agentEnter();
    }

    addTeacher(teacher) {
        this._teachers.push(teacher);
        this.addAgent(teacher);
        this.agentEnter();
    }

    addAgent(agent) {
        this._agentsWaitingToEnter.push(agent);
    }

    agentEnter() { // Will be useful to make the agents enter the classroom in sequence and walk to their predefined position
        let agent = this._agentsWaitingToEnter.pop();

        // Replace this bloc by either the entrance position and check if it is empty or a predefined position for each agent
        let pos = {
            x: Math.floor(Math.random() * (classroom_ncols-1)),
            y: Math.floor(Math.random() * (classroom_nrows-1))
        }
        while (this._grid[pos.y][pos.x] != 0) {
            pos = {
                x: Math.floor(Math.random() * (classroom_ncols-1)),
                y: Math.floor(Math.random() * (classroom_nrows-1))
            }
        }
        this._grid[pos.y][pos.x] = agent;
        // End of the bloc

        agent.setGridPos(pos);
    }   

    moveAgent(agent, oldPos, newPos) {
        if (this._grid[oldPos.y][oldPos.x] == agent) {
            this._grid[oldPos.y][oldPos.x] = 0;
            this._grid[newPos.y][newPos.x] = agent;
            return true;
        } else {
            return false;
        }
    } 

    initializeGrid() {
        let grid = [];
        for (let i = 0; i < classroom_nrows; i++) {
            let row = [];
            for (let j = 0; j < classroom_ncols; j++) {
                row.push(0);
            }
            grid.push(row);
        }
        this._grid = grid;
    }

    displayGrid() {
        for (let i = 0; i < this._grid.length; i++) {
            for (let j = 0; j < this._grid[i].length; j++) {
                let graphics = new PIXI.Graphics();
                let coords = GridCoordsToDisplayCoords(j, i);
                let points = [
                    new PIXI.Point(coords.x, coords.y),
                    new PIXI.Point(coords.x + cellUnit.x * RightVector.x, coords.y + cellUnit.x * RightVector.y),
                    new PIXI.Point(coords.x + cellUnit.x * RightVector.x + cellUnit.y * DownVector.x, coords.y + cellUnit.x * RightVector.y + cellUnit.y * DownVector.y),
                    new PIXI.Point(coords.x + cellUnit.y * DownVector.x, coords.y + cellUnit.y * DownVector.y)
                ];
                let cellDisplay = new PIXI.Polygon(points);
                // draw the border of the cell
                graphics.lineStyle(1, 0x000000, 1);
                graphics.beginFill(0xFFFFFF);
                graphics.drawPolygon(cellDisplay);
                graphics.endFill();
            
                graphics.zIndex = 2;
                this._app.stage.addChild(graphics); 

            }
        }
    }

}

export default Classroom;