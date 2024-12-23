import { useEffect, useRef, useState } from 'react';
import { PinCard } from './PinCard';
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
      if (width >= 2400) setColumns(8);
      else if (width >= 1920) setColumns(6);
      else if (width >= 1440) setColumns(5);
      else if (width >= 1024) setColumns(4);
      else if (width >= 768) setColumns(3);
      else setColumns(2);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const getColumnPins = () => {
    const columnArrays = Array.from({ length: columns }, () => []);
    pins.forEach((pin, index) => {
      columnArrays[index % columns].push(pin);
    });
    return columnArrays;
  };

  return (
    <div 
      ref={containerRef} 
      className="h-[calc(100vh-4rem)] overflow-auto px-3"
    >
      <div 
        ref={ref}
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {getColumnPins().map((columnPins, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3">
            {columnPins.map((pin) => (
              <div 
                key={pin.id}
                className="w-full transform-gpu"
              >
                <PinCard
                  {...pin}
                  onClick={() => onPinClick(pin)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}