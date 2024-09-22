// script.js
const canvas = document.getElementById("halftoneCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// Set canvas size to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var spacing = 5;

function lightenColor(r, g, b, alpha) {
    const newR = Math.round((1 - alpha) * r + alpha * 255);
    const newG = Math.round((1 - alpha) * g + alpha * 255);
    const newB = Math.round((1 - alpha) * b + alpha * 255);

    return [newR, newG, newB];
}

function shiftColor(r, g, b, dr, dg, db) {
    const newR = Math.min(Math.max(r + dr, 0), 255);
    const newG = Math.min(Math.max(g + dg, 0), 255);
    const newB = Math.min(Math.max(b + db, 0), 255);

    return [newR, newG, newB];
}

function drawPlus(x, y, r, g, b) {
    // draw center pixel
    const [rCenter, gCenter, bCenter] = shiftColor(r, g, b, 0, 30, 0);
    ctx.fillStyle = `rgb(${rCenter}, ${gCenter}, ${bCenter})`;
    ctx.fillRect(x, y, 1, 1);

    // Lighten the color for the surrounding pixels (set factor to 0.5 to make it half as bright)
    const [rLight, gLight, bLight] = lightenColor(r, g, b, 0.1);

    // Draw top, bottom, left, right with lighter color
    ctx.fillStyle = `rgb(${rLight}, ${gLight}, ${bLight})`;

    // Top
    ctx.fillRect(x, y - 1, 1, 1);
    // Bottom
    ctx.fillRect(x, y + 1, 1, 1);
    // Left
    ctx.fillRect(x - 1, y, 1, 1);
    // Right
    ctx.fillRect(x + 1, y, 1, 1);
}

// Draw halftone effect
function drawHalftoneEffect() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through the pixels of the image
    for (let y = 0; y < canvas.height; y += spacing) {
        for (let x = 0; x < canvas.width; x += spacing) {
            const i = (y * canvas.width + x) * 4;

            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            drawPlus(x, y, r, g, b);
        }
    }
}

function captureWebpage() {
    html2canvas(document.body).then((webpageCanvas) => {
        ctx.drawImage(webpageCanvas, 0, 0, canvas.width, canvas.height);

        drawHalftoneEffect();
    });
}

window.addEventListener("DOMContentLoaded", () => {
    captureWebpage();
});
