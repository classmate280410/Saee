/* ============================================================
   PROJECT: SAEЕ DIWALI SPECIAL
   JAVASCRIPT: INTERACTIVE FESTIVAL EXPERIENCE

   Features:
   1. Loading screen
   2. Dynamic particles
   3. Canvas fireworks
   4. Celebration interactions
   5. Scroll reveal
   6. Smooth navigation
   7. Performance optimization
============================================================ */


/* ============================================================
   01. DOM ELEMENTS
============================================================ */

const loader = document.getElementById("loader");

const mainWrapper = document.getElementById("mainWrapper");

const starsLayer = document.getElementById("starsLayer");

const particlesLayer = document.getElementById("particlesLayer");

const fireworksCanvas = document.getElementById("fireworksCanvas");

const fireworksButton = document.getElementById("fireworksButton");

const finalFireworksButton = document.getElementById("finalFireworksButton");

const ctx = fireworksCanvas.getContext("2d");


/* ============================================================
   02. GLOBAL CONFIGURATION
============================================================ */

const CONFIG = {

    particleCount: 35,

    fireworksParticleCount: 65,

    maxFireworks: 5,

    autoCelebration: true,

    autoCelebrationDelay: 1200,

    loaderDuration: 1800,

    fireworksDuration: 7000,

    mobileParticleCount: 20,

    reducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches

};


/* ============================================================
   03. GLOBAL STATE
============================================================ */

let fireworks = [];

let particles = [];

let animationFrame = null;

let celebrationTimer = null;

let isCelebrating = false;

let lastFrameTime = 0;

let pageLoaded = false;


/* ============================================================
   04. DEVICE DETECTION
============================================================ */

function isMobileDevice() {

    return window.innerWidth <= 650;

}


function getParticleCount() {

    return isMobileDevice()
        ? CONFIG.mobileParticleCount
        : CONFIG.particleCount;

}


/* ============================================================
   05. LOADING SCREEN
============================================================ */

function hideLoader() {

    if (!loader) return;

    loader.style.opacity = "0";

    loader.style.visibility = "hidden";

    loader.style.pointerEvents = "none";

    pageLoaded = true;

    if (mainWrapper) {

        mainWrapper.style.opacity = "1";

    }

}


function initializeLoader() {

    if (!loader) {

        pageLoaded = true;

        return;

    }

    if (CONFIG.reducedMotion) {

        hideLoader();

        return;

    }

    setTimeout(

        hideLoader,

        CONFIG.loaderDuration

    );

}


/* ============================================================
   06. CREATE BACKGROUND STARS
============================================================ */

function createStars() {

    if (!starsLayer) return;

    const starCount = isMobileDevice() ? 35 : 70;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {

        const star = document.createElement("span");

        star.style.position = "absolute";

        star.style.left = Math.random() * 100 + "%";

        star.style.top = Math.random() * 100 + "%";

        star.style.width = Math.random() * 2 + 1 + "px";

        star.style.height = star.style.width;

        star.style.borderRadius = "50%";

        star.style.background = Math.random() > 0.5
            ? "#ffe8ad"
            : "#ffffff";

        star.style.opacity = Math.random() * 0.7 + 0.2;

        star.style.boxShadow = "0 0 6px rgba(255,255,255,0.4)";

        if (!CONFIG.reducedMotion) {

            star.style.animation =
                `starTwinkle ${Math.random() * 4 + 2}s ease-in-out infinite`;

            star.style.animationDelay =
                Math.random() * 3 + "s";

        }

        fragment.appendChild(star);

    }

    starsLayer.appendChild(fragment);

}


/* ============================================================
   07. CREATE FLOATING PARTICLES
============================================================ */

