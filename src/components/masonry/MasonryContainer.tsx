import { useEffect, useRef } from 'react';
import { PinCard } from '../pins/PinCard';
import { Masonry } from '@fristys/masonry';

interface MasonryContainerProps {
  pins: any[];
  onPinClick: (pin: any) => void;
}

export function MasonryContainer({ pins, onPinClick }: MasonryContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      masonryRef.current = new Masonry(containerRef.current, {
        columns: 6,
        gutter: 16,
        gutterUnit: 'px',
        columnBreakpoints: {
          2560: 6,
          1920: 5,
          1440: 4,
          1024: 3,
          768: 2,
          480: 1
        },
        initOnImageLoad: true,
        loadingClass: 'masonry-loading',
        loadedClass: 'masonry-loaded',
        useContainerWidth: true,
        trackItemSizeChanges: true
      });
    }

    return () => {
      if (masonryRef.current && typeof masonryRef.current.destroy === 'function') {
        masonryRef.current.destroy();
      }
    };
  }, [pins]);

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-screen p-4 opacity-0 transition-opacity duration-300"
      id="masonry"
    >
      {pins.map((pin) => (
        <div key={pin.id} className="masonry-item mb-4">
          <PinCard {...pin} onClick={() => onPinClick(pin)} />
        </div>
      ))}
    </div>
  );
}