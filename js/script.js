/* =========================================================================
   ESTADO GLOBAL
   ========================================================================= */
let currentScene = 1;
let discoveredCount = 0;
const totalFlowers = 5;

/* =========================================================================
   DATOS DE LAS FLORES (Posicionamiento calibrado para evitar choques)
   Se ha reducido la distribución vertical al top 64% de la pantalla,
   dejando completamente libre la zona inferior para los textos y botón.
   ========================================================================= */
const gardenData = [
    {
        id: 1, phrase: "Por tu sonrisa.",
        top: "7%", left: "12%",
        textStyles: "left: 100%; top: 20%; margin-left: 15px; text-align: left; width: max-content;",
        delay: "0s", scale: 0.95
    },
    {
        id: 2, phrase: "Por esa energía que tienes.",
        top: "21%", right: "12%",
        textStyles: "right: 100%; top: 20%; margin-right: 15px; text-align: right; width: max-content;",
        delay: "-1s", scale: 1
    },
    {
        id: 3, phrase: "Porque me pareciste increíble desde que empezamos a hablar.",
        top: "35%", left: "8%",
        textStyles: "left: 100%; top: 5%; margin-left: 15px; text-align: left; width: 145px;",
        delay: "-2.5s", scale: 0.85
    },
    {
        id: 4, phrase: "Porque algunas personas simplemente llaman la atención.",
        top: "49%", right: "8%",
        textStyles: "right: 100%; top: 5%; margin-right: 15px; text-align: right; width: 140px;",
        delay: "-1.5s", scale: 0.9
    },
    {
        id: 5, phrase: "Y porque sí.",
        top: "64%", left: "50%",
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
   MANEJO DE ESCENAS
   ========================================================================= */
function showScene(sceneNumber) {
    document.querySelector('.scene.active').classList.remove('active');
    currentScene = sceneNumber;
    
    setTimeout(() => {
        document.getElementById(`scene-${sceneNumber}`).classList.add('active');
    }, 1000);
}

function setupEventListeners() {
    // Escena 1 -> Escena 2
    document.getElementById('btn-start').addEventListener('click', () => {
        showScene(2);
        setTimeout(() => {
            const scene2Svg = document.querySelector('#scene-2-flower svg');
            if (scene2Svg) scene2Svg.classList.add('open');
        }, 1200);
    });

    // Escena 2 -> Jardín
    document.getElementById('btn-enter-garden').addEventListener('click', () => {
        showScene(3);
    });

    // Jardín completado -> Flor Especial
    document.getElementById('btn-next-special').addEventListener('click', () => {
        showScene(4);
    });

    // Flor Especial ("Continuar") -> Final
    document.getElementById('btn-final-scene').addEventListener('click', () => {
        showScene(5);
        startFinalSequence();
    });

    // Interacción Flor Especial
    document.getElementById('special-flower-touch').addEventListener('click', openSpecialFlower);
}

/* =========================================================================
   GENERACIÓN SVG (Flores)
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
    document.getElementById('scene-1-flower').innerHTML = createFlowerSVG(false, false);
}

function renderScene2Flower() {
    document.getElementById('scene-2-flower').innerHTML = createFlowerSVG(false, false);
}

function renderSpecialFlower() {
    document.getElementById('special-flower-touch').insertAdjacentHTML('beforebegin', createFlowerSVG(false, true));
}

/* =========================================================================
   LÓGICA DEL JARDÍN
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
    flowerItem.querySelector('svg').classList.add('open');

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
                    // Aparece el botón de manera clara y funcional
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
    wrapper.querySelector('svg').classList.add('open');

    setTimeout(() => {
        document.getElementById('special-message').classList.add('visible');
        
        // Aparece "Continuar" después de 1.5s
        setTimeout(() => {
            document.getElementById('btn-final-scene').classList.add('visible');
        }, 1500);

    }, 1200);
}

/* =========================================================================
   SECUENCIA FINAL CON RAMO PNG
   ========================================================================= */
function startFinalSequence() {
    setTimeout(() => {
        document.getElementById('final-bouquet-img').classList.add('visible');
        
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
        }, 2000); 
    }, 800); 
}