function createParticles() {

    if (!particlesLayer) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < getParticleCount(); i++) {

        const particle = document.createElement("span");

        particle.className = "dynamic-particle";

        particle.style.position = "absolute";

        particle.style.left = Math.random() * 100 + "%";

        particle.style.bottom = "-20px";

        const size = Math.random() * 4 + 2;

        particle.style.width = size + "px";

        particle.style.height = size + "px";

        particle.style.borderRadius = "50%";

        particle.style.background = Math.random() > 0.5
            ? "#f6c96d"
            : "#ffe8ad";

        particle.style.boxShadow =
            "0 0 10px rgba(246,201,109,0.7)";

        particle.style.opacity = Math.random() * 0.7 + 0.2;

        if (!CONFIG.reducedMotion) {

            particle.style.animation =
                `dynamicParticleRise ${Math.random() * 12 + 8}s linear infinite`;

            particle.style.animationDelay =
                Math.random() * 12 + "s";

        }

        fragment.appendChild(particle);

    }

    particlesLayer.appendChild(fragment);

}


/* ============================================================
   08. INJECT PARTICLE ANIMATIONS
============================================================ */

function injectDynamicAnimations() {

    const style = document.createElement("style");

    style.textContent = `

        @keyframes starTwinkle {

            0%, 100% {

                opacity: 0.25;

                transform: scale(0.8);

            }

            50% {

                opacity: 1;

                transform: scale(1.3);

            }

        }


        @keyframes dynamicParticleRise {

            0% {

                transform: translateY(0) translateX(0);

                opacity: 0;

            }

            15% {

                opacity: 0.8;

            }

            50% {

                transform: translateY(-50vh) translateX(25px);

            }

            85% {

                opacity: 0.7;

            }

            100% {

                transform: translateY(-110vh) translateX(-20px);

                opacity: 0;

            }

        }

    `;

    document.head.appendChild(style);

}


/* ============================================================
   09. CANVAS RESIZE
============================================================ */

function resizeCanvas() {

    if (!fireworksCanvas) return;

    const pixelRatio = Math.min(

        window.devicePixelRatio || 1,

        2

    );

    fireworksCanvas.width =
        window.innerWidth * pixelRatio;

    fireworksCanvas.height =
        window.innerHeight * pixelRatio;

    fireworksCanvas.style.width =
        window.innerWidth + "px";

    fireworksCanvas.style.height =
        window.innerHeight + "px";

    ctx.setTransform(

        pixelRatio,

        0,

        0,

        pixelRatio,

        0,

        0

    );

}


/* ============================================================
   10. FIREWORK PARTICLE CLASS
============================================================ */

class FireworkParticle {

    constructor(x, y, color, velocityX, velocityY) {

        this.x = x;

        this.y = y;

        this.color = color;

        this.velocityX = velocityX;

        this.velocityY = velocityY;

        this.alpha = 1;

        this.friction = 0.985;

        this.gravity = 0.045;

        this.radius = Math.random() * 2.2 + 1;

        this.decay = Math.random() * 0.012 + 0.008;

    }


    update() {

        this.velocityX *= this.friction;

        this.velocityY *= this.friction;

        this.velocityY += this.gravity;

        this.x += this.velocityX;

        this.y += this.velocityY;

        this.alpha -= this.decay;

    }


    draw() {

        if (this.alpha <= 0) return;

        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 12;

        ctx.shadowColor = this.color;

        ctx.beginPath();

        ctx.arc(

            this.x,

            this.y,

            this.radius,

            0,

            Math.PI * 2

        );

        ctx.fill();

        ctx.restore();

    }


    isDead() {

        return this.alpha <= 0;

    }

}


/* ============================================================
   11. FIREWORK CLASS
============================================================ */

class Firework {

    constructor(x, y) {

        this.x = x;

        this.y = y;

        this.color = this.randomColor();

        this.particles = [];

        this.createExplosion();

    }


    randomColor() {

        const colors = [

            "#f6c96d",

            "#ffe8ad",

            "#ffffff",

            "#b99aff",

            "#ffb347",

            "#ffdc73",

            "#e6b8ff"

        ];

        return colors[

            Math.floor(Math.random() * colors.length)

        ];

    }


