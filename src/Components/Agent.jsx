import { AABB } from "./AABB";
import * as PIXI from 'pixi.js';

const WindowWidth = window.innerWidth;
const WindowHeight = window.innerHeight;

export class Agent {
    _sprite;
    _aabb;
    _app;
    _classroom;
    _coordModele = {};
    _coordDisplay = {};

    // Gameplay variables
    _speed = 1;

    constructor(p_coordModele, p_app, p_classroom) {
        this._coordModele = p_coordModele;
        this._app = p_app;
        this._classroom = p_classroom;
    }

    display() {
        throw new Error("Method 'display()' must be implemented.");
    }

    performAgentAction(action) {
        throw new Error("Method 'performAction()' must be implemented.");
    }

    choseAgentAction() {
        throw new Error("Method 'choseAction()' must be implemented.");
    }

    computeDisplayCoords() {
        let u = this._coordModele.x / 100;
        let v = this._coordModele.y / 100;
        this._coordDisplay.x = u * this._classroom._downVector.x + v * this._classroom._downVector.x;
        this._coordDisplay.y = u * this._classroom._downVector.y + v * this._classroom._downVector.y;
    }
}

export default Agent;