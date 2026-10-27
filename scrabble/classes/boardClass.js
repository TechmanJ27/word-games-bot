import { createCanvas, loadImage } from 'canvas';
export default class Board {
    imageURL;
    constructor() {
        this.imageURL = createBoardImage();
    }
}
export function createBoardImage() {
    try {
        const boardSize = 450;
        const rows = 15;
        const cols = 15;
        const tileSize = boardSize / rows;
        const nodeCanvas = createCanvas(boardSize, boardSize);
        const ctx = nodeCanvas.getContext('2d');
        ctx.fillStyle = '#fae2b1';
        ctx.fillRect(0, 0, boardSize, boardSize);
        ctx.strokeStyle = '#291b00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
            ctx.moveTo(0, r * tileSize);
            ctx.lineTo(boardSize, r * tileSize);
        }
        for (let c = 0; c <= cols; c++) {
            ctx.moveTo(c * tileSize, 0);
            ctx.lineTo(c * tileSize, boardSize);
        }
        ctx.stroke();
        return nodeCanvas.toDataURL();
    }
    catch (error) {
        console.error('Error generating image:', error);
        return undefined;
    }
}
export async function updateBoard(board, word, x, y, isHorizontal = true) {
    if (!board.imageURL) {
        console.error("Cannot update board: imageURL is undefined");
        return undefined;
    }
    const img = await loadImage(board.imageURL);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const boardSize = 450;
    const rows = 15;
    const tileSize = boardSize / rows;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < word.length; i++) {
        const currentX = isHorizontal ? x + i : x;
        const currentY = isHorizontal ? y : y + i;
        const pixelX = currentX * tileSize + tileSize / 2;
        const pixelY = currentY * tileSize + tileSize / 2;
        ctx.fillText(word[i].toUpperCase(), pixelX, pixelY);
    }
    return canvas.toDataURL();
}
//# sourceMappingURL=boardClass.js.map