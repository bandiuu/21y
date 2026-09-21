/* =========================================================================
   ESTADO GLOBAL
   ========================================================================= */
let currentScene = 1;
let discoveredCount = 0;
const totalFlowers = 5;

/* =========================================================================
   DATOS DE LAS FLORES Y PREVENCIÓN DE SUPERPOSICIONES
   Usamos un sistema de distribución vertical preciso y max-widths para 
   garantizar que la frase 4 y 5 jamás se toquen ni sobresalgan.
   ========================================================================= */
const gardenData = [
    {
        id: 1,
        phrase: "Por tu sonrisa.",
        top: "6%", left: "12%",
        textStyles: "left: 100%; top: 20%; margin-left: 15px; text-align: left; width: max-content;",
        delay: "0s", scale: 0.95
    },
    {
        id: 2,
        phrase: "Por esa energía que tienes.",
        top: "24%", right: "12%",
        textStyles: "right: 100%; top: 20%; margin-right: 15px; text-align: right; width: max-content;",
        delay: "-1s", scale: 1
    },
    {
        id: 3,
        phrase: "Porque me pareciste increíble desde que empezamos a hablar.",
        top: "44%", left: "8%",
        textStyles: "left: 100%; top: 5%; margin-left: 15px; text-align: left; width: 145px;",
        delay: "-2.5s", scale: 0.85
    },
    {
        id: 4,
        phrase: "Porque algunas personas simplemente llaman la atención.",
        top: "63%", right: "8%",
        textStyles: "right: 100%; top: 5%; margin-right: 15px; text-align: right; width: 140px;",
        delay: "-1.5s", scale: 0.9
    },
    {
        id: 5,
        phrase: "Y porque sí.",
        top: "84%", left: "50%",
        // La frase 5 se posiciona arriba de la flor 5 de manera controlada. 
        // Como la flor 4 está al 63%, queda espacio de sobra para evitar colisiones.
        textStyles: "bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 12px; text-align: center; white-space: nowrap;",
        delay: "-0.5s", scale: 1.05
    }
];

/* =========================================================================
   INICIALIZACIÓN
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    renderScene1Flower();
    renderScene2Flower();
    renderGardenFlowers();
    renderSpecialFlower();
});

/* =========================================================================
   MANEJO DE ESCENAS Y FLUJO LIMPIO
   ========================================================================= */
function showScene(sceneNumber) {
    document.querySelector('.scene.active').classList.remove('active');
    currentScene = sceneNumber;
    
    setTimeout(() => {
        document.getElementById(`scene-${sceneNumber}`).classList.add('active');
    }, 1000);
}

function setupEventListeners() {
    // Portada a Revelación
    document.getElementById('btn-start').addEventListener('click', () => {
        showScene(2);
        // La flor 2 se abre majestuosamente al entrar
        setTimeout(() => {
            const scene2Svg = document.querySelector('#scene-2-flower svg');
            if (scene2Svg) scene2Svg.classList.add('open');
        }, 1200);
    });

    // Revelación al Jardín
    document.getElementById('btn-enter-garden').addEventListener('click', () => {
        showScene(3);
    });

    // Del Jardín a la Flor Especial
    document.getElementById('btn-next-special').addEventListener('click', () => {
        showScene(4);
    });

    // De la Flor Especial al Final
    document.getElementById('btn-final-scene').addEventListener('click', () => {
        showScene(5);
        startFinalSequence();
    });

    // Tocar la Flor Especial
    document.getElementById('special-flower-touch').addEventListener('click', openSpecialFlower);
}

/* =========================================================================
   GENERACIÓN SVG
   ========================================================================= */
function createFlowerSVG(isOpen = false, isSpecial = false) {
    const openClass = isOpen ? ' open' : '';
    const centerColor = isSpecial ? 'var(--yellow-dark)' : '#EAB308';
    const petalColor = isSpecial ? 'var(--yellow-deep)' : 'var(--yellow-soft)';
    
    const numPetals = isSpecial ? 10 : 7;
    let petalsHTML = '';
    
    for (let i = 0; i < numPetals; i++) {
        const angle = (360 / numPetals) * i;
        const delay = (Math.random() * 0.3).toFixed(2);
        petalsHTML += `
            <g transform="rotate(${angle} 50 30)">
                <ellipse class="petal" cx="50" cy="10" rx="9" ry="22" fill="${petalColor}" style="transition-delay: ${delay}s"/>
            </g>
        `;
    }

    return `
        <svg class="flower${openClass}" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,40 Q45,75 52,105" stroke="var(--olive-light)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <path d="M51,75 Q35,65 40,50 Q50,60 51,75" fill="var(--olive-dark)"/>
            <path d="M51,85 Q65,80 60,65 Q50,75 51,85" fill="var(--olive-dark)"/>
            <g class="petal-group">
                ${petalsHTML}
            </g>
            <circle cx="50" cy="30" r="7.5" fill="${centerColor}" />
        </svg>
    `;
}

