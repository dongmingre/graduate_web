import { useEffect, useRef } from 'react';

const MAX_PARTICLES = 56;
const MIN_DISTANCE = 9;
const MIN_INTERVAL_MS = 30;

export function ChalkDustCursor() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const dustLayer = layer;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const particles: HTMLElement[] = [];
    let lastX = Number.NaN;
    let lastY = Number.NaN;
    let lastTime = 0;

    function removeParticle(particle: HTMLElement) {
      particle.remove();
      const index = particles.indexOf(particle);
      if (index >= 0) particles.splice(index, 1);
    }

    function spawnParticle(x: number, y: number, speed: number, moveX: number, moveY: number) {
      if (particles.length >= MAX_PARTICLES) {
        const oldest = particles.shift();
        oldest?.remove();
      }

      const particle = document.createElement('span');
      const pointerLagX = -12;
      const pointerLagY = 10;
      const movementAngle = Math.atan2(moveY, moveX || 1);
      const trailingAngle = movementAngle + Math.PI + (Math.random() - 0.5) * 0.95;
      const speedFactor = Math.min(speed * 0.06, 7);
      const drift = 5 + Math.random() * 11 + speedFactor;
      const tail = 4 + Math.random() * 8;
      const size = 0.8 + Math.random() * 1.9;

      particle.className = 'chalk-dust-particle';
      particle.style.left = `${x + pointerLagX - Math.cos(movementAngle) * tail + (Math.random() - 0.5) * 5}px`;
      particle.style.top = `${y + pointerLagY - Math.sin(movementAngle) * tail + (Math.random() - 0.5) * 5}px`;
      particle.style.setProperty('--dust-size', `${size}px`);
      particle.style.setProperty('--dust-alpha', `${0.24 + Math.random() * 0.3}`);
      particle.style.setProperty('--dust-duration', `${560 + Math.random() * 440}ms`);
      particle.style.setProperty('--dust-x', `${Math.cos(trailingAngle) * drift}px`);
      particle.style.setProperty('--dust-y', `${Math.sin(trailingAngle) * drift + 7 + Math.random() * 9}px`);

      dustLayer.appendChild(particle);
      particles.push(particle);
      window.setTimeout(() => removeParticle(particle), 980);
    }

    function handleCursorMove(event: PointerEvent | MouseEvent) {
      const pointerType = 'pointerType' in event ? event.pointerType : 'mouse';
      if (reducedMotion.matches || coarsePointer.matches || pointerType === 'touch') return;

      const now = performance.now();
      if (Number.isNaN(lastX) || Number.isNaN(lastY)) {
        lastX = event.clientX;
        lastY = event.clientY;
        lastTime = now;
        return;
      }

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const distance = Math.hypot(dx, dy);

      if (distance < MIN_DISTANCE || now - lastTime < MIN_INTERVAL_MS) return;

      const particleCount = distance > 46 ? 2 : 1;
      for (let index = 0; index < particleCount; index += 1) {
        spawnParticle(event.clientX, event.clientY, distance, dx, dy);
      }

      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = now;
    }

    window.addEventListener('pointermove', handleCursorMove, { passive: true });
    window.addEventListener('mousemove', handleCursorMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleCursorMove);
      window.removeEventListener('mousemove', handleCursorMove);
      particles.splice(0).forEach((particle) => particle.remove());
    };
  }, []);

  return <div ref={layerRef} className="chalk-dust-layer" aria-hidden="true" />;
}
