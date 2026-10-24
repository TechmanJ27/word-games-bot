const { createCanvas } = require('canvas');
const createjs = require('createjs-canvas');
export default class Board {
    constructor() {
        return ({});
    }
}
export function createBoardImage() {
    try {
        const boardSize = 400;
        const rows = 15;
        const cols = 15;
        const tileSize = boardSize / rows;
        const nodeCanvas = createCanvas(boardSize, boardSize);
        const stage = new createjs.Stage(nodeCanvas);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const square = new createjs.Shape();
                square.graphics
                    .beginFill('#fae2b1')
                    .drawRect(c * tileSize, r * tileSize, tileSize, tileSize)
                    .beginStroke('#291b00')
                    .strokeRect(c * tileSize, r * tileSize, tileSize, tileSize);
                stage.addChild(square);
            }
        }
        stage.update();
        return nodeCanvas.toBuffer('image/png');
    }
    catch (error) {
        console.error('Error generating image:', error);
    }
}
//# sourceMappingURL=boardClass.js.map