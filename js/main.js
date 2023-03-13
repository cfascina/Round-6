// Script Constants
const canvasWidth = 1280;
const canvasHeight = 720;

// THREE Constants
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, .1, 1000);
const renderer = new THREE.WebGLRenderer();
const light = new THREE.AmbientLight(0xffffff);

// Initial Definitions
camera.position.z = 5;
scene.add(light);
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(0xb7c3d2, 1);

document.body.appendChild(renderer.domElement);

// Classes
class Game {
    constructor() {
        this.timer;
    }
    setTimer() {
        console.log('starting timer...');
        this.timer = setTimeout(function() {
            console.log('Time out!');
            isGameOn = false;
        }, timeLimit * 1000);
    }
    start() {
        console.log('game started');
        isGameOn = true;
        this.setTimer();
    }
    check() {
        if(!isGameOn) {
            clearTimeout(this.timer);
        }
    }
}

// Game Variables
let isGameOn = false;
let timeLimit = 5;

let game = new Game();

// Game Controls
window.addEventListener('keydown', (e) => {
    if(e.code == 'Space' && !isGameOn)
        game.start();

    if(e.key == 'ArrowRight') {
        console.log('player died.');
        isGameOn = false;
    }
});

// Render the scene repeatedly
function animate(){
    renderer.render(scene, camera);
    game.check();
    requestAnimationFrame(animate);
}

animate();
