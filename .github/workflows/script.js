// script.js – 3D Minecraft skin viewer with fight animation
document.addEventListener('DOMContentLoaded', () => {
    const skinContainer = document.getElementById('skin_container');
    const rotateBtn = document.getElementById('rotate_btn');
    const walkBtn = document.getElementById('walk_btn');
    const fightBtn = document.getElementById('fight_btn');

    // ---------------------------------------------------------------------
    // Initialise the SkinViewer
    // ---------------------------------------------------------------------
    const skinViewer = new skinview3d.SkinViewer({
        canvas: skinContainer,
        width: 400,
        height: 400,
        skin: "medveskinSUMMER.png"
    });

    // Adjust size to the container (responsive)
    skinViewer.width = skinContainer.parentElement.clientWidth;
    skinViewer.height = skinContainer.parentElement.clientHeight;
    skinViewer.fov = 70;
    skinViewer.zoom = 0.9;

    // Fix WebGL warning (shadow bias)
    if (skinViewer.globalLight && skinViewer.globalLight.shadow) {
        skinViewer.globalLight.shadow.bias = -0.001;
    }
    if (skinViewer.cameraLight && skinViewer.cameraLight.shadow) {
        skinViewer.cameraLight.shadow.bias = -0.001;
    }

    // ---------------------------------------------------------------------
    // Interaction – smooth rotation (damping)
    // ---------------------------------------------------------------------
    skinViewer.controls.enableDamping = true;
    skinViewer.controls.dampingFactor = 0.01; // long spin after release
    skinViewer.controls.rotateSpeed = 0.8;   // slower initial acceleration

    // ---------------------------------------------------------------------
    // Animation loop – required for damping to work
    // ---------------------------------------------------------------------
    if (skinViewer.animations) {
        skinViewer.animations.add({
            update: () => {
                skinViewer.controls.update();
            }
        });
    } else {
        const animate = () => {
            skinViewer.controls.update();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ---------------------------------------------------------------------
    // Auto‑rotate (default) and UI button handling
    // ---------------------------------------------------------------------
    skinViewer.autoRotate = true;
    skinViewer.autoRotateSpeed = 0.5;
    rotateBtn.classList.add('active');

    window.addEventListener('resize', () => {
        skinViewer.width = skinContainer.parentElement.clientWidth;
        skinViewer.height = skinContainer.parentElement.clientHeight;
    });

    rotateBtn.addEventListener('click', () => {
        skinViewer.autoRotate = !skinViewer.autoRotate;
        rotateBtn.classList.toggle('active', skinViewer.autoRotate);
    });

    // ---------------------------------------------------------------------
    // Walk animation toggle
    // ---------------------------------------------------------------------
    let isWalking = false;
    walkBtn.addEventListener('click', () => {
        isWalking = !isWalking;
        if (isWalking) {
            skinViewer.animation = new skinview3d.WalkingAnimation();
            walkBtn.classList.add('active');
            fightBtn.classList.remove('active');
        } else {
            skinViewer.animation = null;
            walkBtn.classList.remove('active');
        }
    });

    // ---------------------------------------------------------------------
    // Fight animation toggle
    // ---------------------------------------------------------------------
    let isFighting = false;
    let fightAnimationHandle = null;

    fightBtn.addEventListener('click', () => {
        isFighting = !isFighting;

        if (isFighting) {
            // Create fight animation state
            let time = 0;
            const swingSpeed = 8;
            const randomOffset = Math.random() * Math.PI * 2;

            // Add custom animation using skinview3d's animation system
            fightAnimationHandle = skinViewer.animations.add({
                update: (player, deltaTime) => {
                    time += deltaTime * swingSpeed;

                    // Random variation in swing pattern
                    const variation = Math.sin(randomOffset + time * 0.3) * 0.3;

                    // Right arm swinging (attacking motion)
                    player.skin.rightArm.rotation.x = Math.sin(time) * 2.5 + variation;
                    player.skin.rightArm.rotation.z = Math.cos(time * 0.5) * 0.3;

                    // Left arm counter-movement
                    player.skin.leftArm.rotation.x = -Math.sin(time * 0.8) * 0.8;
                    player.skin.leftArm.rotation.z = Math.sin(time * 0.4) * 0.2;

                    // Body rotation for more dynamic movement
                    player.skin.body.rotation.y = Math.sin(time * 0.5) * 0.15;

                    // Slight head movement
                    player.skin.head.rotation.x = Math.sin(time * 0.6) * 0.1;
                    player.skin.head.rotation.y = Math.cos(time * 0.4) * 0.2;

                    // Legs for stability
                    player.skin.rightLeg.rotation.x = Math.sin(time * 0.7) * 0.3;
                    player.skin.leftLeg.rotation.x = -Math.sin(time * 0.7) * 0.3;
                }
            });

            fightBtn.classList.add('active');
            walkBtn.classList.remove('active');
        } else {
            // Remove fight animation
            if (fightAnimationHandle) {
                skinViewer.animations.remove(fightAnimationHandle);
                fightAnimationHandle = null;
            }
            fightBtn.classList.remove('active');
        }
    });
});
