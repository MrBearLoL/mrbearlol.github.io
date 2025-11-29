// script.js – 3D Minecraft skin viewer
document.addEventListener('DOMContentLoaded', () => {
    // YouTube videó betöltése
    // FONTOS: Cseréld ki a 'VIDEO_ID_HERE' részt a legújabb Bear videó ID-jére!
    // Példa: ha a videó URL-je https://www.youtube.com/watch?v=dQw4w9WgXcQ
    // akkor a VIDEO_ID = 'dQw4w9WgXcQ'
    const latestVideoId = 'uhAa_tPvx0A'; // <-- ITT ÁLLÍTSD BE A VIDEÓ ID-T!
    const youtubePlayer = document.getElementById('youtube-player');
    if (youtubePlayer && latestVideoId !== 'VIDEO_ID_HERE') {
        const origin = window.location.origin;
        youtubePlayer.src = `https://www.youtube.com/embed/${latestVideoId}?enablejsapi=1&origin=${origin}&rel=0`;
    }

    const skinContainer = document.getElementById('skin_container');
    const rotateBtn = document.getElementById('rotate_btn');
    const walkBtn = document.getElementById('walk_btn');
    const nextSkinBtn = document.getElementById('next_skin_btn');
    const resetSkinBtn = document.getElementById('reset_skin_btn');

    // Lista az összes skinnel
    const skins = [
        'src/skinek/medveSKINUriember.png',
        'src/skinek/medveskinARMORED.png',
        'src/skinek/medveskinCJ.png',
        'src/skinek/medveskinKAKTUSZ.png',
        'src/skinek/medveskinSUMMER.png',
        'src/skinek/medveskinSUMMER_WalterWhite_Oltonyos.png',
        'src/skinek/medveskinSUMMERcigizik.png',
        'src/skinek/medveskinSUMMERdrunk.png',
        'src/skinek/medveskinSUMMERhighasfuck.png',
        'src/skinek/medveskinSUMMERnagyszemu.png',
        'src/skinek/medveskinSUMMERnagyszemu2.png',
        'src/skinek/medveskinSUMMERszemesbenő.png',
        'src/skinek/medveskinhavas.png'
    ];

    let currentSkinIndex = 4; // medveskinSUMMER.png az 5. a listában (index 4)
    const originalSkin = 'src/skinek/medveskinSUMMER.png';

    // Initialise the SkinViewer
    const skinViewer = new skinview3d.SkinViewer({
        canvas: skinContainer,
        width: 400,
        height: 400,
        skin: "src/skinek/medveskinSUMMER.png"
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

    // Remove ALL rotation limits for full 360° rotation
    skinViewer.controls.minPolarAngle = 0;
    skinViewer.controls.maxPolarAngle = Math.PI;  // This is the maximum Three.js allows by default

    // Try to enable more rotation by removing azimuth limits too
    skinViewer.controls.minAzimuthAngle = -Infinity;
    skinViewer.controls.maxAzimuthAngle = Infinity;

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
        } else {
            skinViewer.animation = null;
            walkBtn.classList.remove('active');
        }
    });

    // Tooltip kezelés
    const tooltip = document.getElementById('custom-tooltip');
    const tooltipLine1 = document.getElementById('tooltip-line1');
    const tooltipLine2 = document.getElementById('tooltip-line2');

    const buttons = [
        {
            id: 'youtube-btn',
            line1: 'Fő csatornám',
            line2: 'leginkább Minecraft'
        },
        {
            id: 'instagram-btn',
            line1: 'Itt néha aktív néha inaktív vagyok',
            line2: ''
        },
        {
            id: 'bear-discord-btn',
            line1: 'Ide kirakok néha infókat,',
            line2: 'és néha eventeket is'
        },
        {
            id: 'community-discord-btn',
            line1: 'Itt tudtok chatelni,',
            line2: 'haverokkal közös szerver'
        },
        {
            id: 'kabbe-btn',
            line1: 'Facecam-es, reakciós, commentary',
            line2: 'videók, Kattossal'
        },
        {
            id: 'spirit-gang-btn',
            line1: 'Legkomolyabb haveri körünk',
            line2: 'mindenféle közös videója'
        }
    ];

    if (tooltip && tooltipLine1 && tooltipLine2) {
        buttons.forEach(btnData => {
            const btn = document.getElementById(btnData.id);
            if (btn) {
                btn.addEventListener('mouseenter', () => {
                    tooltipLine1.textContent = btnData.line1;
                    tooltipLine2.textContent = btnData.line2;
                    tooltipLine2.style.display = btnData.line2 ? 'block' : 'none';
                    tooltip.style.opacity = '1';
                });

                btn.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                });

                btn.addEventListener('mousemove', (e) => {
                    tooltip.style.transform = `translate(${e.clientX + 15}px, ${e.clientY + 15}px)`;
                });
            }
        });
    }

    // Következő Skin gomb
    nextSkinBtn.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex + 1) % skins.length;
        skinViewer.loadSkin(skins[currentSkinIndex]);
    });

    // Eredeti Skin visszaállítása
    resetSkinBtn.addEventListener('click', () => {
        currentSkinIndex = 4; // medveskinSUMMER.png index
        skinViewer.loadSkin(originalSkin);
    });
});
