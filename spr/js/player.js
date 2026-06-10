// ============================================
// player.js
// プレイヤー管理クラス
// ============================================

import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class Player {

    constructor(scene,camera){

        this.scene = scene;
        this.camera = camera;

        // ==========================
        // プレイヤーモデル
        // ==========================

        const bodyGeometry =
        new THREE.CapsuleGeometry(
            0.5,
            1.0,
            4,
            8
        );

        const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color:0xff7b00
        });

        this.mesh =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

        this.mesh.position.set(
            0,
            2,
            0
        );

        this.mesh.castShadow = true;

        scene.add(
            this.mesh
        );

        // ==========================
        // 移動
        // ==========================

        this.moveSpeed = 8;
        this.dashSpeed = 14;

        this.jumpPower = 12;

        this.velocity =
        new THREE.Vector3();

        this.direction =
        new THREE.Vector3();

        this.isGrounded = false;

        this.gravity = 25;

        // ==========================
        // カメラ
        // ==========================

        this.cameraDistance = 6;
        this.cameraHeight = 2.5;

        this.yaw = 0;
        this.pitch = -0.3;

        this.mouseSensitivity = 0.002;

        // ==========================
        // 入力
        // ==========================

        this.keys = {};

        window.addEventListener(
            "keydown",
            (e)=>{
                this.keys[e.code]=true;
            }
        );

        window.addEventListener(
            "keyup",
            (e)=>{
                this.keys[e.code]=false;
            }
        );

        // ==========================
        // マウスロック
        // ==========================

        document.body.addEventListener(
            "click",
            ()=>{
                document.body.requestPointerLock();
            }
        );

        document.addEventListener(
            "mousemove",
            (e)=>{

                if(
                    document.pointerLockElement
                    !== document.body
                ){
                    return;
                }

                this.yaw -=
                e.movementX *
                this.mouseSensitivity;

                this.pitch -=
                e.movementY *
                this.mouseSensitivity;

                this.pitch =
                Math.max(
                    -1.3,
                    Math.min(
                        1.3,
                        this.pitch
                    )
                );

            }
        );

    }

    // ====================================
    // Update
    // ====================================

    update(delta){

        this.handleMovement(delta);

        this.applyGravity(delta);

        this.updateCamera();

    }

    // ====================================
    // 移動
    // ====================================

    handleMovement(delta){

        this.direction.set(
            0,
            0,
            0
        );

        if(this.keys["KeyW"])
            this.direction.z -= 1;

        if(this.keys["KeyS"])
            this.direction.z += 1;

        if(this.keys["KeyA"])
            this.direction.x -= 1;

        if(this.keys["KeyD"])
            this.direction.x += 1;

        if(
            this.direction.length() > 0
        ){
            this.direction.normalize();
        }

        const speed =
        this.keys["ShiftLeft"]
        ?
        this.dashSpeed
        :
        this.moveSpeed;

        const forward =
        new THREE.Vector3(
            Math.sin(this.yaw),
            0,
            Math.cos(this.yaw)
        );

        const right =
        new THREE.Vector3(
            forward.z,
            0,
            -forward.x
        );

        const move =
        new THREE.Vector3();

        move.add(
            forward.clone().multiplyScalar(
                -this.direction.z
            )
        );

        move.add(
            right.clone().multiplyScalar(
                this.direction.x
            )
        );

        move.normalize();

        this.mesh.position.add(
            move.multiplyScalar(
                speed * delta
            )
        );

        // ===================
        // 向き
        // ===================

        if(
            this.direction.length() > 0
        ){

            this.mesh.rotation.y =
            Math.atan2(
                move.x,
                move.z
            );

        }

        // ===================
        // ジャンプ
        // ===================

        if(
            this.keys["Space"]
            &&
            this.isGrounded
        ){

            this.velocity.y =
            this.jumpPower;

            this.isGrounded =
            false;

        }

    }

    // ====================================
    // 重力
    // ====================================

    applyGravity(delta){

        this.velocity.y -=
        this.gravity *
        delta;

        this.mesh.position.y +=
        this.velocity.y *
        delta;

        // 地面

        if(
            this.mesh.position.y
            < 1
        ){

            this.mesh.position.y = 1;

            this.velocity.y = 0;

            this.isGrounded =
            true;

        }

    }

    // ====================================
    // カメラ
    // ====================================

    updateCamera(){

        const target =
        this.mesh.position.clone();

        target.y +=
        this.cameraHeight;

        const offset =
        new THREE.Vector3();

        offset.x =
        Math.sin(this.yaw)
        *
        Math.cos(this.pitch)
        *
        this.cameraDistance;

        offset.z =
        Math.cos(this.yaw)
        *
        Math.cos(this.pitch)
        *
        this.cameraDistance;

        offset.y =
        Math.sin(this.pitch)
        *
        this.cameraDistance;

        this.camera.position.copy(
            target.clone().add(
                offset
            )
        );

        this.camera.lookAt(
            target
        );

    }

}