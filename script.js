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
        after: "img/design/03-salon-design.jpeg"
    },
    "cocina": {
        title: "Cocina",
        before: "img/06-cocina.jpeg",
        after: "img/design/06-cocina-design.jpeg"
    },
    "garaje": {
        title: "Garaje",
        before: "img/07-garaje-v1.jpeg",
        after: "img/design/07-garaje-v1-design.jpeg"
    },
    "bano_interior": {
        title: "Baño Planta 1",
        before: "img/10-baño-interior-v1.jpeg", // Asumo que es v1 o v2, ajusta si falla
        after: "img/design/10-baño-interior-design.jpeg"
    },
    "terraza1": {
        title: "Terraza Primera Planta",
        before: "img/11-terraza.jpeg",
        after: "img/design/11-terraza-design.jpeg"
    },
    "azotea": {
        title: "Azotea Superior",
        before: "img/12-azotea-v1.jpeg",
        after: "img/design/12-azotea-v2-design.jpeg"
    }
};

// --- LÓGICA DE ROTACIÓN 3D (No cambia) ---
const scene = document.getElementById('scene');
const house = document.getElementById('house');

let isDragging = false;
let startX, startY;
let currentRotateX = 60;
let currentRotateZ = -20;

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

    house.style.transform = `rotateX(${currentRotateX}deg) rotateZ(${currentRotateZ}deg)`;

    startX = e.clientX;
    startY = e.clientY;
});

// Soporte táctil
scene.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

scene.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    currentRotateZ += deltaX * 0.5;
    currentRotateX -= deltaY * 0.5;
    house.style.transform = `rotateX(${currentRotateX}deg) rotateZ(${currentRotateZ}deg)`;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

window.addEventListener('touchend', () => isDragging = false);


// --- LÓGICA DEL MODAL ---
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
const hotspots = document.querySelectorAll('.hotspot');
const modalTitle = document.getElementById('modal-title');
const imgBefore = document.getElementById('img-before');
const imgAfter = document.getElementById('img-after');

hotspots.forEach(spot => {
    spot.addEventListener('click', (e) => {
        e.stopPropagation();
        const roomId = spot.getAttribute('data-room');
        const data = roomsData[roomId];

        if (data) {
            modalTitle.innerText = data.title;
            // Pequeño truco para verificar en consola si la imagen carga
            console.log("Cargando:", data.before, data.after);

            imgBefore.src = data.before;
            imgAfter.src = data.after;
            modal.style.display = "block";
        } else {
            console.log("No hay datos para:", roomId);
        }
    });
});

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
}