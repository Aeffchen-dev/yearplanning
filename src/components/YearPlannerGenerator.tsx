import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { setItemWithExpiry, getItemWithExpiry, clearExpiredItems, clearAllYearPlannerData } from '@/utils/localStorage';

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  starColor?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readonly = false,
  starColor = "white",
}) => {
  const [rating, setRating] = useState(value);
  const [hoverRating, setHoverRating] = useState(0);
  const componentId = useRef(Math.random().toString(36).substring(2, 11)).current;

  useEffect(() => {
    setRating(value);
  }, [value]);

  const handleClick = (starIndex: number) => {
    if (readonly) return;
    
    const lastFullStar = Math.ceil(rating);
    
    if (lastFullStar === starIndex) {
      // Clicking on the last set star - toggle between full and half
      const isFullStar = rating === starIndex;
      const newRating = isFullStar ? starIndex - 0.5 : starIndex;
      setRating(newRating);
      onChange?.(newRating);
    } else {
      // Clicking on a different star - set full rating
      setRating(starIndex);
      onChange?.(starIndex);
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleTouchStart = (starIndex: number) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleTouchEnd = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = hoverRating > 0 ? hoverRating : rating;
    
    if (currentRating >= starIndex) {
      return 1; // Full star
    } else if (currentRating > starIndex - 1) {
      const fraction = currentRating - (starIndex - 1);
      return fraction;
    }
    return 0; // Empty star
  };

  const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

  return (
    <div className={`flex ${starColor === 'black' ? 'gap-1' : 'gap-1 md:gap-3'}`}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const fillLevel = getStarFill(starIndex);
        const fillPercentage = fillLevel * 100;
        const clipId = `clip-${componentId}-${starIndex}`;
        
        return (
          <button
            key={starIndex}
            type="button"
            className={`${starColor === 'black' ? 'w-6 h-6' : 'w-8 h-8 md:w-10 md:h-10'} cursor-pointer transition-colors duration-200`}
            style={{ color: starColor, touchAction: 'manipulation' }}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart(starIndex)}
            onTouchEnd={handleTouchEnd}
            disabled={readonly}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              {/* Empty star (outline) */}
              <path
                d={starPath}
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              
              {/* Filled star */}
              {fillLevel > 0 && (
                <g>
                  <defs>
                    <clipPath id={clipId}>
                      <rect x="0" y="0" width={`${fillPercentage}%`} height="100%" />
                    </clipPath>
                  </defs>
                  <path
                    d={starPath}
                    fill="currentColor"
                    clipPath={`url(#${clipId})`}
                  />
                </g>
              )}
            </svg>
          </button>
        );
      })}
    </div>
  );
};

