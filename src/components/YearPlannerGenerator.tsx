import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";

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
  const componentId = useRef(Math.random().toString(36).substr(2, 9)).current;

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
            style={{ color: starColor }}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
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
}

const DraggableEmojiIcon: React.FC<DraggableEmojiIconProps> = ({ emoji, label, onStartDrag }) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onStartDrag(emoji, label);
  };

  return (
    <div className="flex items-center gap-2 cursor-pointer select-none" onMouseDown={handleMouseDown}>
      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
        <span className="text-2xl pointer-events-none">{emoji}</span>
      </div>
      <span className="text-white text-base font-arial flex-1 pointer-events-none">{label}</span>
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

const FocusAreasSection: React.FC = () => {
  const [focusAreas, setFocusAreas] = useState(Array(5).fill(""));

  const handleFocusChange = (index: number, value: string) => {
    const newFocusAreas = [...focusAreas];
    newFocusAreas[index] = value;
    setFocusAreas(newFocusAreas);
  };

  return (
    <div className="flex-1 flex flex-col gap-1">
      {[1, 2, 3, 4, 5].map((i, index) => (
        <div key={i} className="bg-[#FFE299] flex flex-col flex-1 min-h-0">
          <div className="p-2 flex-1 min-h-0">
            <textarea
              placeholder="Fokus"
              value={focusAreas[index]}
              onChange={(e) => handleFocusChange(index, e.target.value)}
              className={`w-full h-full bg-transparent ${focusAreas[index] ? 'text-black' : 'text-[#B29F71]'} placeholder-[#B29F71] resize-none border-none outline-none font-arial text-xs leading-[120%]`}
            />
          </div>
          <div className="px-2 pb-1 flex justify-end">
            <StarRating starColor="black" />
          </div>
        </div>
      ))}
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
}

const DraggableFloatingEmoji: React.FC<DraggableFloatingEmojiProps> = ({ 
  id, emoji, label, initialX, initialY, onDrag 
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Simple boundaries - keep within a reasonable area
    const constrainedX = Math.max(-50, Math.min(400, newX));
    const constrainedY = Math.max(-50, Math.min(300, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
    onDrag(id, constrainedX, constrainedY);
  }, [isDragging, dragStart, id, onDrag]);

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
      ref={containerRef}
      className={`absolute w-12 h-12 bg-black rounded-full flex items-center justify-center cursor-move select-none z-20 ${isDragging ? 'opacity-75' : ''}`}
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

const SlideWithDraggableEmojis: React.FC = () => {
  const [draggedEmojis, setDraggedEmojis] = useState<Array<{id: string, emoji: string, label: string, x: number, y: number}>>([]);
  const [draggedEmojiId, setDraggedEmojiId] = useState<string | null>(null);

  const handleStartDrag = (emoji: string, label: string) => {
    const newId = `${emoji}-${Date.now()}`;
    const newEmoji = {
      id: newId,
      emoji,
      label,
      x: 50, // Start position
      y: 50
    };
    setDraggedEmojis(prev => [...prev, newEmoji]);
    setDraggedEmojiId(newId);
  };

  const handleEmojiDrag = (id: string, x: number, y: number) => {
    setDraggedEmojis(prev => prev.map(emoji => 
      emoji.id === id ? { ...emoji, x, y } : emoji
    ));
  };

  return (
    <div className="flex flex-col h-full gap-8">
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
          />
        ))}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <DraggableEmojiIcon emoji="❤️" label="Beziehung" onStartDrag={handleStartDrag} />
            <DraggableEmojiIcon emoji="👯‍♀️" label="Freunde" onStartDrag={handleStartDrag} />
            <DraggableEmojiIcon emoji="🐶" label="Kalle" onStartDrag={handleStartDrag} />
          </div>
          <div className="space-y-2">
            <DraggableEmojiIcon emoji="🤸" label="Hobbies" onStartDrag={handleStartDrag} />
            <DraggableEmojiIcon emoji="🫀" label="Gesundheit" onStartDrag={handleStartDrag} />
            <DraggableEmojiIcon emoji="👩‍💻" label="Beruf" onStartDrag={handleStartDrag} />
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

const slides = (textareaValues: {[key: string]: string}, updateTextareaValue: (key: string, value: string) => void): SlideData[] => [
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
      <SlideWithDraggableEmojis />
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
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Sexualität</div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">
            Emotionale Verbundenheit
          </div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Kommunikation</div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Vertrauen</div>
          <StarRating />
        </div>
        <div className="text-center text-white text-xs font-arial mt-auto">
          Füllt die Sterne aus, Doppelklick für halbgefüllt
        </div>
      </div>
    ),
  },
  // Slide 6
  {
    id: 6,
    label: { number: "02", text: "Health Check" },
    content: (
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          <div className="text-white text-base font-arial">Gemeinsame Zeit</div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">
            Zusammen gelacht
          </div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">
            Konfliktbewältigung
          </div>
          <StarRating />
        </div>
        <div className="space-y-2">
          <div className="text-white text-base font-arial">
            Freiheit, Unabhängigkeit
          </div>
          <StarRating />
        </div>
        <div className="text-center text-white text-xs font-arial mt-auto">
          Füllt die Sterne aus, Doppelklick für halbgefüllt
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
        <div className="text-white text-sm font-arial mb-4 flex-shrink-0">
          Worauf willst du deinen individuellen Fokus legen? Welche Wichtigkeit
          hat dieser Bereich jeweils?
        </div>
        <FocusAreasSection />
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
        <button className="w-full h-12 border border-white rounded-full text-white text-base font-arial hover:bg-white hover:text-black transition-colors flex-shrink-0">
          Vorlage herunterladen
        </button>
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
              <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-black font-kokoro leading-[100%]">
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
        ) : [4, 8, 12, 24].includes(slide.id) ? (
          // Special layout for other title slides
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-[24px]">
              <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-black font-kokoro leading-[100%]">
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
        ) : slide.id === 2 || slide.id === 11 || slide.id === 13 ? (
          // Slide 2 (draggable emojis), Slide 11 (focus areas), and Slide 13 (image) - no scrolling
          <>
            <div className="mb-4 md:mb-6">
              <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-black font-kokoro leading-[100%]">
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
              <div className="inline-flex items-center px-3 py-1 border border-white rounded-full text-xs font-black font-kokoro leading-[100%]">
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // State for all textarea values
  const [textareaValues, setTextareaValues] = useState<{[key: string]: string}>({});

  const updateTextareaValue = (key: string, value: string) => {
    setTextareaValues(prev => ({ ...prev, [key]: value }));
  };

  // Create slides array with state integration
  const slidesArray = useMemo(() => {
    const baseSlides = slides(textareaValues, updateTextareaValue);
    
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
              <StarRating />
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
    baseSlides.push({
      id: 24,
      label: { number: "Finally", text: "" },
      title:
        "Es ist geschafft 🎉\nStoßt auf euch an und habt ein geiles Jahr ihr Süßen!",
    });

    return baseSlides;
  }, [textareaValues, updateTextareaValue]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesArray.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesArray.length) % slidesArray.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
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
      if (translateX > 0) {
        prevSlide();
      } else {
        nextSlide();
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
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-20 w-full px-4 pt-4">
        <div className="flex items-center gap-2 md:gap-4 mb-4">
          <h1 className="text-[28px] font-bold italic leading-[120%] font-kokoro text-white">
            Year Planning
          </h1>
          <div className="flex-1 text-right text-sm md:text-base font-arial text-white">
            {currentSlide + 1} / 24
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full px-4 pb-4">
        <div className="flex items-center gap-2 mt-4 text-base font-arial text-white">
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
          paddingTop: '54px',
          paddingBottom: '54px'
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