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

    // Fase 1: Desaparecer logo suavemente
    this.hideLogo();

    // Fase 2: Pausa elegante antes de abrir las puertas
    setTimeout(() => {
      this.animateDoors();
      
      // Sincronizar: overlay comienza a desvanecerse al mismo tiempo que las puertas se abren
      if (this.entranceAnimation) {
        this.entranceAnimation.style.transition = "opacity 2s ease-out";
        this.entranceAnimation.style.opacity = "0";
        this.entranceAnimation.style.pointerEvents = "none";
      }
      
      // Contenido principal aparece gradualmente mientras las puertas se abren
      if (this.mainContent && this.body) {
        this.mainContent.style.transition = "opacity 1.5s ease-in";
        this.mainContent.style.opacity = "1";
        this.body.style.overflow = "visible";
      }
    }, 500);

    // Fase 3: Limpiar elementos después de que toda la animación termine elegantemente
    setTimeout(() => this.cleanup(), 3000);
  }

  hideLogo() {
    if (this.logoReveal) {
      this.logoReveal.style.transition = "opacity 0.8s ease-out";
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
    // Método mantenido para compatibilidad, pero la lógica se maneja en openDoors()
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