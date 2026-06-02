import { useEffect } from 'react';
import type { Photo } from '../photoData';

type LightboxProps = {
  photo: Photo | null;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function Lightbox({ photo, total, onClose, onNext, onPrevious }: LightboxProps) {
  useEffect(() => {
    if (!photo) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrevious();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, onNext, onPrevious]);

  if (!photo) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${photo.caption} 大图`}>
      <button className="lightbox-backdrop" type="button" aria-label="关闭大图" onClick={onClose} />
      <section className="lightbox-panel">
        <button className="icon-button lightbox-close" type="button" aria-label="关闭" onClick={onClose}>
          ×
        </button>
        <button className="icon-button lightbox-nav lightbox-prev" type="button" aria-label="上一张" onClick={onPrevious} />
        <figure>
          <img src={photo.fullSrc} alt={photo.caption} decoding="async" />
          <figcaption>
            <span>{String(photo.id).padStart(2, '0')} / {total}</span>
            <strong>{photo.caption}</strong>
            <em>{photo.note}</em>
          </figcaption>
        </figure>
        <button className="icon-button lightbox-nav lightbox-next" type="button" aria-label="下一张" onClick={onNext} />
      </section>
    </div>
  );
}