interface TextAreaProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  rows?: number;
  fillHeight?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  value = "",
  onChange,
  className = "",
  rows = 4,
  fillHeight = false,
}) => {
  return (
    <div className={`bg-[#FFE299] p-4 ${fillHeight ? 'flex-1 flex flex-col' : 'flex-1'} ${className}`}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full ${fillHeight ? 'flex-1' : 'h-full'} bg-transparent ${value ? 'text-black' : 'text-[#B29F71]'} placeholder-[#B29F71] resize-none border-none outline-none font-arial text-base leading-[120%] ${fillHeight ? '' : 'min-h-[80px]'}`}
        rows={fillHeight ? undefined : rows}
      />
    </div>
  );
};

interface EmojiIconProps {
  emoji: string;
  label: string;
}

const EmojiIcon: React.FC<EmojiIconProps> = ({ emoji, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
      <span className="text-2xl">{emoji}</span>
    </div>
    <span className="text-white text-base font-arial flex-1">{label}</span>
  </div>
);

interface DraggableEmojiIconProps {
  emoji: string;
  label: string;
  onStartDrag: (emoji: string, label: string) => void;
  disabled?: boolean;
}

const DraggableEmojiIcon: React.FC<DraggableEmojiIconProps> = ({ emoji, label, onStartDrag, disabled = false }) => {
  const [isDragStarted, setIsDragStarted] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (!isDragStarted) {
      setIsDragStarted(true);
      onStartDrag(emoji, label);
      // Reset after a short delay to allow for multiple drags
      setTimeout(() => setIsDragStarted(false), 100);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (!isDragStarted) {
      setIsDragStarted(true);
      onStartDrag(emoji, label);
      // Reset after a short delay to allow for multiple drags
      setTimeout(() => setIsDragStarted(false), 100);
    }
  };

  return (
    <div 
      className={`flex items-center gap-2 select-none ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-grab active:cursor-grabbing'}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ touchAction: 'none' }}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${disabled ? 'bg-gray-600' : 'bg-black hover:bg-gray-800'}`}>
        <span className="text-2xl pointer-events-none">{emoji}</span>
      </div>
      <span className={`text-base font-arial flex-1 pointer-events-none ${disabled ? 'text-gray-500' : 'text-white'}`}>{label}</span>
    </div>
  );
};

interface DraggableEmojiProps {
  emoji: string;
  label: string;
  initialX?: number;
  initialY?: number;
}

const DraggableEmoji: React.FC<DraggableEmojiProps> = ({ emoji, label, initialX = 0, initialY = 0 }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const emojiRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={emojiRef}
      className={`absolute w-12 h-12 bg-black rounded-full flex items-center justify-center cursor-move select-none z-10 ${isDragging ? 'opacity-75' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease'
      }}
      onMouseDown={handleMouseDown}
      title={label}
    >
      <span className="text-2xl pointer-events-none">{emoji}</span>
    </div>
  );
};


const GraphComponent: React.FC<{ type: "past-year" | "goals" }> = ({
  type,
}) => (
  <div className="relative w-full h-[310px] my-8">
    {/* Axes */}
    <svg className="absolute inset-0 w-full h-full">
      {/* Horizontal line (X-axis) - fills container width */}
      <line
        x1="0"
        y1="50%"
        x2="100%"
        y2="50%"
        stroke="white"
        strokeWidth="1"
        markerEnd="url(#arrowhead-right)"
      />
      {/* Vertical line (Y-axis) - centered horizontally */}
      <line
        x1="50%"
        y1="0"
        x2="50%"
        y2="100%"
        stroke="white"
        strokeWidth="1"
        markerEnd="url(#arrowhead-up)"
      />
      
      {/* Arrow markers */}
      <defs>
        <marker
          id="arrowhead-right"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="white"
          />
        </marker>
        <marker
          id="arrowhead-up"
          markerWidth="7"
          markerHeight="10"
          refX="3.5"
          refY="1"
          orient="auto"
        >
          <polygon
            points="0 10, 3.5 0, 7 10"
            fill="white"
          />
        </marker>
      </defs>
    </svg>

    {/* Labels */}
    {type === "past-year" ? (
      <>
        {/* Y-axis labels - 8px right from y-axis */}
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 text-white text-xs leading-tight w-20 font-arial" style={{ marginLeft: '8px' }}>
          Nicht im Fokus
          <br />
          Wenig Zeit
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-xs leading-tight w-12 text-right font-arial">
          Im Fokus
          <br />
          Viel Zeit
        </div>
        {/* X-axis labels - 8px below x-axis */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-white text-xs w-20 text-center font-arial" style={{ marginTop: '8px' }}>
          Hat mich erfüllt
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white text-xs w-24 text-center font-arial">
          Hat mich belastet
        </div>
      </>
    ) : (
      <>
        {/* Y-axis labels - 8px right from y-axis */}
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 text-white text-xs leading-tight w-20 font-arial" style={{ marginLeft: '8px' }}>
          Schwer umsetzbar
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-xs leading-tight w-14 text-right font-arial">
          Einfach umsetzbar
        </div>
        {/* X-axis labels - 8px below x-axis */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-white text-xs w-18 text-center font-arial" style={{ marginTop: '8px' }}>
          Hoher Impact
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white text-xs w-22 text-center font-arial">
          Niedriger Impact
        </div>
        {/* Highlighted quadrant */}
        <div className="absolute top-4 left-1/2 w-[153px] h-[132px] bg-white bg-opacity-5"></div>
        <div className="absolute top-20 left-1/2 translate-x-11 text-white text-opacity-30 text-xs text-center w-16 leading-tight font-arial">
          diese Ziele geht ihr an
        </div>
      </>
    )}
  </div>
);

interface FocusAreasSectionProps {
  starRatings: {[key: string]: number};
  updateStarRating: (key: string, value: number) => void;
  textareaValues: {[key: string]: string};
  updateTextareaValue: (key: string, value: string) => void;
}

const FocusAreasSection: React.FC<FocusAreasSectionProps> = ({ 
  starRatings, 
  updateStarRating, 
  textareaValues, 
  updateTextareaValue 
}) => {
  const handleFocusChange = (index: number, value: string) => {
    updateTextareaValue(`slide11-focus-${index}`, value);
  };

  return (
    <div className="h-full flex flex-col gap-2">
      {[1, 2, 3, 4, 5].map((i, index) => {
        const focusKey = `slide11-focus-${index}`;
        const starKey = `slide11-star-${index}`;
        const focusValue = textareaValues[focusKey] || '';
        
        return (
          <div key={i} className="bg-[#FFE299] flex flex-col flex-1 min-h-0">
            <div className="p-4 pb-1 flex-1 min-h-0 flex flex-col">
              <textarea
                placeholder="Fokus"
                value={focusValue}
                onChange={(e) => handleFocusChange(index, e.target.value)}
                className={`w-full flex-1 bg-transparent ${focusValue ? 'text-black' : 'text-[#B29F71]'} placeholder-[#B29F71] resize-none border-none outline-none font-arial text-xs leading-[120%]`}
              />
            </div>
            <div className="px-4 pb-1 flex justify-end flex-shrink-0">
              <StarRating 
                starColor="black" 
                value={starRatings[starKey] || 0}
                onChange={(value) => updateStarRating(starKey, value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface DraggableFloatingEmojiProps {
  id: string;
  emoji: string;
  label: string;
  initialX: number;
  initialY: number;
  onDrag: (id: string, x: number, y: number) => void;
  onDelete?: (id: string) => void;
}

const DraggableFloatingEmoji: React.FC<DraggableFloatingEmojiProps> = ({ 
  id, emoji, label, initialX, initialY, onDrag, onDelete 
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const [graphContainerSize, setGraphContainerSize] = useState({ width: 300, height: 250 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the graph container size for accurate percentage calculations
  useEffect(() => {
    // Find the graph container (the relative container that holds the emojis)
    const graphContainer = document.querySelector('.flex-1.flex.items-center.justify-center.min-h-0.relative');
    if (graphContainer) {
      const rect = graphContainer.getBoundingClientRect();
      setGraphContainerSize({ width: rect.width, height: rect.height });
    }
  }, [position]);

  const startLongPress = () => {
    if (onDelete) {
      const timer = setTimeout(() => {
        if (navigator.vibrate) {
          navigator.vibrate(50); // Haptic feedback
        }
        setShowDeleteTooltip(true);
      }, 500); // 500ms long press
      setLongPressTimer(timer);
    }
  };

  const cancelLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setShowDeleteTooltip(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Toggle tooltip if it's showing, otherwise start long press
    if (showDeleteTooltip) {
      setShowDeleteTooltip(false);
      return;
    }
    
    startLongPress();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Toggle tooltip if it's showing, otherwise start long press
    if (showDeleteTooltip) {
      setShowDeleteTooltip(false);
      return;
    }
    
    startLongPress();
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    // Cancel long press if user starts dragging (but keep tooltip if showing)
    cancelLongPress();
    
    // Get the card container bounds
    const cardElement = document.querySelector('.bg-\\[\\#161616\\]');
    if (!cardElement) return;
    
    const cardRect = cardElement.getBoundingClientRect();
    const emojiSize = 48; // 48px = w-12 h-12
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate boundaries relative to the card - adjusted for proper top/bottom bounds
    const constrainedX = Math.max(-cardRect.width/2 + emojiSize/2, Math.min(cardRect.width/2 - emojiSize/2, newX));
    const constrainedY = Math.max(-cardRect.height/2 + 75, Math.min(cardRect.height/2 - 10, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
    onDrag(id, constrainedX, constrainedY);
  }, [isDragging, dragStart, id, onDrag]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    // Cancel long press if user starts dragging (but keep tooltip if showing)
    cancelLongPress();
    
    // Get the card container bounds
    const cardElement = document.querySelector('.bg-\\[\\#161616\\]');
    if (!cardElement) return;
    
    const cardRect = cardElement.getBoundingClientRect();
    const emojiSize = 48; // 48px = w-12 h-12
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Calculate boundaries relative to the card - adjusted for proper top/bottom bounds
    const constrainedX = Math.max(-cardRect.width/2 + emojiSize/2, Math.min(cardRect.width/2 - emojiSize/2, newX));
    const constrainedY = Math.max(-cardRect.height/2 + 75, Math.min(cardRect.height/2 - 10, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
    onDrag(id, constrainedX, constrainedY);
  }, [isDragging, dragStart, id, onDrag]);

  const handleMouseUp = useCallback(() => {
    cancelLongPress();
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp]);

  // Calculate percentage positions for print scaling (relative to graph container)
  const percentX = (position.x / graphContainerSize.width) * 100;
  const percentY = (position.y / graphContainerSize.height) * 100;

  return (
    <div
      ref={containerRef}
      className={`absolute w-12 h-12 bg-black rounded-full flex items-center justify-center cursor-move select-none z-20 print-emoji ${isDragging ? 'opacity-75' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease',
        touchAction: 'none',
        // Store percentage positions as CSS custom properties for print
        '--emoji-x-percent': `${percentX}%`,
        '--emoji-y-percent': `${percentY}%`,
      } as React.CSSProperties}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      title={label}
      data-emoji-x={percentX}
      data-emoji-y={percentY}
    >
      <span className="text-2xl pointer-events-none">{emoji}</span>
      
      {/* Delete tooltip */}
      {showDeleteTooltip && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-xs font-arial whitespace-nowrap z-30 print:hidden">
          <button 
            onClick={handleDelete}
            className="hover:text-gray-300"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            Entfernen
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
};

interface SlideWithDraggableEmojisProps {
  draggedEmojis: Array<{id: string, emoji: string, label: string, x: number, y: number}>;
  updateDraggedEmojis: (emojis: Array<{id: string, emoji: string, label: string, x: number, y: number}>) => void;
}

const SlideWithDraggableEmojis: React.FC<SlideWithDraggableEmojisProps> = ({ 
  draggedEmojis = [], 
  updateDraggedEmojis 
}) => {
  const [draggedEmojiId, setDraggedEmojiId] = useState<string | null>(null);

  const handleStartDrag = (emoji: string, label: string) => {
    // Check if this emoji is already placed (only allow one of each)
    const alreadyPlaced = draggedEmojis.some(e => e.emoji === emoji);
    if (alreadyPlaced) return;
    
    const newId = `${emoji}-${Date.now()}`;
    const newEmoji = {
      id: newId,
      emoji,
      label,
      x: 50, // Start position
      y: 50
    };
    const newEmojis = [...draggedEmojis, newEmoji];
    updateDraggedEmojis(newEmojis);
    setDraggedEmojiId(newId);
  };

  const handleEmojiDrag = (id: string, x: number, y: number) => {
    const newEmojis = draggedEmojis.map(emoji => 
      emoji.id === id ? { ...emoji, x, y } : emoji
    );
    updateDraggedEmojis(newEmojis);
  };

  const handleDeleteEmoji = (id: string) => {
    const newEmojis = draggedEmojis.filter(emoji => emoji.id !== id);
    updateDraggedEmojis(newEmojis);
  };

  const handleReset = () => {
    updateDraggedEmojis([]);
  };

  return (
    <div className="flex flex-col h-full gap-8 relative">
      {/* Reset button at the very top of card container */}
      <button
        onClick={handleReset}
        className="absolute top-[-36px] md:-top-10 right-0 text-white text-xs font-arial z-10"
      >
        Zurücksetzen
      </button>
      
      <div className="flex-1 flex items-center justify-center min-h-0 relative">
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/d3e1d8c3-4f97-4683-8ded-a54d85b8972c.png" 
            alt="Past year graph" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        {/* Dragged emojis positioned over the image */}
        {draggedEmojis.map((emoji) => (
          <DraggableFloatingEmoji
            key={emoji.id}
            id={emoji.id}
            emoji={emoji.emoji}
            label={emoji.label}
            initialX={emoji.x}
            initialY={emoji.y}
            onDrag={handleEmojiDrag}
            onDelete={handleDeleteEmoji}
          />
        ))}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <DraggableEmojiIcon emoji="❤️" label="Beziehung" onStartDrag={handleStartDrag} disabled={draggedEmojis.some(e => e.emoji === "❤️")} />
            <DraggableEmojiIcon emoji="👯‍♀️" label="Freunde" onStartDrag={handleStartDrag} disabled={draggedEmojis.some(e => e.emoji === "👯‍♀️")} />
            <DraggableEmojiIcon emoji="🐶" label="Kalle" onStartDrag={handleStartDrag} disabled={draggedEmojis.some(e => e.emoji === "🐶")} />
          </div>
          <div className="space-y-2">
            <DraggableEmojiIcon emoji="🤸" label="Hobbies" onStartDrag={handleStartDrag} disabled={draggedEmojis.some(e => e.emoji === "🤸")} />
            <DraggableEmojiIcon emoji="🫀" label="Gesundheit" onStartDrag={handleStartDrag} disabled={draggedEmojis.some(e => e.emoji === "🫀")} />
            <DraggableEmojiIcon emoji="👩‍💻" label="Beruf" onStartDrag={handleStartDrag} disabled={draggedEmojis.some(e => e.emoji === "👩‍💻")} />
          </div>
        </div>
        <div className="text-center text-white text-sm font-arial">
          Platziert die Emojis auf dem Graphen
        </div>
      </div>
    </div>
  );
};

interface SlideData {
  id: number;
  label: { number: string; text: string };
  title?: string;
  content?: React.ReactNode;
}

const slides = (
  textareaValues: {[key: string]: string}, 
  updateTextareaValue: (key: string, value: string) => void,
  starRatings: {[key: string]: number},
  updateStarRating: (key: string, value: number) => void,
  draggedEmojis: Array<{id: string, emoji: string, label: string, x: number, y: number}>,
  updateDraggedEmojis: (emojis: Array<{id: string, emoji: string, label: string, x: number, y: number}>) => void
): SlideData[] => [
  // Slide 1
  {
    id: 1,
    label: { number: "01", text: "The past year" },
    title:
      "Schaut zurück auf das letzte Jahr. Was war los? Ordnet folgende Bereiche im Graphen ein.",
    content: (
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center text-white text-xs font-arial">
          Swipe um weiter zu navigieren
        </div>
      </div>
    ),
  },
  // Slide 2
  {
    id: 2,
    label: { number: "01", text: "The past year" },
    content: (
      <SlideWithDraggableEmojis 
        draggedEmojis={draggedEmojis}
        updateDraggedEmojis={updateDraggedEmojis}
      />
    ),
  },
  // Slide 3
  {
    id: 3,
    label: { number: "01", text: "The past year" },
    content: (
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Worauf seid ihr stolz?
          </div>
          <TextArea 
            placeholder="Wir sind stolz auf ..." 
            value={textareaValues['slide3-proud'] || ''}
            onChange={(value) => updateTextareaValue('slide3-proud', value)}
            fillHeight={true}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Wofür seid ihr dankbar?
          </div>
          <TextArea 
            placeholder="Wir sind dankbar für ..." 
            value={textareaValues['slide3-grateful'] || ''}
            onChange={(value) => updateTextareaValue('slide3-grateful', value)}
            fillHeight={true}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Was wollt ihr nächstes Jahr besser machen?
          </div>
          <TextArea 
            placeholder="Wir nehmen uns vor ..." 
            value={textareaValues['slide3-improve'] || ''}
            onChange={(value) => updateTextareaValue('slide3-improve', value)}
            fillHeight={true}
          />
        </div>
      </div>
    ),
  },
  // Slide 4
  {
    id: 4,
    label: { number: "02", text: "Health Check" },
    title:
      "Schaut auf eure Beziehung: Was läuft gut? Was braucht mehr Achtsamkeit?",
  },
  // Slide 5
  {
    id: 5,
    label: { number: "02", text: "Health Check" },
    content: (
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-evenly">
          <div className="space-y-2">
            <div className="text-white text-base font-arial">Sexualität</div>
            <StarRating 
              value={starRatings['slide5-sexuality'] || 0}
              onChange={(value) => updateStarRating('slide5-sexuality', value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-white text-base font-arial">
              Emotionale Verbundenheit
            </div>
            <StarRating 
              value={starRatings['slide5-emotional'] || 0}
              onChange={(value) => updateStarRating('slide5-emotional', value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-white text-base font-arial">Kommunikation</div>
            <StarRating 
              value={starRatings['slide5-communication'] || 0}
              onChange={(value) => updateStarRating('slide5-communication', value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-white text-base font-arial">Vertrauen</div>
            <StarRating 
              value={starRatings['slide5-trust'] || 0}
              onChange={(value) => updateStarRating('slide5-trust', value)}
            />
          </div>
        </div>
        <div className="text-center text-white text-xs font-arial flex-shrink-0 mt-4">
          Füllt die Sterne aus, klickt erneut für halb gefüllt
        </div>
      </div>
    ),
  },
  // Slide 6
  {
    id: 6,
    label: { number: "02", text: "Health Check" },
    content: (
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex-1 flex flex-col justify-evenly">
          <div className="space-y-2">
            <div className="text-white text-base font-arial">Gemeinsame Zeit</div>
            <StarRating 
              value={starRatings['slide6-time'] || 0}
              onChange={(value) => updateStarRating('slide6-time', value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-white text-base font-arial">
              Zusammen gelacht
            </div>
            <StarRating 
              value={starRatings['slide6-laughter'] || 0}
              onChange={(value) => updateStarRating('slide6-laughter', value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-white text-base font-arial">
              Konfliktbewältigung
            </div>
            <StarRating 
              value={starRatings['slide6-conflict'] || 0}
              onChange={(value) => updateStarRating('slide6-conflict', value)}
            />
          </div>
          <div className="space-y-2">
            <div className="text-white text-base font-arial">
              Freiheit, Unabhängigkeit
            </div>
            <StarRating 
              value={starRatings['slide6-freedom'] || 0}
              onChange={(value) => updateStarRating('slide6-freedom', value)}
            />
          </div>
        </div>
        <div className="text-center text-white text-xs font-arial flex-shrink-0 mt-4">
          Füllt die Sterne aus, klickt erneut für halb gefüllt
        </div>
      </div>
    ),
  },
  // Slide 7
  {
    id: 7,
    label: { number: "02", text: "Health Check" },
    content: (
      <div className="flex-1 flex flex-col">
        <div className="text-white text-base mb-4 font-arial">
          Wie fühlt sich das an? Überrascht euch etwas? Wählt zwei Fokus-Felder
          fürs kommende Jahr aus.
        </div>
        <TextArea
          placeholder="Unsere Erkenntnisse"
          fillHeight={true}
          value={textareaValues['slide7-insights'] || ''}
          onChange={(value) => updateTextareaValue('slide7-insights', value)}
        />
      </div>
    ),
  },
  // Slide 8
  {
    id: 8,
    label: { number: "03", text: "The new year" },
    title:
      "Richtet euren Blick auf das kommende Jahr: Was nehmt ihr euch vor? Was wollt ihr erreichen?",
  },
  // Slide 9
  {
    id: 9,
    label: { number: "03", text: "The new year" },
    content: (
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Was wollen wir neu initiieren?
          </div>
          <TextArea 
            placeholder="Wir starten mit ..." 
            value={textareaValues['slide9-initiate'] || ''}
            onChange={(value) => updateTextareaValue('slide9-initiate', value)}
            fillHeight={true}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Womit wollen wir aufhören, weil es uns nicht gut tut?
          </div>
          <TextArea 
            placeholder="Wir stoppen ..." 
            value={textareaValues['slide9-stop'] || ''}
            onChange={(value) => updateTextareaValue('slide9-stop', value)}
            fillHeight={true}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Was wollt ihr weiter machen?
          </div>
          <TextArea 
            placeholder="Wir machen weiter mit ..." 
            value={textareaValues['slide9-continue'] || ''}
            onChange={(value) => updateTextareaValue('slide9-continue', value)}
            fillHeight={true}
          />
        </div>
      </div>
    ),
  },
  // Slide 10
  {
    id: 10,
    label: { number: "03", text: "The new year" },
    content: (
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Was wollen wir bis Jahresende geschafft haben?
          </div>
          <TextArea 
            placeholder="Wir schaffen ..." 
            value={textareaValues['slide10-achieve'] || ''}
            onChange={(value) => updateTextareaValue('slide10-achieve', value)}
            fillHeight={true}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Welches Ziel nehmen wir aus dem letzten Jahr mit?
          </div>
          <TextArea 
            placeholder="Wir nehmen mit ..." 
            value={textareaValues['slide10-carry'] || ''}
            onChange={(value) => updateTextareaValue('slide10-carry', value)}
            fillHeight={true}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-white text-base mb-4 font-arial">
            Welche Projekte nehmen wir uns vor?
          </div>
          <TextArea 
            placeholder="Unsere Projekte ..." 
            value={textareaValues['slide10-projects'] || ''}
            onChange={(value) => updateTextareaValue('slide10-projects', value)}
            fillHeight={true}
          />
        </div>
      </div>
    ),
  },
  // Slide 11
  {
    id: 11,
    label: { number: "03", text: "The new year" },
    content: (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="text-white text-sm font-arial mb-3 flex-shrink-0">
          Worauf willst du deinen individuellen Fokus legen? Welche Wichtigkeit
          hat dieser Bereich jeweils?
        </div>
        <div className="flex-1 min-h-0">
          <FocusAreasSection 
            starRatings={starRatings}
            updateStarRating={updateStarRating}
            textareaValues={textareaValues}
            updateTextareaValue={updateTextareaValue}
          />
        </div>
      </div>
    ),
  },
  // Slide 12
  {
    id: 12,
    label: { number: "04", text: "Plan and terminate" },
    title:
      "Jetzt geht es darum, eure Ideen fürs kommende Jahr zu sammeln und auf ihre Machbarkeit zu untersuchen und zu priorisieren.",
  },
  // Slide 13
  {
    id: 13,
    label: { number: "04", text: "Plan and terminate" },
    content: (
      <div className="flex-1 flex flex-col h-full">
        <div className="text-white text-base font-arial mb-4 flex-shrink-0">
          Nehmt euch ein Blatt Papier und ordnet eure Ziele auf dem Graphen ein.
          Ihr könnt wenige große bzw. mehrere kleine Ziele festlegen. Ihr
          solltet nur die Ziele angehen, die einen hohen Impact haben und
          einfach umsetzbar sind.
        </div>
        <div className="flex-1 flex items-center justify-center min-h-0 mb-4">
          <img 
            src="/lovable-uploads/20b3daee-a65a-46df-9f4e-7fb1cd871631.png" 
            alt="Goals planning graph" 
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
        </div>
        <a 
          href="/Vorlage.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 border border-white rounded-full text-white text-base font-arial hover:bg-white hover:text-black transition-colors flex-shrink-0 flex items-center justify-center no-underline"
        >
          Vorlage herunterladen
        </a>
      </div>
    ),
  },
];


interface SlideProps {
  slide: SlideData;
  isActive: boolean;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  currentSlide: number;
  totalSlides: number;
}

const Slide: React.FC<SlideProps> = ({
  slide,
  isActive,
  onPrevSlide,
  onNextSlide,
  currentSlide,
  totalSlides,
}) => (
  <div className="w-full h-full flex items-center justify-center bg-black text-white select-none">
    <div className="w-full max-w-[500px] max-h-[780px] h-full flex flex-col responsive-main-padding">
      <div className="flex-1 bg-[#161616] rounded-lg md:rounded-2xl responsive-card-padding flex flex-col min-h-0 relative">
        <button
          onClick={onPrevSlide}
          className="absolute left-0 top-0 w-8 h-full z-10 cursor-pointer"
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        />

        <button
          onClick={onNextSlide}
          className="absolute right-0 top-0 w-8 h-full z-10 cursor-pointer"
          disabled={currentSlide === totalSlides - 1}
          aria-label="Next slide"
        />

        {slide.id === 1 ? (
          // Special layout for slide 1 - center pill & title, bottom content
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-[24px]">
              <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-bold font-kokoro leading-[100%]">
                {slide.label.number}
                {slide.label.text && (
                  <span className="ml-1">{slide.label.text}</span>
                )}
              </div>
              </div>
              {slide.title && (
                <div className="font-arial whitespace-pre-line text-[32px] leading-[120%] text-left">
                  {slide.title}
                </div>
              )}
            </div>
            {slide.content && (
              <div className="mt-auto">
                {slide.content}
              </div>
            )}
          </div>
        ) : [4, 8, 12].includes(slide.id) ? (
          // Special layout for title slides (not slide 24)
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-[24px]">
               <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-bold font-kokoro leading-[100%]">
                {slide.label.number}
                {slide.label.text && (
                  <span className="ml-1">{slide.label.text}</span>
                )}
              </div>
            </div>
            {slide.title && (
              <div className="font-arial whitespace-pre-line text-[32px] leading-[120%] text-left">
                {slide.title}
              </div>
            )}
            {slide.content && (
              <div className="mt-auto">
                {slide.content}
              </div>
            )}
          </div>
        ) : slide.id === 24 ? (
          // Special layout for final slide - same as slide 1 layout
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-[24px]">
                 <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-bold font-kokoro leading-[100%]">
                  {slide.label.number}
                  {slide.label.text && (
                    <span className="ml-1">{slide.label.text}</span>
                  )}
                </div>
              </div>
              {slide.title && (
                <div className="font-arial whitespace-pre-line text-[32px] leading-[120%] text-left">
                  {slide.title}
                </div>
              )}
            </div>
            {slide.content && (
              <div className="mt-auto">
                {slide.content}
              </div>
            )}
          </div>
        ) : slide.id === 2 || slide.id === 11 || slide.id === 13 ? (
          // Slide 2 (draggable emojis), Slide 11 (focus areas), and Slide 13 (image) - no scrolling
          <>
            <div className="mb-4 md:mb-6">
               <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-bold font-kokoro leading-[100%]">
                {slide.label.number}
                {slide.label.text && (
                  <span className="ml-1">{slide.label.text}</span>
                )}
              </div>
            </div>

            {slide.title && (
              <div className="font-arial whitespace-pre-line responsive-subtitle leading-[120%] mb-6 md:mb-10">
                {slide.title}
              </div>
            )}
            
            <div className="flex-1 flex flex-col min-h-0">{slide.content}</div>
          </>
        ) : (
          // Regular layout for other slides with scrolling
          <>
            <div className="mb-4 md:mb-6 flex-shrink-0">
              <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-bold font-kokoro leading-[100%]">
                {slide.label.number}
                {slide.label.text && (
                  <span className="ml-1">{slide.label.text}</span>
                )}
              </div>
            </div>

            {slide.title && (
              <div className="font-arial whitespace-pre-line responsive-subtitle leading-[120%] mb-6 md:mb-10 flex-shrink-0">
                {slide.title}
              </div>
            )}
            
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">{slide.content}</div>
          </>
        )}
      </div>
    </div>
  </div>
);

export default function YearPlannerGenerator() {
  // Clear expired data on component mount
  useEffect(() => {
    clearExpiredItems();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = getItemWithExpiry('yearPlanner-currentSlide');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // State for all textarea values with localStorage persistence
  const [textareaValues, setTextareaValues] = useState<{[key: string]: string}>(() => {
    if (typeof window === 'undefined') return {};
    const saved = getItemWithExpiry('yearPlanner-textareas');
    return saved || {};
  });

  // State for star ratings with localStorage persistence
  const [starRatings, setStarRatings] = useState<{[key: string]: number}>(() => {
    if (typeof window === 'undefined') return {};
    const saved = getItemWithExpiry('yearPlanner-starRatings');
    return saved || {};
  });

  // State for dragged emojis with localStorage persistence
  const [draggedEmojis, setDraggedEmojis] = useState<Array<{id: string, emoji: string, label: string, x: number, y: number}>>(() => {
    if (typeof window === 'undefined') return [];
    const saved = getItemWithExpiry('yearPlanner-draggedEmojis');
    return saved || [];
  });

  const updateTextareaValue = (key: string, value: string) => {
    const newValues = { ...textareaValues, [key]: value };
    setTextareaValues(newValues);
    setItemWithExpiry('yearPlanner-textareas', newValues);
  };

  const updateStarRating = (key: string, value: number) => {
    const newRatings = { ...starRatings, [key]: value };
    setStarRatings(newRatings);
    setItemWithExpiry('yearPlanner-starRatings', newRatings);
  };

  const updateCurrentSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
    setItemWithExpiry('yearPlanner-currentSlide', slideIndex.toString());
  };

  const updateDraggedEmojis = (emojis: Array<{id: string, emoji: string, label: string, x: number, y: number}>) => {
    setDraggedEmojis(emojis);
    setItemWithExpiry('yearPlanner-draggedEmojis', emojis);
  };

  // Create slides array with state integration
  const slidesArray = useMemo(() => {
    const baseSlides = slides(textareaValues, updateTextareaValue, starRatings, updateStarRating, draggedEmojis, updateDraggedEmojis);
    
    // Generate slides 14-23 with goal planning template
    for (let i = 14; i <= 23; i++) {
      baseSlides.push({
        id: i,
        label: { number: "04", text: "Plan and terminate" },
        content: (
          <div className="space-y-6 flex-1 flex flex-col">
            <div>
              <div className="text-white text-base mb-2 font-arial">Ziel</div>
              <TextArea 
                placeholder="Ziel beschreiben" 
                value={textareaValues[`slide${i}-goal`] || ''}
                onChange={(value) => updateTextareaValue(`slide${i}-goal`, value)}
                fillHeight={true}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-white text-base flex-1 font-arial">Prio</div>
              <StarRating 
                value={starRatings[`slide${i}-prio`] || 0}
                onChange={(value) => updateStarRating(`slide${i}-prio`, value)}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="text-white text-base mb-2 font-arial">
                Wie messen wir den Erfolg?
              </div>
              <TextArea 
                placeholder="So messen wir ..." 
                value={textareaValues[`slide${i}-measure`] || ''}
                onChange={(value) => updateTextareaValue(`slide${i}-measure`, value)}
                fillHeight={true}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="text-white text-base mb-2 font-arial">
                Wie gehen wir es Schritt für Schritt an?
              </div>
              <TextArea 
                placeholder="Diese Schritte machen wir, um es zu erreichen" 
                value={textareaValues[`slide${i}-steps`] || ''}
                onChange={(value) => updateTextareaValue(`slide${i}-steps`, value)}
                fillHeight={true}
              />
            </div>
          </div>
        ),
      });
    }

    // Final slide 24
    const handleExport = () => {
      window.print();
    };

    const handleClearData = () => {
      if (window.confirm('Möchtest du wirklich alle Einträge löschen?')) {
        clearAllYearPlannerData();
        window.location.reload();
      }
    };

    baseSlides.push({
      id: 24,
      label: { number: "Finally", text: "" },
      title:
        "Es ist geschafft 🎉\nStoßt auf euch an und habt ein geiles Jahr ihr Süßen!",
      content: (
        <div className="flex flex-col items-center gap-10 w-full">
          <button
            onClick={handleExport}
            className="w-full max-w-md h-12 border border-white rounded-full text-white text-base font-arial hover:bg-white hover:text-black transition-colors flex items-center justify-center"
          >
            Inhalte exportieren
          </button>
          <button
            onClick={handleClearData}
            className="flex items-center justify-center gap-2 text-white text-xs font-arial hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" x2="10" y1="11" y2="17"/>
              <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
            Meine Einträge löschen
          </button>
        </div>
      ),
    });

    return baseSlides;
  }, [textareaValues, updateTextareaValue, starRatings, updateStarRating, draggedEmojis, updateDraggedEmojis]);

  const nextSlide = () => {
    if (currentSlide < slidesArray.length - 1) {
      updateCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      updateCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    updateCurrentSlide(index);
  };

  // Touch/Mouse handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(translateX) > 100) {
      if (translateX > 0 && currentSlide > 0) {
        updateCurrentSlide(currentSlide - 1);
      } else if (translateX < 0 && currentSlide < slidesArray.length - 1) {
        updateCurrentSlide(currentSlide + 1);
      }
    }
    setTranslateX(0);
  };

  // Keyboard navigation and iOS keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    // Mobile keyboard handling to prevent page position issues
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Store current scroll position
        const scrollY = window.scrollY;
        
        // For iOS devices
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollY}px`;
          document.body.style.width = '100%';
        }
        
        // For Android devices and other mobile browsers
        if (/Android/.test(navigator.userAgent)) {
          // Prevent viewport meta tag changes that can cause issues
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
          }
        }
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // For iOS devices
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          
          // Restore scroll position
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
        }
        
        // For Android devices
        if (/Android/.test(navigator.userAgent)) {
          // Small delay to ensure keyboard is fully closed
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 150);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <div className="w-full h-dvh bg-black overflow-hidden relative" style={{ touchAction: 'pan-x', overscrollBehavior: 'none' }}>
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-20 w-full px-4 pt-2 md:pt-4">
        <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
          <h1 className="text-[24px] md:text-[28px] font-bold leading-[120%] font-kokoro text-white">
            Year Planning
          </h1>
          <div className="flex-1 text-right text-sm md:text-base font-arial text-white">
            {currentSlide + 1} / 24
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full px-4 pb-2 md:pb-4">
        <div className="flex items-center gap-2 mt-2 md:mt-4 text-sm md:text-base font-arial text-white">
          <a 
            href="https://relationshipbydesign.de/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
          >
            Relationship by design
          </a>
          <a 
            href="mailto:hello@relationshipbydesign.de?subject=Feedback Year Planning"
            className="whitespace-nowrap"
          >
            Feedback geben
          </a>
        </div>
      </div>

      {/* Slider container */}
      <div
        ref={sliderRef}
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(calc(-${currentSlide * (100 / slidesArray.length)}% + ${translateX}px))`,
          width: `${slidesArray.length * 100}vw`,
          paddingTop: '40px',
          paddingBottom: '40px'
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {slidesArray.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0"
            style={{ width: `${100 / slidesArray.length}%` }}
          >
            <Slide
              slide={slide}
              isActive={index === currentSlide}
              onPrevSlide={prevSlide}
              onNextSlide={nextSlide}
              currentSlide={currentSlide}
              totalSlides={slidesArray.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}