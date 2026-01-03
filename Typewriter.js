export class Typewriter {
  #queue = [];
  #isPrinting = false;
  #lastTime = Date.now();
  #animationFrame = null;
  speed = 100;
  onPrint = null;

  constructor(speed, onPrint) {
    this.speed = speed;
    this.onPrint = onPrint;
  }

  push(text) {
    if (Array.isArray(text)) {
      this.#queue.push(...text);
    } else {
      this.#queue.push(...text.split(""));
    }
  }

  start() {
    if (this.#queue.length === 0) {
      this.stop();
      return;
    }

    if (this.#isPrinting) {
      return;
    }

    this.#isPrinting = true;
    this.#lastTime = Date.now();
    this.print();
  }

  print() {
    if (this.#queue.length === 0) {
      this.stop();
      return;
    }
    const currentTime = Date.now();
    const deltaTime = currentTime - this.#lastTime;
    let count = Math.ceil(deltaTime / this.speed);
    if (count >= 1) {
      const chars = this.#queue.splice(0, count);
      const text = chars.join("");

      this.onPrint?.(text);

      this.#lastTime = currentTime;
    }

    this.#animationFrame = requestAnimationFrame(this.print.bind(this));
  }

  stop() {
    this.#isPrinting = false;
    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame);
      this.#animationFrame = null;
    }
  }
}
