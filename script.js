// script.js – 3D Minecraft skin viewer
// This file assumes the project is served via a local HTTP server (e.g., `python -m http.server 8000`).
// The skin image `medveskinSUMMER.png` lives in the project root, so it can be loaded with a relative URL.

document.addEventListener('DOMContentLoaded', () => {
    const skinContainer = document.getElementById('skin_container');
    const rotateBtn = document.getElementById('rotate_btn');
    const walkBtn = document.getElementById('walk_btn');

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
        } else {
            skinViewer.animation = null;
            walkBtn.classList.remove('active');
        }
    });
});
