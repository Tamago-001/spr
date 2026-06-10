import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export function createMap(scene){

    const ground =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            100,
            100
        ),

        new THREE.MeshStandardMaterial({
            color:0x888888
        })

    );

    ground.rotation.x =
    -Math.PI / 2;

    ground.receiveShadow = true;

    scene.add(
        ground
    );

    for(let i=0;i<20;i++){

        const building =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                4,
                4,
                4
            ),

            new THREE.MeshStandardMaterial({
                color:0x666666
            })

        );

        building.position.set(

            (Math.random()-0.5)*80,

            2,

            (Math.random()-0.5)*80

        );

        building.castShadow = true;
        building.receiveShadow = true;

        scene.add(
            building
        );

    }

}