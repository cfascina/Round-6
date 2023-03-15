// Script Constants
const canvasWidth = 1280;
const canvasHeight = 720;
const gameStatus = document.querySelector('.game-status');

// THREE Constants
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, .1, 1000);
const renderer = new THREE.WebGLRenderer();
const light = new THREE.AmbientLight(0xffffff);

// THREE Definitions
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
            gameStatus.innerText = 'Time out! You died.';
        }, timeLimit * 1000);
    }
    start() {
        isGameOn = true;
        this.setTimer();
    }
    check() {
        if(!isGameOn) {
            clearTimeout(this.timer);
            timer.pause();
        }
    }
    async countDown() {
        gameStatus.innerText = 'Starting in 3...';
        await setDelay(1000);
        gameStatus.innerText = 'Starting in 2...';
        await setDelay(1000);
        gameStatus.innerText = 'Starting in 1...';
        await setDelay(1000);
    
        this.start();
        timer.start(); 
        doll.start();
        player.reset();
        gameStatus.innerText = 'Go!';
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
        isDollFacingForward = false;
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

class Player {
    constructor() {
        let loader = new THREE.TextureLoader();
        let material = new THREE.MeshLambertMaterial({map: loader.load('../images/player.png'), transparent: true});
        let geometry = new THREE.PlaneGeometry(1, 1);
        let player = new THREE.Mesh(geometry, material);  
        
        this.player = player;
        this.positionStart = -4.5;
        this.positionEnd = this.positionStart * -1;
        this.velocity = 0;
        this.positionCurrent;

        this.reset();
        scene.add(player);
    }
    move() {
        this.velocity = .005;
    }
    stop() {
        this.velocity = 0;
    }
    reset() {
        this.player.position.set(this.positionStart, -2, 1);
        this.positionCurrent = this.positionStart;
    }
    update() {
        if(!isGameOn)
            return;
        
        if(this.velocity > 0 && isDollFacingForward) {
            isGameOn = false;
            this.stop();
            gameStatus.innerText = 'I got you! You died.';
        }
        if(this.positionCurrent >= this.positionEnd) {
            isGameOn = false;
            this.stop();
            gameStatus.innerText = 'You are safe (for now).';
        }
    }
    check() {
        this.update();
        this.positionCurrent += this.velocity;
        this.player.position.x = this.positionCurrent;
    }
}

class Timer {
    constructor() {
        let timerEl = document.querySelector('.timer');
        this.timer = new TimelineMax()
       
        this.timer.to(timerEl, timeLimit, {width: 0, ease: 'none'});
        this.timer.pause();
    }
    start() {
        this.timer.restart();
        this.timer.play();
    }
    pause() {
        this.timer.pause();
    }
    reset() {
        this.timer.restart();
        this.pause();
    }
}

// Game Variables
let timeLimit = 30;
let isGameOn = false;
let isDollFacingForward = true;

let game = new Game();
let timer = new Timer();
let doll = new Doll();
let player = new Player();

// Game Controls
window.addEventListener('keydown', (e) => {
    if(e.code == 'Space' && !isGameOn) {
        timer.reset();
        player.reset();
        game.countDown();
    }
    if(e.code == 'ArrowRight' && isGameOn)
        player.move();
});
window.addEventListener('keyup', (e) => {
    if(e.code == 'ArrowRight' && isGameOn)
        player.stop();
});

// Renders Scene Repeatedly
function animate(){
    renderer.render(scene, camera);
    game.check();
    player.check();
    requestAnimationFrame(animate);
}

animate();
