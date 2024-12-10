import * as PIXI from 'pixi.js';
import {cellUnit, GridCellCenterForDisplay, GridCoordsToDisplayCoords} from "./Classroom.jsx";
import {DownVector, RightVector} from "./Global.jsx";

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbors = [];
    }

    addNeighbor(node) {
        this.neighbors.push(node);
    }
}

class Graph {
    constructor(grid, start, destination) {
        this.grid = grid;
        this.ncols = grid.length;
        this.nrows = grid[0].length;
        this.start = start;
        this.destination = destination;
        this.nodes = this.createGraphFromGrid();
    }

    createGraphFromGrid() {
        const nodes = {};

        // Create nodes for all valid grid positions
        for (let i = 1; i < this.ncols; i++) {
            for (let j = 1; j < this.nrows; j++) {
                if (this.grid[i][j] === 0 || (i == this.start.y && j == this.start.x) || this.destination != null && (i == this.destination.y && j == this.destination.x)) { // si la case de destination est un student , on le met quand même dans le graph en tant que node valide
                    nodes[`${j},${i}`] = new Node(j, i);
                }
            }
        }

        // Add neighbors for each node
        for (let key in nodes) {
            const [x, y] = key.split(',').map(Number);
            const directions = [
                {dx: -1, dy: 0},
                {dx: 1, dy: 0},
                {dx: 0, dy: -1},
                {dx: 0, dy: 1}
            ];

            for (let dir of directions) {
                const nx = x + dir.dx;
                const ny = y + dir.dy;
                const neighborKey = `${nx},${ny}`;
                if (nodes[neighborKey]) {
                    nodes[key].addNeighbor(nodes[neighborKey]);
                }
            }
        }

        return nodes;
    }

    displayGraph() {
        for (let key in this.nodes) {
            /*console.log(
                `Node ${key} -> Neighbors:`,
                this.nodes[key].neighbors.map(neighbor => `${neighbor.x},${neighbor.y}`)
            );*/
        }
    }

    displayCells(app) {
        for (let key in this.nodes) {
            let node = this.nodes[key];
            let i = node.x;
            let j = node.y;
            let graphics = new PIXI.Graphics();
            let coords = GridCoordsToDisplayCoords(j, i);
            let points = [
                new PIXI.Point(coords.x, coords.y),
                new PIXI.Point(coords.x + cellUnit.x * RightVector.x, coords.y + cellUnit.x * RightVector.y),
                new PIXI.Point(coords.x + cellUnit.x * RightVector.x + cellUnit.y * DownVector.x, coords.y + cellUnit.x * RightVector.y + cellUnit.y * DownVector.y),
                new PIXI.Point(coords.x + cellUnit.y * DownVector.x, coords.y + cellUnit.y * DownVector.y)
            ];
            let cellDisplay = new PIXI.Polygon(points);

            // Draw the border of the cell
            graphics.lineStyle(1, 0x000000, 1);
            graphics.beginFill(0xFFFFFF);
            graphics.drawPolygon(cellDisplay);
            graphics.endFill();

            // Display a dot in the center of the cell
            let dot = GridCellCenterForDisplay(j, i);
            graphics.beginFill(0x0000FF);
            graphics.drawCircle(dot.x, dot.y, 3);
            graphics.endFill();

            graphics.zIndex = 3;
            app.stage.addChild(graphics);
        }
    }

    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    reverseXYOnPath(path) {
        let newPath = [];
        for (let cell of path) {
            newPath.push({x: cell.y, y: cell.x});
        }
        return newPath;
    }

    A_star(start, destination) {
        let startNode = this.nodes[`${start.x},${start.y}`];
        const destinationNode = this.nodes[`${destination.x},${destination.y}`];
        if (!startNode || !destinationNode) {
            //console.error("Start or destination node is invalid.");
            //console.log("Start Node:", startNode);
            //console.log("Destination Node:", destinationNode);
            return [];
        }


        let openSet = new Set([startNode]);
        let cameFrom = new Map();

        let gScore = new Map();
        gScore.set(startNode, 0);

        let fScore = new Map();
        fScore.set(startNode, this.heuristic(startNode, destinationNode));
        while (openSet.size > 0) {
            let current = Array.from(openSet).reduce((a, b) =>
                (fScore.get(a) || Infinity) < (fScore.get(b) || Infinity) ? a : b
            );
            if (current === destinationNode) {
                let path = [];
                while (current) {
                    path.push({x: current.x, y: current.y});
                    current = cameFrom.get(current);
                }
                path = this.reverseXYOnPath(path); // ON INVERSE TOUT AHAHAHAHAH
                return path.reverse();
            }

            openSet.delete(current);

            for (let neighbor of current.neighbors) {
                let tentative_gScore = (gScore.get(current) !== undefined ? gScore.get(current) : Infinity) + 1;

                if (tentative_gScore < (gScore.get(neighbor) !== undefined ? gScore.get(neighbor) : Infinity)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentative_gScore);
                    fScore.set(neighbor, gScore.get(neighbor) + this.heuristic(neighbor, destinationNode));

                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }

        //console.error("No path found.");
        return [];
    }

    //draw the start and destination cells in a different color
    drawPath(path, app) {
        for (let cell of path) {
            //console.log(cell);
            let i = cell.x;
            let j = cell.y;
            // remove old path
            if (this._graphics) {
                app.stage.removeChild(this._graphics);
            }
            this._graphics = new PIXI.Graphics();
            let coords = GridCoordsToDisplayCoords(j, i);

            let points = [
                new PIXI.Point(coords.x, coords.y),
                new PIXI.Point(coords.x + cellUnit.x * RightVector.x, coords.y + cellUnit.x * RightVector.y),
                new PIXI.Point(coords.x + cellUnit.x * RightVector.x + cellUnit.y * DownVector.x, coords.y + cellUnit.x * RightVector.y + cellUnit.y * DownVector.y),
                new PIXI.Point(coords.x + cellUnit.y * DownVector.x, coords.y + cellUnit.y * DownVector.y)
            ];
            let cellDisplay = new PIXI.Polygon(points);

            if (cell === path[0] || cell === path[path.length - 1]) {
                this._graphics.lineStyle(1, 0x0FF000, 1);
            } else {

                // Draw the border of the cell
                this._graphics.lineStyle(1, 0x000000, 1);
            }
            if (cell === path[0] || cell === path[path.length - 1]) {
                this._graphics.beginFill(0xF0FF00);
            } else {
                this._graphics.beginFill(0xFFFFFF);

            }
            this._graphics.drawPolygon(cellDisplay);
            this._graphics.endFill();

            // Display a dot in the center of the cell
            let dot = GridCellCenterForDisplay(j, i);
            if (cell === path[0] || cell === path[path.length - 1]) {
                this._graphics.beginFill(0xF0FF00);
            }
            this._graphics.beginFill(0x0000FF);
            this._graphics.drawCircle(dot.x, dot.y, 3);
            this._graphics.endFill();

            this._graphics.zIndex = 3;
            app.stage.addChild(this._graphics);
        }
    }
}

export default Graph;