    createExplosion() {

        const particleCount = isMobileDevice()

            ? 35

            : CONFIG.fireworksParticleCount;


        for (let i = 0; i < particleCount; i++) {

            const angle =

                (Math.PI * 2 * i) / particleCount;


            const speed =

                Math.random() * 4 + 1.5;


            const velocityX =

                Math.cos(angle) * speed;


            const velocityY =

                Math.sin(angle) * speed;


            this.particles.push(

                new FireworkParticle(

                    this.x,

                    this.y,

                    this.color,

                    velocityX,

                    velocityY

                )

            );

        }

    }


    update() {

        this.particles.forEach(particle => {

            particle.update();

        });


        this.particles = this.particles.filter(

            particle => !particle.isDead()

        );

    }


    draw() {

        this.particles.forEach(particle => {

            particle.draw();

        });

    }


    isDead() {

        return this.particles.length === 0;

    }

}


/* ============================================================
   12. FIREWORKS ENGINE
============================================================ */

function animateFireworks(timestamp = 0) {

    if (!ctx || !fireworksCanvas) return;

    if (CONFIG.reducedMotion) return;

    if (timestamp - lastFrameTime < 1000 / 45) {

        animationFrame = requestAnimationFrame(

            animateFireworks

        );

        return;

    }

    lastFrameTime = timestamp;


    ctx.clearRect(

        0,

        0,

        window.innerWidth,

        window.innerHeight

    );


    fireworks.forEach(firework => {

        firework.update();

        firework.draw();

    });


    fireworks = fireworks.filter(

        firework => !firework.isDead()

    );


    if (fireworks.length > 0 || isCelebrating) {

        animationFrame = requestAnimationFrame(

            animateFireworks

        );

    } else {

        cancelAnimationFrame(animationFrame);

        animationFrame = null;

    }

}


/* ============================================================
   13. LAUNCH FIREWORK
============================================================ */

function launchFirework(x, y) {

    if (CONFIG.reducedMotion) return;

    if (fireworks.length >= CONFIG.maxFireworks) {

        return;

    }

    fireworks.push(

        new Firework(x, y)

    );


    if (!animationFrame) {

        animationFrame = requestAnimationFrame(

            animateFireworks

        );

    }

}


/* ============================================================
   14. RANDOM FIREWORKS
============================================================ */

function launchRandomFirework() {

    const x =

        Math.random() * window.innerWidth * 0.8 +

        window.innerWidth * 0.1;


    const y =

        Math.random() * window.innerHeight * 0.55 +

        window.innerHeight * 0.12;


    launchFirework(x, y);

}


/* ============================================================
   15. CELEBRATION MODE
============================================================ */

function startCelebration() {

    if (CONFIG.reducedMotion) return;

    if (isCelebrating) return;

    isCelebrating = true;


    const duration = CONFIG.fireworksDuration;

    const startTime = Date.now();


    function celebrationLoop() {

        if (!isCelebrating) return;


        if (Date.now() - startTime >= duration) {

            stopCelebration();

            return;

        }


        if (fireworks.length < CONFIG.maxFireworks) {

            launchRandomFirework();

        }


        celebrationTimer = setTimeout(

            celebrationLoop,

            isMobileDevice() ? 650 : 450

        );

    }


    celebrationLoop();

}


/* ============================================================
   16. STOP CELEBRATION
============================================================ */

function stopCelebration() {

    isCelebrating = false;

    clearTimeout(celebrationTimer);

    celebrationTimer = null;

}


/* ============================================================
   17. BUTTON INTERACTIONS
============================================================ */

function initializeButtons() {

    if (fireworksButton) {

        fireworksButton.addEventListener(

            "click",

            () => {

                startCelebration();

            }

        );

    }


    if (finalFireworksButton) {

        finalFireworksButton.addEventListener(

            "click",

            () => {

                startCelebration();

            }

        );

    }

}


/* ============================================================
   18. CLICK ANYWHERE FIREWORKS
============================================================ */

function initializeClickEffects() {

    document.addEventListener(

        "click",

        function (event) {

            const target = event.target;


            if (

                target.closest("button") ||

                target.closest("a")

            ) {

                return;

            }


            if (CONFIG.reducedMotion) return;


            launchFirework(

                event.clientX,

                event.clientY

            );

        }

    );

}


/* ============================================================
   19. SCROLL REVEAL ANIMATIONS
============================================================ */

