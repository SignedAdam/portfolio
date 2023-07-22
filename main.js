// go through canvas vast
warpBehind = false;


let particlesArray;


let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.getElementById('background').appendChild(canvas);

let canvasDiv = document.getElementById('canvas');
// define your resume canvas dimensions and position
const resumeCanvas = {
    x: canvasDiv.offsetLeft, // replace with actual x position
    y: canvasDiv.offsetTop, // replace with actual y position
    width: canvasDiv.offsetWidth, // replace with actual width
    height: canvasDiv.offsetHeight // replace with actual height
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.originalSpeedX = this.speedX;
        this.originalSpeedY = this.speedY;
        this.behindCanvas = false;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (!warpBehind || !this.behindCanvas) {
            if (this.size > 0.2) {
                this.size -= 0.05;
            }
        }

        if(this.behindCanvas && warpBehind){
            this.speedX = this.originalSpeedX * 50;
            this.speedY = this.originalSpeedY * 50;
        } else {
            this.speedX = this.originalSpeedX;
            this.speedY = this.originalSpeedY;
        }
    }
    draw() {
        ctx.fillStyle = 'rgba(173, 216, 230, 1)'; // LightBlue color for the particles, change it as you need
        ctx.strokeStyle = 'rgba(173, 216, 230, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        const particle = particlesArray[i];

        // check if the particle is behind the resume canvas
        particle.behindCanvas = 
            particle.x > resumeCanvas.x && 
            particle.x < resumeCanvas.x + resumeCanvas.width &&
            particle.y > resumeCanvas.y && 
            particle.y < resumeCanvas.y + resumeCanvas.height;

        particle.update();
        particle.draw();

        if (particle.size <= 0.2) {
            particlesArray.splice(i, 1);
            let position = getRandomPosition();
            particlesArray.push(new Particle(position.x, position.y));
        }
    }
    requestAnimationFrame(animate);
}

function newSpawnCoords() {
    // coords must be outside of the resume canvas
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    if (x > resumeCanvas.x && x < resumeCanvas.x + resumeCanvas.width) {
        x = Math.random() * canvas.width;
    }
    if (y > resumeCanvas.y && y < resumeCanvas.y + resumeCanvas.height) {
        y = Math.random() * canvas.height;
    }
    return { x, y };
}

function getRandomPosition() {
    // Define the four rectangles as {x, y, width, height}
    const areas = [
        // top rectangle
        {x: 0, y: 0, width: canvas.width, height: resumeCanvas.y},

        // bottom rectangle
        {x: 0, y: resumeCanvas.y + resumeCanvas.height, width: canvas.width, height: canvas.height - (resumeCanvas.y + resumeCanvas.height)},

        // left rectangle
        {x: 0, y: resumeCanvas.y, width: resumeCanvas.x, height: resumeCanvas.height},

        // right rectangle
        {x: resumeCanvas.x + resumeCanvas.width, y: resumeCanvas.y, width: canvas.width - (resumeCanvas.x + resumeCanvas.width), height: resumeCanvas.height}
    ];

    // Choose a random area
    const area = areas[Math.floor(Math.random() * areas.length)];

    // Generate a random position within this area
    const x = area.x + Math.random() * area.width;
    const y = area.y + Math.random() * area.height;

    return {x, y};
}

init();
animate();