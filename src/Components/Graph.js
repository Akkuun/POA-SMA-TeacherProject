
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
    constructor(grid) {
        this.grid = grid;
        this.ncols = grid.length;
        this.nrows = grid[0].length;
        this.nodes = this.createGraphFromGrid();
    }

    createGraphFromGrid() {
        const nodes = {};

        // Create nodes for all valid grid positions
        for (let i = 0; i < this.ncols; i++) {
            for (let j = 0; j < this.nrows; j++) {
                if (this.grid[i][j] !== 2 && this.grid[i][j] !== "student") {
                    nodes[`${i},${j}`] = new Node(i, j);
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
            console.log(
                `Node ${key} -> Neighbors:`,
                this.nodes[key].neighbors.map(neighbor => `${neighbor.x},${neighbor.y}`)
            );
        }
    }
    displayCells(app) {
        for (let key in this.nodes){
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

    A_star(start, destination) {
        const startNode = this.nodes[`${start.x},${start.y}`];
        const destinationNode = this.nodes[`${destination.x},${destination.y}`];
        if (!startNode || !destinationNode) {
            console.error("Start or destination node is invalid.");
            console.log("Start Node:", startNode);
            console.log("Destination Node:", destinationNode);
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

        console.error("No path found.");
        return [];
    }

    drawPath(path, app) {
        for (let cell of path) {
            console.log(cell);
            let i = cell.x;
            let j = cell.y;

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
}

export default Graph;