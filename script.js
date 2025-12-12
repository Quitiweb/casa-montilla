// --- CONFIGURACIÓN DE FOTOS ---
// Rutas exactas basadas en tu estructura de carpetas
const roomsData = {
    "entrada": {
        title: "Recibidor Principal",
        before: "img/01-entrada-principal.jpeg",
        after: "img/design/01-entrada-principal-design.jpeg"
    },
    "hall": {
        title: "Hall y Escaleras",
        before: "img/02-hall.jpeg",
        after: "img/design/02-hall-design.jpeg"
    },
    "salon": {
        title: "Salón con Chimenea",
        before: "img/03-salon-chimenea.jpeg",
        after: "img/design/03-salon-chimenea-design.jpeg"
    },
    "cocina": {
        title: "Cocina",
        before: "img/06-cocina.jpeg",
        after: "img/design/06-cocina-design.jpeg"
    },
    "bano_exterior": {
        title: "Baño Exterior",
        before: "img/05-baño-exterior.jpeg",
        after: "img/design/05-baño-exterior-design.png"
    },
    "garaje": {
        title: "Garaje",
        before: "img/07-garaje-v2.jpeg",
        after: "img/design/07-garaje-v2-design.jpeg"
    },
    "cuarto_peques": {
        title: "Cuarto de los Peques",
        before: "img/07-garaje-v1.jpeg",
        after: "img/design/07-garaje-v1-design.jpeg"
    },
    "patio": {
        title: "Patio Exterior",
        before: "img/04-exterior-planta-baja.jpeg",
        after: "img/design/04-exterior-planta-baja-design.jpeg"
    },
    "bano_interior": {
        title: "Baño Planta 1",
        before: "img/10-baño-interior-v1.jpeg",
        after: "img/design/10-baño-interior-design.jpeg"
    },
    "habitacion_v3": {
        title: "Habitación Invitados",
        before: "img/09-habitacion-v3.jpeg",
        after: "img/design/09-habitacion-v3-design.png"
    },
    "terraza1": {
        title: "Terraza Primera Planta",
        before: "img/11-terraza.jpeg",
        after: "img/design/11-terraza-design.jpeg"
    },
        "habitacion_gaming": {
            title: "Habitación Gaming",
            before: "img/09-habitacion-gaming-v1.png",
            after: "img/design/09-habitacion-gaming-v1-design.png"
        },
    "azotea": {
        title: "Azotea Superior",
        before: "img/12-azotea-v1.jpeg",
        after: "img/design/12-azotea-v2-design.jpeg"
    },
    "habitacion_v1": {
        title: "Habitación Principal",
        before: "img/08-habitacion-v1.jpeg",
        after: "img/design/08-habitacion-v1-design.png"
    }
};

// --- LÓGICA DE ROTACIÓN 3D (No cambia) ---
const scene = document.getElementById('scene');
const house = document.getElementById('house');

let isDragging = false;
let startX, startY;
let currentRotateX = 60;
let currentRotateZ = -20;
let currentScale = 1;
const MIN_SCALE = 0.7;
const MAX_SCALE = 2;
let pinchStartDistance = 0;
let pinchStartScale = 1;
let overlayCount = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const applyTransform = () => {
    house.style.transform = `scale(${currentScale}) rotateX(${currentRotateX}deg) rotateZ(${currentRotateZ}deg)`;
};

const lockScroll = () => {
    overlayCount += 1;
    document.body.classList.add('modal-open');
};

const unlockScroll = () => {
    overlayCount = Math.max(overlayCount - 1, 0);
    if (overlayCount === 0) {
        document.body.classList.remove('modal-open');
    }
};

scene.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

scene.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    currentRotateZ += deltaX * 0.2;
    currentRotateX -= deltaY * 0.2;

    if(currentRotateX < 0) currentRotateX = 0;
    if(currentRotateX > 90) currentRotateX = 90;

    applyTransform();

    startX = e.clientX;
    startY = e.clientY;
});

// Soporte táctil
scene.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        isDragging = false;
        pinchStartDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        pinchStartScale = currentScale;
        return;
    }

    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

