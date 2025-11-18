export class EntranceAnimationController {
  constructor() {
    this.doorLeft = null;
    this.doorRight = null;
    this.logoReveal = null;
    this.entranceAnimation = null;
    this.mainContent = null;
    this.body = null;
    this.isAnimating = false;
  }

  init() {
    this.doorLeft = document.getElementById("door-left");
    this.doorRight = document.getElementById("door-right");
    this.logoReveal = document.getElementById("logo-reveal");
    this.entranceAnimation = document.getElementById("entrance-animation");
    this.mainContent = document.getElementById("main-content");
    this.body = document.body;

    this.setupEventListeners();
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

    // Fase 1: Desaparecer logo
    this.hideLogo();

    // Fase 2: Abrir puertas
    setTimeout(() => this.animateDoors(), 300);

    // Fase 3: Mostrar contenido principal
    setTimeout(() => this.showMainContent(), 2300);

    // Fase 4: Limpiar elementos
    setTimeout(() => this.cleanup(), 3300);
  }

  hideLogo() {
    if (this.logoReveal) {
      this.logoReveal.style.opacity = "0";
    }
  }

  animateDoors() {
    if (this.doorLeft && this.doorRight) {
      this.doorLeft.style.transform = "translateX(-100%)";
      this.doorRight.style.transform = "translateX(100%)";
    }
  }

  showMainContent() {
    if (this.entranceAnimation && this.mainContent && this.body) {
      this.entranceAnimation.style.opacity = "0";
      this.entranceAnimation.style.pointerEvents = "none";
      this.mainContent.style.opacity = "1";
      this.body.style.overflow = "visible";
    }
  }

  cleanup() {
    if (this.entranceAnimation) {
      this.entranceAnimation.remove();
    }
  }
}