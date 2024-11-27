import {TopLeft, DownVector, RightVector} from "./Global.jsx";
import {Student} from "./Student.jsx";
import {Teacher} from "./Teacher.jsx";

import * as PIXI from 'pixi.js';


export const classroom_nrows = 27;
export const classroom_ncols = 41;

const cellUnit = {
    x: 1 / (classroom_ncols - 1),
    y: 1 / (classroom_nrows - 1)
};

export function GridCoordsToDisplayCoords(x, y) {
    let ret = {};
    let u = (x / classroom_ncols);
    let v = (y / classroom_nrows);
    ret.x = TopLeft.x + u * RightVector.x + v * DownVector.x;
    ret.y = TopLeft.y + u * RightVector.y + v * DownVector.y;
    return ret;
}

export function GridCellCenterForDisplay(x, y) {
    let ret = {};
    let u = ((x + 0.5) / classroom_ncols);
    let v = ((y + 0.5) / classroom_nrows);
    ret.x = TopLeft.x + u * RightVector.x + v * DownVector.x;
    ret.y = TopLeft.y + u * RightVector.y + v * DownVector.y;
    return ret;
}

export class Classroom {
    _app;

    // Environment
    _candyJar; // The candy jar
    _agentsWaitingToEnter = []; // array that contains the agents waiting to enter the classroom for a start animation
    _students = []; // array that contains the students in the classroom
    _teachers = []; // array that contains the teachers in the classroom

    _grid = []; // array that contains the grid of the classroom. Each cell can contain an agent or 0 if the cell is empty, or something else if the cell is occupied by something else (TODO)

    constructor(app) {
        this._app = app;
        this.initializeGrid();
    }

    forceAgentPosForDebug(agent, pos) {
        this._grid[agent._gridPos.y][agent._gridPos.x] = 0;
        this._grid[pos.y][pos.x] = agent;
        agent.setGridPos(pos);
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
        if (this._grid[oldPos.y][oldPos.x] == agent && this._grid[newPos.y][newPos.x] == 0) {
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

    displayDebugGrid() {
        if (this._app.stage.grid) { // Remove the previous grid
            this._app.stage.removeChild(this._app.stage.grid);
        }
        let grid = new PIXI.Container();
        grid.zIndex = 2;
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

                // display a dot in the center of the cell
                let dot = GridCellCenterForDisplay(j, i);
                if (this._grid[i][j] instanceof Student) {
                    graphics.beginFill(0xFF0000);
                } else if (this._grid[i][j] instanceof Teacher) {
                    graphics.beginFill(0x00FF00);
                } else {
                    graphics.beginFill(0x0000FF);
                }
                graphics.drawCircle(dot.x, dot.y, 3);
                graphics.endFill();
            
                graphics.zIndex = 2;
                grid.addChild(graphics); 

            }
        }
        this._app.stage.addChild(grid);
    }

}

export default Classroom;