scene.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        if (!pinchStartDistance) {
            pinchStartDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            pinchStartScale = currentScale;
        }
        const distance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        const scaleFactor = distance / pinchStartDistance;
        currentScale = clamp(pinchStartScale * scaleFactor, MIN_SCALE, MAX_SCALE);
        applyTransform();
        return;
    }

    if (!isDragging) return;
    e.preventDefault();
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    currentRotateZ += deltaX * 0.5;
    currentRotateX -= deltaY * 0.5;
    applyTransform();

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

window.addEventListener('touchend', () => {
    isDragging = false;
    pinchStartDistance = 0;
});

applyTransform();


// --- LÓGICA DEL MODAL ---
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
const hotspots = document.querySelectorAll('.hotspot');
const modalTitle = document.getElementById('modal-title');
const imgBefore = document.getElementById('img-before');
const imgAfter = document.getElementById('img-after');
const imageViewer = document.getElementById('image-viewer');
const viewerImage = document.getElementById('viewer-img');
const viewerCaption = document.getElementById('viewer-caption');
const viewerClose = document.querySelector('.viewer-close');
const viewerPrev = document.querySelector('.viewer-prev');
const viewerNext = document.querySelector('.viewer-next');

let activeGallery = [];
let activeRoom = '';
let currentSlide = 0;
let viewerTouchStartX = null;

const openModal = () => {
    modal.classList.add('show');
    lockScroll();
};

const closeModal = () => {
    modal.classList.remove('show');
    if (imageViewer.classList.contains('show')) {
        closeViewer();
    }
    unlockScroll();
};

const showViewerSlide = (index) => {
    if (!activeGallery.length) return;
    const count = activeGallery.length;
    currentSlide = (index + count) % count;
    const { src, caption } = activeGallery[currentSlide];
    viewerImage.src = src;
    viewerCaption.innerText = `${caption} · ${activeRoom}`;
};

const openViewer = (index = 0) => {
    if (!activeGallery.length) return;
    imageViewer.classList.add('show');
    showViewerSlide(index);
    lockScroll();
};

const closeViewer = () => {
    if (!imageViewer.classList.contains('show')) return;
    imageViewer.classList.remove('show');
    viewerImage.src = '';
    unlockScroll();
};

hotspots.forEach(spot => {
    spot.addEventListener('click', (e) => {
        e.stopPropagation();
        const roomId = spot.getAttribute('data-room');
        const data = roomsData[roomId];

        if (data) {
            modalTitle.innerText = data.title;
            activeRoom = data.title;
            activeGallery = [
                { src: data.before, caption: 'Estado Actual' },
                { src: data.after, caption: 'Diseño Futuro' }
            ];
            // Pequeño truco para verificar en consola si la imagen carga
            console.log("Cargando:", data.before, data.after);

            imgBefore.src = data.before;
            imgAfter.src = data.after;
            openModal();
        } else {
            console.log("No hay datos para:", roomId);
        }
    });
});

closeBtn.onclick = closeModal;
window.onclick = (e) => {
    if (e.target === modal) closeModal();
};

imgBefore.addEventListener('click', () => openViewer(0));
imgAfter.addEventListener('click', () => openViewer(1));

viewerClose.addEventListener('click', closeViewer);
viewerPrev.addEventListener('click', () => showViewerSlide(currentSlide - 1));
viewerNext.addEventListener('click', () => showViewerSlide(currentSlide + 1));

imageViewer.addEventListener('click', (e) => {
    if (e.target === imageViewer) {
        closeViewer();
    }
});

document.addEventListener('keydown', (e) => {
    if (!imageViewer.classList.contains('show')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowLeft') showViewerSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') showViewerSlide(currentSlide + 1);
});

imageViewer.addEventListener('touchstart', (e) => {
    if (!imageViewer.classList.contains('show')) return;
    if (e.touches.length === 1) {
        viewerTouchStartX = e.touches[0].clientX;
    }
});

imageViewer.addEventListener('touchend', (e) => {
    if (viewerTouchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - viewerTouchStartX;
    if (Math.abs(deltaX) > 50) {
        showViewerSlide(deltaX > 0 ? currentSlide - 1 : currentSlide + 1);
    }
    viewerTouchStartX = null;
});