function renderScene1Flower() {
    // Flor presente desde el inicio pero cerrada
    document.getElementById('scene-1-flower').innerHTML = createFlowerSVG(false, false);
}

function renderScene2Flower() {
    // Se inserta cerrada y se abrirá por evento CSS
    document.getElementById('scene-2-flower').innerHTML = createFlowerSVG(false, false);
}

function renderSpecialFlower() {
    document.getElementById('special-flower-touch').insertAdjacentHTML(
        'beforebegin', 
        createFlowerSVG(false, true)
    );
}

/* =========================================================================
   LÓGICA DEL JARDÍN Y PREVENCIÓN DE SUPERPOSICIONES
   ========================================================================= */
function renderGardenFlowers() {
    const gardenArea = document.getElementById('garden-area');
    
    gardenData.forEach(flower => {
        const item = document.createElement('div');
        item.className = 'garden-item';
        
        if(flower.top) item.style.top = flower.top;
        if(flower.left) item.style.left = flower.left;
        if(flower.right) item.style.right = flower.right;
        
        item.style.transform = `scale(${flower.scale})`;
        
        item.innerHTML = `
            <div class="flower-wrapper" style="animation-delay: ${flower.delay}">
                ${createFlowerSVG(false, false)}
            </div>
            <div class="flower-phrase" style="${flower.textStyles}">
                ${flower.phrase}
            </div>
            <div class="touch-area"></div>
        `;
        
        const touchArea = item.querySelector('.touch-area');
        touchArea.addEventListener('click', () => discoverFlower(item));
        
        gardenArea.appendChild(item);
    });
}

function discoverFlower(flowerItem) {
    if (flowerItem.classList.contains('discovered')) return;

    flowerItem.classList.add('discovered');
    const svg = flowerItem.querySelector('svg');
    svg.classList.add('open');

    discoveredCount++;
    document.getElementById('progress-text').innerText = `${discoveredCount} / ${totalFlowers}`;

    if (discoveredCount === totalFlowers) {
        showGardenCompletion();
    }
}

function showGardenCompletion() {
    setTimeout(() => {
        const n1 = document.getElementById('narrative-1');
        const n2 = document.getElementById('narrative-2');
        const n3 = document.getElementById('narrative-3');
        const btn = document.getElementById('btn-next-special');

        n1.classList.add('visible');
        
        setTimeout(() => {
            n1.classList.remove('visible');
            n2.classList.add('visible');
            
            setTimeout(() => {
                n2.classList.remove('visible');
                n3.classList.add('visible');
                
                setTimeout(() => {
                    btn.classList.add('visible');
                }, 1500);

            }, 2500);
        }, 2500);

    }, 1500);
}

/* =========================================================================
   LÓGICA DE LA FLOR ESPECIAL
   ========================================================================= */
function openSpecialFlower() {
    const wrapper = document.getElementById('special-flower-area');
    if (wrapper.classList.contains('open')) return;

    wrapper.classList.add('open');
    const svg = wrapper.querySelector('svg');
    svg.classList.add('open');

    setTimeout(() => {
        document.getElementById('special-message').classList.add('visible');
        
        setTimeout(() => {
            const btn = document.getElementById('btn-final-scene');
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }, 2000);

    }, 1200);
}

/* =========================================================================
   SECUENCIA FINAL
   ========================================================================= */
function startFinalSequence() {
    setTimeout(() => {
        document.getElementById('final-1').classList.add('visible');
        
        setTimeout(() => {
            document.getElementById('final-2').classList.add('visible');
            
            setTimeout(() => {
                document.getElementById('final-3').classList.add('visible');
                
                setTimeout(() => {
                    document.getElementById('final-4').classList.add('visible');
                }, 3500);

            }, 2500);
        }, 2500);
    }, 1000);
}
