import globals from "globals";
import {vecLength} from "./Global.jsx";
import * as PIXI from "@pixi/react";

export class Classroom {
    _app;

    // Environment
    _students = [];
    _teachers = [];
    _tables = [];
    _grids = []; // array that contains the grid of the classroom

    constructor(app) {
        this._app = app;
        console.log(this._app);
    }

    addStudent(student) {
        this._students.push(student);
    }

    fillGridArrayAndDraw() {
        let number_of_rows = 27;
        let lenght_of_one_column = vecLength(globals.DownVector);
        let lenght_of_one_grid = lenght_of_one_column / number_of_rows;

        for (let i = 0; i < number_of_rows; i++) {
            let grid = [];
            for (let j = 0; j < 2; j++) {
                grid.push({x: j * lenght_of_one_grid, y: i * lenght_of_one_grid});
            }
            this._grids.push(grid);
        }

        for (let i = 0; i < this._grids.length; i++) {
            for (let j = 0; j < this._grids[i].length; j++) {
                let graphics = new PIXI.Graphics();
                graphics.lineStyle(2, 0xFF00FF, 1);
                graphics.beginFill(0xFF00BB, 0.25);
                graphics.drawRect(this._grids[i][j].x, this._grids[i][j].y, lenght_of_one_grid, lenght_of_one_grid);
                graphics.endFill();
                this._app.stage.addChild(graphics);
            }
        }

    }


}

export default Classroom;