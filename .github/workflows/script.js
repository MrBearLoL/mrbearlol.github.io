// script.js – 3D Minecraft skin viewer with fight animation
document.addEventListener('DOMContentLoaded', () => {
    const skinContainer = document.getElementById('skin_container');
    const rotateBtn = document.getElementById('rotate_btn');
    const walkBtn = document.getElementById('walk_btn');
    const fightBtn = document.getElementById('fight_btn');

    // Initialise the SkinViewer
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

    // Smooth rotation (damping)
    skinViewer.controls.enableDamping = true;
    skinViewer.controls.dampingFactor = 0.01;
    skinViewer.controls.rotateSpeed = 0.8;

    // Animation loop for damping
    const animate = () => {
        skinViewer.controls.update();
        requestAnimationFrame(animate);
    };
    animate();

    // Auto-rotate
    skinViewer.autoRotate = true;
    skinViewer.autoRotateSpeed = 0.5;
    rotateBtn.classList.add('active');

    // Window resize
    window.addEventListener('resize', () => {
        skinViewer.width = skinContainer.parentElement.clientWidth;
        skinViewer.height = skinContainer.parentElement.clientHeight;
    });

    // Rotate button
    rotateBtn.addEventListener('click', () => {
        skinViewer.autoRotate = !skinViewer.autoRotate;
        rotateBtn.classList.toggle('active', skinViewer.autoRotate);
    });

    // Walk animation
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

    // Fight animation
    let isFighting = false;
    let fightAnimationId = null;

    fightBtn.addEventListener('click', () => {
        isFighting = !isFighting;

        if (isFighting) {
            walkBtn.classList.remove('active');
            skinViewer.animation = null;

            let time = 0;
            const swingSpeed = 0.08;
            const randomOffset = Math.random() * Math.PI * 2;

            const animateFight = () => {
                if (!isFighting) return;

                time += swingSpeed;
                const variation = Math.sin(randomOffset + time * 0.3) * 0.3;
                const player = skinViewer.playerObject;

                if (player && player.skin) {
                    player.skin.rightArm.rotation.x = Math.sin(time) * 2.5 + variation;
                    player.skin.rightArm.rotation.z = Math.cos(time * 0.5) * 0.3;
                    player.skin.leftArm.rotation.x = -Math.sin(time * 0.8) * 0.8;
                    player.skin.leftArm.rotation.z = Math.sin(time * 0.4) * 0.2;
                    player.skin.body.rotation.y = Math.sin(time * 0.5) * 0.15;
                    player.skin.head.rotation.x = Math.sin(time * 0.6) * 0.1;
                    player.skin.head.rotation.y = Math.cos(time * 0.4) * 0.2;
                    player.skin.rightLeg.rotation.x = Math.sin(time * 0.7) * 0.3;
                    player.skin.leftLeg.rotation.x = -Math.sin(time * 0.7) * 0.3;
                }

                fightAnimationId = requestAnimationFrame(animateFight);
            };

            animateFight();
            fightBtn.classList.add('active');
        } else {
            if (fightAnimationId) {
                cancelAnimationFrame(fightAnimationId);
                fightAnimationId = null;
            }

            const player = skinViewer.playerObject;
            if (player && player.skin) {
                player.skin.rightArm.rotation.x = 0;
                player.skin.rightArm.rotation.z = 0;
                player.skin.leftArm.rotation.x = 0;
                player.skin.leftArm.rotation.z = 0;
                player.skin.body.rotation.y = 0;
                player.skin.head.rotation.x = 0;
                player.skin.head.rotation.y = 0;
                player.skin.rightLeg.rotation.x = 0;
                player.skin.leftLeg.rotation.x = 0;
            }

            fightBtn.classList.remove('active');
        }
    });
});
