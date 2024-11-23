import * as PIXI from 'pixi.js';
import MapSprite from '../assets/map.png';

const WindowWidth = window.innerWidth;
const WindowHeight = window.innerHeight;

export class Classroom {
    _app;

    // Environment
    _students = [];

    constructor(app) {
        this._app = app;
        console.log(this._app);
    }

    addStudent(student) {
        this._students.push(student);
    }
}

export default Classroom;