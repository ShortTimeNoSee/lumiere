import { useEffect, useRef } from 'react';
import { PinCard } from './PinCard';
import { useVirtualizer } from '@tanstack/react-virtual';

interface MasonryGridProps {
  pins: any[];
  onPinClick: (pin: any) => void;
}

export function MasonryGrid({ pins, onPinClick }: MasonryGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(pins.length / 6),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[calc(100vh-4rem)] overflow-auto">
      <div className="masonry-grid">
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * 6;
          const end = Math.min(start + 6, pins.length);
          const rowPins = pins.slice(start, end);

          return (
            <div key={virtualRow.key} className="flex gap-4">
              {rowPins.map((pin) => (
                <PinCard
                  key={pin.id}
                  {...pin}
                  onClick={() => onPinClick(pin)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}