function initializeScrollReveal() {

    if (CONFIG.reducedMotion) return;


    const revealElements = document.querySelectorAll(

        ".section-heading, " +

        ".message-card, " +

        ".dream-card, " +

        ".topper-note, " +

        ".shayari-card, " +

        ".friendship-container, " +

        ".final-section"

    );


    revealElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform = "translateY(35px)";

        element.style.transition =

            "opacity 0.8s ease, transform 0.8s ease";

    });


    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =

                        "translateY(0)";


                    observer.unobserve(entry.target);

                }

            });

        },

        {

            threshold: 0.12,

            rootMargin: "0px 0px -40px 0px"

        }

    );


    revealElements.forEach(element => {

        observer.observe(element);

    });

}


/* ============================================================
   20. NAVIGATION SMOOTH SCROLL
============================================================ */

function initializeNavigation() {

    const navigationLinks = document.querySelectorAll(

        'a[href^="#"]'

    );


    navigationLinks.forEach(link => {

        link.addEventListener(

            "click",

            function (event) {

                const targetId =

                    this.getAttribute("href");


                if (targetId === "#") return;


                const targetElement =

                    document.querySelector(targetId);


                if (!targetElement) return;


                event.preventDefault();


                targetElement.scrollIntoView({

                    behavior: CONFIG.reducedMotion

                        ? "auto"

                        : "smooth",

                    block: "start"

                });

            }

        );

    });

}


/* ============================================================
   21. DYNAMIC DIYA SPARKLES
============================================================ */

function initializeDiyaSparkles() {

    const diyas = document.querySelectorAll(

        ".hero-decoration, " +

        ".loader-diya, " +

        ".final-diya, " +

        ".friendship-icon"

    );


    diyas.forEach(diya => {

        diya.addEventListener(

            "mouseenter",

            () => {

                if (CONFIG.reducedMotion) return;

                diya.style.filter =

                    "drop-shadow(0 0 30px rgba(246,201,109,0.9))";

            }

        );


        diya.addEventListener(

            "mouseleave",

            () => {

                diya.style.filter = "";

            }

        );

    });

}


/* ============================================================
   22. RESIZE EVENT
============================================================ */

function initializeResizeHandler() {

    let resizeTimeout;


    window.addEventListener(

        "resize",

        () => {

            clearTimeout(resizeTimeout);


            resizeTimeout = setTimeout(

                () => {

                    resizeCanvas();

                },

                150

            );

        }

    );

}


/* ============================================================
   23. VISIBILITY OPTIMIZATION
============================================================ */

function initializeVisibilityHandler() {

    document.addEventListener(

        "visibilitychange",

        () => {

            if (document.hidden) {

                stopCelebration();

                if (animationFrame) {

                    cancelAnimationFrame(animationFrame);

                    animationFrame = null;

                }

            }

        }

    );

}


/* ============================================================
   24. AUTOMATIC CELEBRATION
============================================================ */

function initializeAutoCelebration() {

    if (!CONFIG.autoCelebration) return;

    if (CONFIG.reducedMotion) return;


    setTimeout(

        () => {

            startCelebration();

        },

        CONFIG.autoCelebrationDelay

    );

}


/* ============================================================
   25. WEBSITE INITIALIZATION
============================================================ */

function initializeWebsite() {

    injectDynamicAnimations();

    createStars();

    createParticles();

    resizeCanvas();

    initializeLoader();

    initializeButtons();

    initializeClickEffects();

    initializeScrollReveal();

    initializeNavigation();

    initializeDiyaSparkles();

    initializeResizeHandler();

    initializeVisibilityHandler();

    initializeAutoCelebration();

}


/* ============================================================
   26. DOM READY
============================================================ */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeWebsite();

    }

);


/* ============================================================
   27. WINDOW LOAD
============================================================ */

window.addEventListener(

    "load",

    () => {

        if (!pageLoaded) {

            setTimeout(

                hideLoader,

                500

            );

        }

    }

);


/* ============================================================
   END OF SAEЕ DIWALI JAVASCRIPT
============================================================ */
