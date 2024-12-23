import { useEffect, useRef, useState } from 'react';
import { PinCard } from './PinCard';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';

interface MasonryGridProps {
  pins: any[];
  onPinClick: (pin: any) => void;
}

export function MasonryGrid({ pins, onPinClick }: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(6);
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true
  });

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 2400) setColumns(6);
      else if (width >= 1920) setColumns(5);
      else if (width >= 1440) setColumns(4);
      else if (width >= 1024) setColumns(3);
      else setColumns(2);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(pins.length / columns),
    getScrollElement: () => containerRef.current,
    estimateSize: () => 300,
    overscan: 5,
  });

  return (
    <div ref={containerRef} className="h-[calc(100vh-4rem)] overflow-auto">
      <div 
        ref={ref}
        className="masonry-grid"
        style={{
          columnCount: columns,
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        {pins.map((pin) => (
          <div key={pin.id} className="break-inside-avoid mb-4">
            <PinCard
              {...pin}
              onClick={() => onPinClick(pin)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}