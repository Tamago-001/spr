import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

import { Player } from "./js/player.js";
import { createMap } from "./js/maps.js";

// ======================================
// UI
// ======================================

const titleScreen =
document.getElementById("titleScreen");

const hud =
document.getElementById("hud");

const playBtn =
document.getElementById("playBtn");

const settingBtn =
document.getElementById("settingBtn");

const fpsCounter =
document.getElementById("fpsCounter");

// ======================================
// State
// ======================================

let gameStarted = false;

// ======================================
// Scene
// ======================================

const scene =
new THREE.Scene();

scene.background =
new THREE.Color(
    0x87ceeb
);

// ======================================
// Camera
// ======================================

const camera =
new THREE.PerspectiveCamera(

    75,

    window.innerWidth /
    window.innerHeight,

    0.1,

    1000

);

// ======================================
// Renderer
// ======================================

const renderer =
new THREE.WebGLRenderer({

    canvas:
    document.getElementById("game"),

    antialias:true

});

renderer.setSize(

    window.innerWidth,

    window.innerHeight

);

renderer.setPixelRatio(
    window.devicePixelRatio
);

renderer.shadowMap.enabled =
true;

// ======================================
// Light
// ======================================

const sun =
new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(
    20,
    40,
    20
);

sun.castShadow = true;

scene.add(
    sun
);

scene.add(

    new THREE.AmbientLight(
        0xffffff,
        1
    )

);

// ======================================
// Map
// ======================================

createMap(
    scene
);

// ======================================
// Player
// ======================================

const player =
new Player(
    scene,
    camera
);

// ======================================
// Initial UI
// ======================================

titleScreen.style.display =
"flex";

hud.style.display =
"none";

// ======================================
// PLAY Button
// ======================================

playBtn.addEventListener(
    "click",
    ()=>{

        try{

            gameStarted =
            true;

            titleScreen.style.display =
            "none";

            hud.style.display =
            "block";

            document.body
            .requestPointerLock();

        }
        catch(error){

            console.error(
                error
            );

        }

    }
);

// ======================================
// SETTINGS
// ======================================

settingBtn.addEventListener(
    "click",
    ()=>{

        alert(
            "設定画面は今後実装予定です"
        );

    }
);

// ======================================
// Resize
// ======================================

window.addEventListener(
    "resize",
    ()=>{

        camera.aspect =

        window.innerWidth /

        window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }
);

// ======================================
// FPS
// ======================================

let frameCount = 0;
let fpsTime = 0;

// ======================================
// Clock
// ======================================

const clock =
new THREE.Clock();

// ======================================
// Loop
// ======================================

function animate(){

    requestAnimationFrame(
        animate
    );

    const delta =
    clock.getDelta();

    frameCount++;

    fpsTime += delta;

    if(
        fpsTime >= 1
    ){

        fpsCounter.textContent =

        frameCount +

        " FPS";

        frameCount = 0;

        fpsTime = 0;

    }

    if(
        gameStarted
    ){

        player.update(
            delta
        );

    }

    renderer.render(
        scene,
        camera
    );

}

animate();