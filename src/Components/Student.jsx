import { Agent } from './Agent';
import * as PIXI from 'pixi.js';

export class Student extends Agent {
    constructor(p_coordModele, p_app, p_classroom) {
        super(p_coordModele, p_app, p_classroom);
        this.display();
    }

    display() {
        this.computeDisplayCoords();
        this._sprite = new PIXI.Graphics();
        this._sprite.beginFill(0xFF0000);
        this._sprite.drawCircle(0, 0, 5);
        this._sprite.endFill();
        this._sprite.zIndex = 1546456456;
        this._sprite.x = this._coordDisplay.x;
        this._sprite.y = this._coordDisplay.y;
        
        this._app.stage.addChild(this._sprite);
    }
}

export default Student;