export class EntranceAnimationController {
  constructor() {
    this.doorLeft = null;
    this.doorRight = null;
    this.entranceAnimation = null;
    this.logoReveal = null;
    this.mainContent = null;
    this.body = null;
    this.isAnimating = false;
  }

  init() {
    this.doorLeft = document.getElementById("door-left");
    this.doorRight = document.getElementById("door-right");
    this.entranceAnimation = document.getElementById("entrance-animation");
    this.logoReveal = document.getElementById("logo-reveal");
    this.mainContent = document.getElementById("main-content");
    this.body = document.body;

    // Check if animation has already been shown in this session
    if (sessionStorage.getItem('tapti_intro_shown')) {
      this.skipAnimation();
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    if (this.entranceAnimation) {
      this.entranceAnimation.addEventListener("click", () => this.openDoors());
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.openDoors();
      }
    });
  }

  openDoors() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    sessionStorage.setItem('tapti_intro_shown', 'true');

    // Fase 1: Desaparecer el logo primero
    if (this.logoReveal) {
      this.logoReveal.style.transition = "opacity 0.8s ease-out";
      this.logoReveal.style.opacity = "0";
    }

    // Fase 2: Abrir puertas y Zoom (después de que el logo desaparezca)
    setTimeout(() => {
      // Abrir puertas
      this.animateDoors();

      // Zoom hacia adentro
      if (this.entranceAnimation) {
        this.entranceAnimation.style.transition = "transform 1.5s ease-in, opacity 1.5s ease-in";
        this.entranceAnimation.style.transform = "scale(3) translateZ(100px)";
        this.entranceAnimation.style.opacity = "0";
        this.entranceAnimation.style.pointerEvents = "none";
      }

      // Mostrar contenido principal
      setTimeout(() => {
        if (this.mainContent && this.body) {
          this.mainContent.style.transition = "opacity 1s ease-in";
          this.mainContent.style.opacity = "1";
          this.body.style.overflow = "visible";
        }
      }, 800);

      // Limpieza final
      setTimeout(() => this.cleanup(), 2000);

    }, 600); // Esperar 600ms (casi todo el fade del logo) antes de abrir
  }

  animateDoors() {
    if (this.doorLeft && this.doorRight) {
      // Abrir hacia adentro (rotación Y)
      this.doorLeft.style.transform = "rotateY(-110deg)";
      this.doorRight.style.transform = "rotateY(110deg)";
    }
  }

  cleanup() {
    if (this.entranceAnimation) {
      this.entranceAnimation.remove();
    }
  }

  skipAnimation() {
    if (this.entranceAnimation) {
      this.entranceAnimation.style.display = 'none';
    }
    if (this.mainContent) {
      this.mainContent.style.opacity = '1';
      this.mainContent.style.transition = 'none';
    }
    if (this.body) {
      this.body.style.overflow = 'visible';
    }
  }
}