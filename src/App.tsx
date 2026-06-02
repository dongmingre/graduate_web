import { useCallback, useMemo, useState } from 'react';
import { ChalkDustCursor } from './components/ChalkDustCursor';
import { PhotoCard } from './components/PhotoCard';
import { Lightbox } from './components/Lightbox';
import { getCardLayout } from './layout';
import { photos, type Photo } from './photoData';

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export default function App() {
  const [selected, setSelected] = useState<Photo | null>(null);

  const layouts = useMemo(() => photos.map((photo, index) => getCardLayout(photo, index)), []);

  const showPhoto = useCallback((photo: Photo) => {
    setSelected(photo);
  }, []);

  const showNext = useCallback(() => {
    setSelected((current) => {
      if (!current) return current;
      const currentIndex = photos.findIndex((photo) => photo.id === current.id);
      return photos[(currentIndex + 1) % photos.length];
    });
  }, []);

  const showPrevious = useCallback(() => {
    setSelected((current) => {
      if (!current) return current;
      const currentIndex = photos.findIndex((photo) => photo.id === current.id);
      return photos[(currentIndex - 1 + photos.length) % photos.length];
    });
  }, []);

  return (
    <main className="board-shell">
      <div className="projector-light" />
      <section className="hero-title" aria-label="毕业照片墙标题">
        <h1>泰丰168号</h1>
        <p>DongMing in AUST</p>
        <svg className="chalk-underline" viewBox="0 0 360 18" aria-hidden="true">
          <path d="M8 11 C 70 4, 132 16, 195 9 S 314 4, 352 12" />
        </svg>
      </section>

      <img className="school-logo" src={publicAsset('chalk-doodle-logo.svg')} alt="安徽理工大学" />
      <span className="chalk-note chalk-note-left">stay gold</span>
      <svg className="chalk-doodle" viewBox="0 0 560 250" aria-label="毕业快乐纸飞机涂鸦">
        <text className="chalk-doodle-text" x="30" y="104">
          毕业快乐!!
        </text>
        <path className="chalk-doodle-line" d="M26 162 C 140 124, 263 112, 408 110" />
        <path className="chalk-doodle-plane" d="M382 130 L 530 90 L 456 206 L 430 158 L 382 130 Z" />
        <path className="chalk-doodle-plane" d="M430 158 L 530 90 L 458 147" />
        <path className="chalk-doodle-trail" d="M112 214 C 140 202, 159 202, 166 214 C 172 226, 150 228, 143 217 C 135 205, 167 200, 207 211 C 241 220, 262 220, 268 210 C 275 198, 254 194, 246 205 C 238 218, 269 228, 316 222 C 354 218, 382 203, 409 186" />
        <path className="chalk-doodle-spark" d="M142 217 c 5 -8, 12 -8, 17 0 c -6 4 -12 4 -17 0 Z" />
      </svg>
      <span className="chalk-note chalk-note-bottom">one last frame</span>

      <img className="campus-doodle" src={publicAsset('building_chalk.svg')} alt="计算机科学与工程学院楼粉笔线稿" />

      <section className="photo-field" aria-label="毕业照片墙">
        {photos.map((photo, index) => (
          <PhotoCard key={photo.id} photo={photo} layout={layouts[index]} onSelect={showPhoto} />
        ))}
      </section>

      <p className="interaction-hint">✦ 文艺青年 ✦</p>
      <div className="letterbox" />
      <div className="film-grain" />
      <ChalkDustCursor />

      <Lightbox
        photo={selected}
        total={photos.length}
        onClose={() => setSelected(null)}
        onNext={showNext}
        onPrevious={showPrevious}
      />
    </main>
  );
}
