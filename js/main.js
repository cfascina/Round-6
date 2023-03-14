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

// Helper Functions
async function setDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Classes
class Game {
    constructor() {
        this.timer;
    }
    setTimer() {
        this.timer = setTimeout(function() {
            isGameOn = false;
            console.log('Time out!');
        }, timeLimit * 1000);
    }
    start() {
        console.log('game started');
        isGameOn = true;
        this.setTimer();
    }
    check() {
        if(!isGameOn)
            clearTimeout(this.timer);
    }
}

class Doll {
    constructor() {
        let loader = new THREE.GLTFLoader();
        
        loader.load('../doll/scene.gltf', (gltf) => {
            gltf.scene.scale.set(.35, .35, .35 );
            gltf.scene.position.set(0, -.75, 0);
            this.doll = gltf.scene;
            
            scene.add(gltf.scene);
        });
    }
    faceBackward() {
        gsap.to(this.doll.rotation, {duration: .5, y: -3.15});
        setTimeout(() => isDollFacingForward = false, 500);
    }
    faceForward() {
        gsap.to(this.doll.rotation, {duration: .5, y: 0});
        setTimeout(() => isDollFacingForward = true, 500);
    }
    async start() {
        let rotationDelay = Math.random() * 1000 + 1500;
        
        if(isGameOn) {
            this.faceBackward();
            await setDelay(rotationDelay);
        }
        if(isGameOn) {
            this.faceForward();
            await setDelay(rotationDelay);
        }
        if(isGameOn) {
            this.start();
        }
    }
}

// Game Variables
let timeLimit = 15;
let isGameOn = false;
let isDollFacingForward = true;

let game = new Game();
let doll = new Doll();

// Game Controls
window.addEventListener('keydown', (e) => {
    if(e.code == 'Space' && !isGameOn) {
        game.start();
        doll.faceBackward(); 
        doll.start();   
    }
    if(e.key == 'ArrowRight') {
        console.log('player died.');
        isGameOn = false;
    }
});

// Renders Scene Repeatedly
function animate(){
    renderer.render(scene, camera);
    game.check();
    requestAnimationFrame(animate);
}

animate();
