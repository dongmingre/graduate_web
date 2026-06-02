import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import type { Photo } from '../photoData';
import type { CardLayout } from '../layout';

gsap.registerPlugin(Draggable);

type PhotoCardProps = {
  photo: Photo;
  layout: CardLayout;
  onSelect: (photo: Photo) => void;
};

export function PhotoCard({ photo, layout, onSelect }: PhotoCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<Draggable | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const board = card.closest('.board-shell') as HTMLElement | null;
    const targetX = (layout.x - 50) * window.innerWidth / 100;
    const targetY = (layout.y - 54) * window.innerHeight / 100;

    gsap.set(card, {
      left: '50%',
      top: '54%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      rotateX: 24,
      rotateY: -16,
      rotation: 0,
      scale: 0.52,
      opacity: 0,
      zIndex: layout.zIndex,
    });

    gsap.to(card, {
      x: targetX,
      y: targetY,
      rotateX: 0,
      rotateY: 0,
      rotation: layout.rotation,
      scale: 1,
      opacity: 1,
      duration: 1.35,
      delay: layout.delay,
      ease: 'expo.out',
    });

    const draggable = Draggable.create(card, {
      type: 'x,y',
      bounds: board ?? undefined,
      cursor: 'var(--cursor-chalk), grab',
      activeCursor: 'var(--cursor-chalk-press), grabbing',
      edgeResistance: 0.68,
      zIndexBoost: true,
      onClick() {
        onSelect(photo);
      },
      onPress() {
        card.classList.add('is-lifted');
        gsap.to(card, { scale: 1.055, rotation: 0, duration: 0.25, ease: 'power2.out' });
      },
      onRelease() {
        card.classList.remove('is-lifted');
        gsap.to(card, { scale: 1, duration: 0.38, ease: 'back.out(1.8)' });
      },
    })[0];

    dragRef.current = draggable;

    return () => {
      draggable.kill();
      dragRef.current = null;
    };
  }, [layout, onSelect, photo]);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const frame = frameRef.current;
    const drag = dragRef.current;
    if (!frame || drag?.isDragging) return;

    const rect = frame.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(frame, {
      rotateY: px * 15,
      rotateX: -py * 15,
      y: -6,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 700,
    });
  }

  function handlePointerLeave() {
    const frame = frameRef.current;
    if (!frame) return;

    gsap.to(frame, {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
    });
  }

  return (
    <article
      ref={cardRef}
      className="photo-card"
      style={{
        '--card-width': `${layout.width}px`,
        '--tape-rotation': `${layout.tapeRotation}deg`,
        '--photo-ratio': layout.ratio,
      } as React.CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label={`查看照片 ${photo.id}: ${photo.caption}`}
    >
      <span className="photo-tape" />
      <div ref={frameRef} className="photo-frame" data-caption={photo.caption}>
        <img
          src={photo.thumbSrc}
          alt={photo.caption}
          draggable={false}
          loading={photo.id <= 6 ? 'eager' : 'lazy'}
          fetchpriority={photo.id <= 6 ? 'high' : 'low'}
          decoding="async"
        />
      </div>
    </article>
  );
}
